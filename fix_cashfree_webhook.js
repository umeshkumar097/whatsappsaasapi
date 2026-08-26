import fs from 'fs';

const file = 'server/controllers/webhooks.controller.ts';
let code = fs.readFileSync(file, 'utf8');

const webhookLogic = `export const cashfreeWebhook = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log("Cashfree Webhook Payload:", JSON.stringify(payload, null, 2));
    const eventType = payload.type;
    
    // ----------------------------------------------------
    // WALLET RECHARGE ORDER PAYMENTS
    // ----------------------------------------------------
    if (eventType === "PAYMENT_SUCCESS_WEBHOOK" && payload.data?.order?.order_id?.startsWith("wallet_tx_")) {
      const order_id = payload.data.order.order_id;
      const txId = parseInt(order_id.replace("wallet_tx_", ""));
      const [tx] = await db.select().from(walletTransactions).where(eq(walletTransactions.id, txId));
      
      if (tx && tx.status !== "completed") {
        const wallet = await db.query.wallets.findFirst({ where: eq(wallets.id, tx.walletId) });
        if (wallet) {
          const newBalance = (parseFloat(wallet.balance as string) + parseFloat(tx.amount as string)).toFixed(4);
          await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.id, wallet.id));
          await db.update(walletTransactions).set({ status: "completed" }).where(eq(walletTransactions.id, tx.id));
          console.log(\`Cashfree Webhook: Credited wallet for \${order_id}\`);
        }
      }
      return res.json({ received: true });
    }

    // ----------------------------------------------------
    // SUBSCRIPTION PAYMENTS
    // ----------------------------------------------------
`;

code = code.replace('export const cashfreeWebhook = async (req: Request, res: Response) => {\n  try {\n    const payload = req.body;\n    console.log("Cashfree Webhook Payload:", JSON.stringify(payload, null, 2));\n    const eventType = payload.type;', webhookLogic);

fs.writeFileSync(file, code);
