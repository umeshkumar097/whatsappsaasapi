import fs from 'fs';

const file = 'server/controllers/wallet.controller.ts';
let code = fs.readFileSync(file, 'utf8');

const newAddFunds = `
import { getProviderConfig } from "../services/payment-gateway.service";
import axios from "axios";

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
      order_id: \`wallet_tx_\${tx.id}\`,
      order_amount: Number(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: \`usr_\${user.id}\`,
        customer_name: user.name || "User",
        customer_email: user.email,
        customer_phone: user.phone || "9999999999"
      },
      order_meta: {
        return_url: \`https://app.waki.in/wallet?order_id=wallet_tx_\${tx.id}\`
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
        payment_link: response.data.payment_link
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
`;

code = code.replace(/export const addFunds = asyncHandler[\s\S]*?(?=\nexport const)/, newAddFunds.trim() + '\n\n');

fs.writeFileSync(file, code);
console.log("Updated addFunds in wallet.controller.ts");
