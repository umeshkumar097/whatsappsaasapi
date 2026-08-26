import { getProviderConfig } from "../services/payment-gateway.service";
import axios from "axios";
import { Request, Response } from "express";
import { db } from "../db";
import { wallets, walletTransactions, messageRates, users, channels } from "../../shared/schema";
import { eq, desc } from "drizzle-orm";
import { asyncHandler } from "../middlewares/error.middleware";

// ── Gupshup Credit Line Sync ──────────────────────────────────────────────
async function getGupshupToken(): Promise<string | null> {
  try {
    const res = await fetch("https://partner.gupshup.io/partner/account/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "info@aiclex.in", password: "Umesh@2003##" })
    });
    const data = await res.json();
    return data.token || null;
  } catch { return null; }
}

export async function syncGupshupCreditLine(userId: string, newBalance: number): Promise<void> {
  try {
    // Find the user's active channel with a Gupshup App ID
    const userChannel = await db.query.channels.findFirst({
      where: eq(channels.createdBy, userId)
    });
    if (!userChannel?.gupshupAppId) return;

    const token = await getGupshupToken();
    if (!token) return;

    // Credit line = wallet balance in rupees (1 rupee = 1 credit unit)
    const creditAmount = Math.max(0, Math.floor(newBalance));

    const res = await fetch(`https://partner.gupshup.io/partner/app/${userChannel.gupshupAppId}/credit/allocate`, {
      method: "POST",
      headers: { "Authorization": token, "Content-Type": "application/x-www-form-urlencoded" },
      body: `creditAllocated=${creditAmount}`
    });
    const data = await res.json();
    console.log(`[WalletSync] Gupshup credit line updated to ${creditAmount} for user ${userId}:`, data.status || data);
  } catch (err) {
    console.error("[WalletSync] Failed to sync Gupshup credit line:", err);
  }
}
// ──────────────────────────────────────────────────────────────────────────

export const getWallet = asyncHandler(async (req: Request, res: Response) => {
  const user = (req.session as any).user;
  let wallet = await db.query.wallets.findFirst({ where: eq(wallets.userId, user.id) });
  
  if (!wallet) {
    [wallet] = await db.insert(wallets).values({ userId: user.id, balance: "0.0000" }).returning();
  }
  
  res.json({ success: true, wallet });
});

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  const user = (req.session as any).user;
  const wallet = await db.query.wallets.findFirst({ where: eq(wallets.userId, user.id) });
  if (!wallet) return res.json({ success: true, transactions: [] });
  
  const transactions = await db.query.walletTransactions.findMany({
    where: eq(walletTransactions.walletId, wallet.id),
    orderBy: (t, { desc }) => [desc(t.createdAt)]
  });
  
  res.json({ success: true, transactions });
});

