with open('server/controllers/webhooks.controller.ts', 'r') as f:
    content = f.read()

import re

old_webhook = """export const cashfreeWebhook = async (req: Request, res: Response) => {

  try {
    const payload = req.body;
    const eventType = payload.type;
    const sub = payload.data?.subscription || payload.data || payload;
    const subId = sub.cf_subscription_id || sub.subReferenceId || sub.subscription_id;
    if (!subId) return res.json({ received: true });

    let existingSub = await db.select().from(subscriptions).where(eq(subscriptions.gatewaySubscriptionId, String(subId))).limit(1);
    if (!existingSub.length && sub.subscription_id) {
        existingSub = await db.select().from(subscriptions).where(eq(subscriptions.gatewaySubscriptionId, String(sub.subscription_id))).limit(1);
    }
    if (!existingSub.length) return res.json({ received: true });
    const subscription = existingSub[0];

    if (eventType === "SUBSCRIPTION_ACTIVE" || eventType === "SUBSCRIPTION_PAYMENT_SUCCESS") {
      await db.update(subscriptions).set({ status: "active", gatewayStatus: "active", updatedAt: new Date() }).where(eq(subscriptions.id, subscription.id));
      const tx = await db.select().from(transactions).where(and(eq(transactions.subscriptionId, subscription.id), eq(transactions.status, "pending"))).limit(1);
      if (tx.length > 0) {
        await activateSubscriptionFromTransaction(tx[0], null, "cashfree");
      }
    } else if (eventType === "SUBSCRIPTION_CANCELLED") {
      await db.update(subscriptions).set({ status: "cancelled", gatewayStatus: "cancelled", updatedAt: new Date() }).where(eq(subscriptions.id, subscription.id));
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Cashfree Webhook Error:", error);
    res.status(500).send("Webhook Error");
  }

};"""

new_webhook = """export const cashfreeWebhook = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log("Cashfree Webhook Payload:", JSON.stringify(payload, null, 2));
    const eventType = payload.type;
    const sub = payload.data?.subscription || payload.data || payload;
    const subId = sub.cf_subscription_id || sub.subReferenceId || sub.subscription_id;
    if (!subId) return res.json({ received: true });

    let existingSub = await db.select().from(subscriptions).where(eq(subscriptions.gatewaySubscriptionId, String(subId))).limit(1);
    if (!existingSub.length && sub.subscription_id) {
        existingSub = await db.select().from(subscriptions).where(eq(subscriptions.gatewaySubscriptionId, String(sub.subscription_id))).limit(1);
    }
    
    if (!existingSub.length) {
      // Find the pending transaction instead
      const txData = await db.select().from(transactions).where(eq(transactions.providerTransactionId, String(sub.subscription_id))).limit(1);
      if (txData.length > 0) {
        if (eventType === "SUBSCRIPTION_ACTIVE" || eventType === "SUBSCRIPTION_PAYMENT_SUCCESS") {
          await db.update(transactions).set({ status: "completed", paidAt: new Date() }).where(eq(transactions.id, txData[0].id));
          await activateSubscriptionFromTransaction(txData[0], String(sub.subscription_id), "cashfree");
        }
        return res.json({ status: "ok" });
      } else {
        return res.json({ received: true });
      }
    }
    
    const subscription = existingSub[0];

    if (eventType === "SUBSCRIPTION_ACTIVE" || eventType === "SUBSCRIPTION_PAYMENT_SUCCESS") {
      await db.update(subscriptions).set({ status: "active", gatewayStatus: "active", updatedAt: new Date() }).where(eq(subscriptions.id, subscription.id));
      const tx = await db.select().from(transactions).where(and(eq(transactions.subscriptionId, subscription.id), eq(transactions.status, "pending"))).limit(1);
      if (tx.length > 0) {
        await db.update(transactions).set({ status: "completed", paidAt: new Date() }).where(eq(transactions.id, tx[0].id));
        await activateSubscriptionFromTransaction(tx[0], null, "cashfree");
      }
    } else if (eventType === "SUBSCRIPTION_CANCELLED") {
      await db.update(subscriptions).set({ status: "cancelled", gatewayStatus: "cancelled", updatedAt: new Date() }).where(eq(subscriptions.id, subscription.id));
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Cashfree Webhook Error:", error);
    res.status(500).send("Webhook Error");
  }
};"""

if old_webhook in content:
    content = content.replace(old_webhook, new_webhook)
    with open('server/controllers/webhooks.controller.ts', 'w') as f:
        f.write(content)
    print("Replaced cashfreeWebhook perfectly")
else:
    print("Could not find the exact old_webhook string")
