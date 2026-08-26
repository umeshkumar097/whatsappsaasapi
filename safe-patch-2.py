with open('server/services/payment-gateway.service.ts', 'r') as f:
    lines = f.readlines()

def replace_function(lines, func_name, new_code):
    start_idx = -1
    for i, line in enumerate(lines):
        if f"export async function {func_name}(" in line:
            start_idx = i
            break
            
    if start_idx == -1:
        print(f"Could not find {func_name}")
        return lines
        
    end_idx = -1
    brace_count = 0
    seen_first_brace = False
    
    for i in range(start_idx, len(lines)):
        line = lines[i]
        brace_count += line.count('{') - line.count('}')
        if '{' in line:
            seen_first_brace = True
            
        if seen_first_brace and brace_count == 0:
            end_idx = i
            break
            
    if end_idx == -1:
        print(f"Could not find end of {func_name}")
        return lines
        
    return lines[:start_idx] + [new_code + "\n"] + lines[end_idx+1:]


create_code = """export async function createCashfreeSubscription(userId: string, planId: string, billingCycle: "monthly" | "annual", currency: string) {
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

sync_code = """export async function syncPlanToCashfree(planId: string) {
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

cancel_code = """export async function cancelCashfreeSubscription(
  gatewaySubscriptionId: string,
  immediately: boolean = false
) {
  try { await cashfreeRequest("POST", `/subscriptions/${gatewaySubscriptionId}/cancel`); } catch(e) {}
  return { status: "cancelled", cancelAtPeriodEnd: !immediately };
}"""

status_code = """export async function getCashfreeSubscriptionStatus(gatewaySubscriptionId: string) {
  const response = await cashfreeRequest("GET", `/subscriptions/${gatewaySubscriptionId}`);
  return { status: response.subscription.status, currentPeriodStart: null, currentPeriodEnd: null, cancelAtPeriodEnd: false };
}"""

upgrade_code = """export async function upgradeOrDowngradeCashfree(
  userId: string,
  oldSubscriptionGatewayId: string,
  newPlanId: string,
  billingCycle: "monthly" | "annual"
) {
  try { await cashfreeRequest("POST", `/subscriptions/${oldSubscriptionGatewayId}/cancel`); } catch(e) {}
  const currency = "INR";
  return createCashfreeSubscription(userId, newPlanId, billingCycle, currency);
}"""

lines = replace_function(lines, "createCashfreeSubscription", create_code)
lines = replace_function(lines, "syncPlanToCashfree", sync_code)
lines = replace_function(lines, "cancelCashfreeSubscription", cancel_code)
lines = replace_function(lines, "getCashfreeSubscriptionStatus", status_code)
lines = replace_function(lines, "upgradeOrDowngradeCashfree", upgrade_code)

with open('server/services/payment-gateway.service.ts', 'w') as f:
    f.writelines(lines)
    
print("Safe patch 2 complete")
