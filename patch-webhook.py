import re

with open('server/controllers/webhooks.controller.ts', 'r') as f:
    content = f.read()

def replace_body(func_name, args_regex, new_body):
    global content
    match = re.search(r'export const ' + func_name + r' = async \(', content)
    if not match:
        print(f"Could not find {func_name}")
        return
    start_idx = match.start()
    brace_start = content.find('{', start_idx)
    brace_count = 1
    idx = brace_start + 1
    while brace_count > 0 and idx < len(content):
        if content[idx] == '{': brace_count += 1
        elif content[idx] == '}': brace_count -= 1
        idx += 1
    end_idx = idx
    content = content[:start_idx] + f'export const {func_name} = async ({args_regex}) {{\n{new_body}\n}};' + content[end_idx:]

replace_body('cashfreeWebhook', 'req: Request, res: Response', """
  try {
    const payload = req.body;
    const eventType = payload.type;
    const subId = payload.data?.subscription?.subscription_id;
    if (!subId) return res.json({ received: true });

    const existingSub = await db.select().from(subscriptions).where(eq(subscriptions.gatewaySubscriptionId, subId)).limit(1);
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
""")

with open('server/controllers/webhooks.controller.ts', 'w') as f:
    f.write(content)
print("Webhook patched successfully")