export const addFunds = asyncHandler(async (req: Request, res: Response) => {
  const { amount, description } = req.body;
  const user = (req as any).user;
  
  if (!amount || amount <= 0) return res.status(400).json({ success: false, message: "Invalid amount" });
  
  // 1. Get Cashfree Credentials
  const provider = await getProviderConfig("cashfree");
  if (!provider || !provider.isActive) {
    return res.status(400).json({ success: false, message: "Cashfree is not configured or active" });
  }
  
  const isLive = provider.config?.isLive === true;
  const appId = isLive ? provider.config?.apiKey : provider.config?.apiKeyTest;
  const secretKey = isLive ? provider.config?.apiSecret : provider.config?.apiSecretTest;
  const baseUrl = isLive ? "https://api.cashfree.com/pg/orders" : "https://sandbox.cashfree.com/pg/orders";

  if (!appId || !secretKey) {
    return res.status(400).json({ success: false, message: "Cashfree API keys are missing" });
  }

  // 2. Create pending transaction
  let wallet = await db.query.wallets.findFirst({ where: eq(wallets.userId, user.id) });
  if (!wallet) {
    [wallet] = await db.insert(wallets).values({ userId: user.id, balance: "0.0000" }).returning();
  }

  const [tx] = await db.insert(walletTransactions).values({
    walletId: wallet.id,
    amount: amount.toString(),
    type: "CREDIT",
    status: "pending",
    description: description || "Wallet Recharge via Cashfree"
  }).returning();

  // 3. Create Cashfree Order
  try {
    const orderPayload = {
      order_id: `wallet_tx_${tx.id}`,
      order_amount: Number(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: `usr_${user.id}`,
        customer_name: user.name || "User",
        customer_email: user.email,
        customer_phone: user.phone || "9999999999"
      },
      order_meta: {
        return_url: `https://app.waki.in/wallet?order_id=wallet_tx_${tx.id}`
      }
    };

    const response = await axios.post(baseUrl, orderPayload, {
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    if (response.data && response.data.payment_session_id) {
      return res.json({ 
        success: true, 
        payment_session_id: response.data.payment_session_id,
        isLive: isLive
      });
    } else {
      throw new Error("Invalid response from Cashfree");
    }
  } catch (error: any) {
    console.error("Cashfree order error:", error.response?.data || error.message);
    await db.update(walletTransactions).set({ status: "failed" }).where(eq(walletTransactions.id, tx.id));
    return res.status(500).json({ success: false, message: "Failed to create Cashfree order" });
  }
});


export const getRates = asyncHandler(async (req: Request, res: Response) => {
  const rates = await db.query.messageRates.findMany();
  res.json({ success: true, rates });
});

export const verifyFunds = asyncHandler(async (req: Request, res: Response) => {
  const { order_id } = req.body;
  if (!order_id) return res.status(400).json({ success: false, message: "Missing order_id" });

  const provider = await getProviderConfig("cashfree");
  if (!provider || !provider.isActive) {
    return res.status(400).json({ success: false, message: "Cashfree is not configured" });
  }

  const isLive = provider.config?.isLive === true;
  const appId = isLive ? provider.config?.apiKey : provider.config?.apiKeyTest;
  const secretKey = isLive ? provider.config?.apiSecret : provider.config?.apiSecretTest;
  const baseUrl = isLive ? "https://api.cashfree.com/pg/orders" : "https://sandbox.cashfree.com/pg/orders";

  try {
    const response = await axios.get(`${baseUrl}/${order_id}`, {
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Accept": "application/json"
      }
    });

    const orderData = response.data;
    if (orderData.order_status === "PAID") {
      // Extract UUID from order_id (format: wallet_tx_<UUID>)
      const txUUID = order_id.replace("wallet_tx_", "");
      // Look up by transaction ID (UUID) - works regardless of orderId column
      const [tx] = await db.select().from(walletTransactions).where(eq(walletTransactions.id, txUUID));
      
      if (!tx) return res.status(404).json({ success: false, message: "Transaction not found" });
      
      if (tx.status === "completed") {
        return res.json({ success: true, message: "Already verified" });
      }

      const wallet = await db.query.wallets.findFirst({ where: eq(wallets.id, tx.walletId) });
      if (!wallet) throw new Error("Wallet not found");

      const newBalance = (parseFloat(wallet.balance as string) + parseFloat(tx.amount as string)).toFixed(4);
      await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.id, wallet.id));
      await db.update(walletTransactions).set({ status: "completed" }).where(eq(walletTransactions.id, tx.id));

      // Sync Gupshup credit line with new wallet balance (non-blocking)
      const walletOwner = await db.query.wallets.findFirst({ where: eq(wallets.id, wallet.id) });
      if (walletOwner?.userId) {
        syncGupshupCreditLine(walletOwner.userId, parseFloat(newBalance)).catch(() => {});
      }

      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Payment not completed yet" });
    }
  } catch (error: any) {
    console.error("Verify order error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to verify order" });
  }
});

export const getAllTransactions = asyncHandler(async (req: Request, res: Response) => {
  const allTxs = await db
    .select({
      transaction: walletTransactions,
      wallet: wallets,
      user: {
        id: users.id,
        username: users.username,
        email: users.email
      }
    })
    .from(walletTransactions)
    .innerJoin(wallets, eq(walletTransactions.walletId, wallets.id))
    .innerJoin(users, eq(wallets.userId, users.id))
    .orderBy(desc(walletTransactions.createdAt));

  res.json({ success: true, transactions: allTxs });
});

export const setRates = asyncHandler(async (req: Request, res: Response) => {
  const { rates } = req.body;
  if (!Array.isArray(rates)) {
    return res.status(400).json({ success: false, message: "Rates should be an array" });
  }

  for (const rate of rates) {
    if (rate.category && rate.price) {
      const existing = await db.query.messageRates.findFirst({
        where: eq(messageRates.category, rate.category)
      });
      if (existing) {
        await db.update(messageRates).set({ price: rate.price.toString() }).where(eq(messageRates.id, existing.id));
      } else {
        await db.insert(messageRates).values({ category: rate.category, price: rate.price.toString() });
      }
    }
  }

  res.json({ success: true, message: "Rates updated successfully" });
});
