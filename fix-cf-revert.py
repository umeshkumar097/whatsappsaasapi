with open('server/services/payment-gateway.service.ts', 'r') as f:
    content = f.read()

import re

# We will completely replace the createCashfreeSubscription function
new_func = """export async function createCashfreeSubscription(userId: string, planId: string, billingCycle: "monthly" | "annual", currency: string) {
  const planData = await db.select().from(plans).where(eq(plans.id, planId)).limit(1);
  if (!planData.length) throw new Error("Plan not found");
  const plan = planData[0];
  const cfPlanId = billingCycle === "annual" ? plan.cashfreePlanIdAnnual : plan.cashfreePlanIdMonthly;
  const amount = billingCycle === "annual" ? Math.round(parseFloat(plan.annualPrice || "0")) : Math.round(parseFloat(plan.monthlyPrice || "0"));
  if (!cfPlanId) throw new Error(`Plan not synced to Cashfree`);
  
  const userData = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!userData.length) throw new Error("User not found");
  const user = userData[0];
  
  const subId = `sub_${userId}_${Date.now()}`;
  const appUrl = await requirePublicOrigin("createCashfreeSubscription");

  const provider = await getProviderConfig("cashfree");
  const isLive = provider.config?.isLive === true;
  const appId = isLive ? provider.config?.apiKey : provider.config?.apiKeyTest;
  const secretKey = isLive ? provider.config?.apiSecret : provider.config?.apiSecretTest;
  const baseUrl = isLive ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

  const axios = (await import("axios")).default;
  const res = await axios({
    method: "POST",
    url: `${baseUrl}/subscriptions`,
    headers: {
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "x-api-version": "2023-08-01",
      "Content-Type": "application/json"
    },
    data: {
      subscription_id: subId,
      plan_details: { plan_id: cfPlanId },
      customer_details: {
        customer_name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "User",
        customer_email: user.email,
        customer_phone: (user.phone && user.phone.length >= 10 && user.phone !== "9999999999" && user.phone !== "0000000000") ? user.phone.replace(/[^0-9]/g, "").slice(-10) : "9876543210"
      },
      subscription_meta: { return_url: `${appUrl.replace("http://", "https://")}/payment/success?provider=cashfree` }
    }
  });

  const response = res.data;

  return {
    subscriptionId: response.subscription_id ? response.subscription_id.toString() : subId,
    shortUrl: response.subscription_session_id ? `https://payments.cashfree.com/subscriptions/checkout/${response.subscription_session_id}` : undefined,
    status: response.subscription_status || "pending",
  };
}"""

content = re.sub(r'export async function createCashfreeSubscription\(.*?return \{\n.*?\};\n\}', new_func, content, flags=re.DOTALL)

with open('server/services/payment-gateway.service.ts', 'w') as f:
    f.write(content)
print("Reverted createCashfreeSubscription")
