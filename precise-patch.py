import re

with open('server/services/payment-gateway.service.ts', 'r') as f:
    content = f.read()

# 1. Simple replacements
content = content.replace('Razorpay', 'Cashfree').replace('razorpay', 'cashfree').replace('RAZORPAY', 'CASHFREE')

# 2. Add cashfreeRequest helper at the top (after imports)
cashfree_request_code = """
async function cashfreeRequest(method: string, path: string, data: any = null) {
  const provider = await getProviderConfig("cashfree");
  if (!provider) throw new Error("Cashfree is not configured");
  const isLive = provider.config?.isLive === true;
  const appId = isLive ? provider.config?.apiKey : provider.config?.apiKeyTest;
  const secretKey = isLive ? provider.config?.apiSecret : provider.config?.apiSecretTest;
  if (!appId || !secretKey) throw new Error("Cashfree credentials missing");
  const baseUrl = isLive ? "https://api.cashfree.com/api/v2" : "https://test.cashfree.com/api/v2";
  const axios = (await import("axios")).default;
  const response = await axios({ method, url: `${baseUrl}${path}`, headers: { "x-client-id": appId, "x-client-secret": secretKey, "Content-Type": "application/json" }, data });
  return response.data;
}
"""
if 'async function cashfreeRequest' not in content:
    # insert it after `import { resolvePublicOrigin } from "./public-origin";`
    content = content.replace('import { resolvePublicOrigin } from "./public-origin";', 'import { resolvePublicOrigin } from "./public-origin";\n' + cashfree_request_code)

# 3. Replace syncPlanToCashfree
sync_func_new = """export async function syncPlanToCashfree(planId: string) {
  const planData = await db.select().from(plans).where(eq(plans.id, planId)).limit(1);
  if (!planData.length) throw new Error("Plan not found");
  const plan = planData[0];
  const monthlyAmount = Math.round(parseFloat(plan.monthlyPrice || "0"));
  const annualAmount = Math.round(parseFloat(plan.annualPrice || "0"));
  let monthlyPlanId = plan.cashfreePlanIdMonthly;
  let annualPlanId = plan.cashfreePlanIdAnnual;
  if (monthlyAmount > 0 && !monthlyPlanId) {
    monthlyPlanId = `p_${planId.substring(0, 8)}_m`;
    try { await cashfreeRequest("POST", "/subscription-plans", { planId: monthlyPlanId, planName: `${plan.name} - Monthly`, type: "PERIODIC", amount: monthlyAmount, intervals: 1, intervalType: "MONTH" }); } catch(e) {}
  }
  if (annualAmount > 0 && !annualPlanId) {
    annualPlanId = `p_${planId.substring(0, 8)}_a`;
    try { await cashfreeRequest("POST", "/subscription-plans", { planId: annualPlanId, planName: `${plan.name} - Annual`, type: "PERIODIC", amount: annualAmount, intervals: 1, intervalType: "YEAR" }); } catch(e) {}
  }
  await db.update(plans).set({ cashfreePlanIdMonthly: monthlyPlanId, cashfreePlanIdAnnual: annualPlanId, updatedAt: new Date() }).where(eq(plans.id, planId));
  return { monthlyPlanId, annualPlanId };
}"""
content = re.sub(r'export async function syncPlanToCashfree\([\s\S]*?return \{ monthlyPlanId, annualPlanId \};\n\}', sync_func_new, content, count=1)


# 4. Replace createCashfreeSubscription
create_func_new = """export async function createCashfreeSubscription(userId: string, planId: string, billingCycle: "monthly" | "annual", currency: string) {
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
  const checkoutDomain = isLive ? "https://payments.cashfree.com" : "https://payments-test.cashfree.com";

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
        customer_phone: user.phone || "9999999999"
      },
      subscription_meta: { return_url: `${appUrl}/payment/success?provider=cashfree` },
      authorization_details: { authorization_amount: amount, authorization_amount_refund: false }
    }
  });

  const response = res.data;
  return { subscriptionId: response.cf_subscription_id ? response.cf_subscription_id.toString() : subId, shortUrl: `${checkoutDomain}/subscriptions/checkout/${response.subscription_session_id}`, status: response.subscription_status || "INITIALIZED" };
}"""
content = re.sub(r'export async function createCashfreeSubscription\([\s\S]*?return \{[\s\S]*?status: subscription\.status,[\s\S]*?\};\n\}', create_func_new, content, count=1)


# 5. Replace cancelCashfreeSubscription
cancel_func_new = """export async function cancelCashfreeSubscription(gatewaySubscriptionId: string, immediately: boolean = false) {
  try { await cashfreeRequest("POST", `/subscriptions/${gatewaySubscriptionId}/cancel`); } catch(e) {}
  return { status: "cancelled", cancelAtPeriodEnd: !immediately };
}"""
content = re.sub(r'export async function cancelCashfreeSubscription\([\s\S]*?return \{ status: \(cancelled as any\)\.status \|\| "cancelled", cancelAtPeriodEnd: true \};\n  \}\n\}', cancel_func_new, content, count=1)


# 6. Replace getCashfreeSubscriptionStatus
status_func_new = """export async function getCashfreeSubscriptionStatus(gatewaySubscriptionId: string) {
  const response = await cashfreeRequest("GET", `/subscriptions/${gatewaySubscriptionId}`);
  return { status: response.subscription.status, currentPeriodStart: null, currentPeriodEnd: null, cancelAtPeriodEnd: false };
}"""
content = re.sub(r'export async function getCashfreeSubscriptionStatus\([\s\S]*?currentEnd: sub\.current_end \? new Date\(sub\.current_end \* 1000\) : null,[\s\S]*?\};\n\}', status_func_new, content, count=1)


with open('server/services/payment-gateway.service.ts', 'w') as f:
    f.write(content)
print("Precise patch complete")
