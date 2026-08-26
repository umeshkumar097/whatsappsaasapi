import re

filepath = 'server/controllers/webhooks.controller.ts'
with open(filepath, 'r') as f:
    content = f.read()

old_code = """    const payload = req.body;
    const eventType = payload.type;
    const subId = payload.data?.subscription?.subscription_id;
    if (!subId) return res.json({ received: true });

    const existingSub = await db.select().from(subscriptions).where(eq(subscriptions.gatewaySubscriptionId, subId)).limit(1);"""

new_code = """    const payload = req.body;
    const eventType = payload.type;
    const sub = payload.data?.subscription || payload.data || payload;
    const subId = sub.cf_subscription_id || sub.subReferenceId || sub.subscription_id;
    if (!subId) return res.json({ received: true });

    let existingSub = await db.select().from(subscriptions).where(eq(subscriptions.gatewaySubscriptionId, String(subId))).limit(1);
    if (!existingSub.length && sub.subscription_id) {
        existingSub = await db.select().from(subscriptions).where(eq(subscriptions.gatewaySubscriptionId, String(sub.subscription_id))).limit(1);
    }"""

content = content.replace(old_code, new_code)

with open(filepath, 'w') as f:
    f.write(content)
print("Replaced webhook parser")
