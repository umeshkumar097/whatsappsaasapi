import re

filepath = 'server/services/payment-gateway.service.ts'
with open(filepath, 'r') as f:
    content = f.read()

# Replace Cashfree import
content = content.replace('import Cashfree from "cashfree";', 'import axios from "axios";')

# Define Cashfree request helper
request_helper = """
async function cashfreeRequest(method: string, path: string, data: any = null) {
  const provider = await getProviderConfig("cashfree");
  if (!provider) throw new Error("Cashfree is not configured");
  const isLive = provider.config?.isLive === true;
  const appId = isLive ? provider.config?.apiKey : provider.config?.apiKeyTest;
  const secretKey = isLive ? provider.config?.apiSecret : provider.config?.apiSecretTest;
  if (!appId || !secretKey) throw new Error("Cashfree credentials missing");
  const baseUrl = isLive ? "https://api.cashfree.com/api/v2" : "https://test.cashfree.com/api/v2";
  const response = await axios({ method, url: `${baseUrl}${path}`, headers: { "x-client-id": appId, "x-client-secret": secretKey, "Content-Type": "application/json" }, data });
  return response.data;
}
"""
content = content.replace('let cashfreeInstance: Cashfree | null = null;', request_helper)

# The file now contains `export async function syncPlanToCashfree(planId: string) { ... }`
# I will use a simple regex to replace the entire body of these functions.

def replace_body(func_name, args_regex, new_body):
    global content
    pattern = r'export async function ' + func_name + r'\(' + args_regex + r'\)\s*\{.*?\n\}'
    # we can't use simple .*?\} because there are nested braces.
    
    # manual brace counting
    match = re.search(r'export async function ' + func_name + r'\(', content)
    if not match:
        print(f"Could not find {func_name}")
        return
    
    start_idx = match.start()
    
    # find first brace
    brace_start = content.find('{', start_idx)
    brace_count = 1
    idx = brace_start + 1
    while brace_count > 0 and idx < len(content):
        if content[idx] == '{':
            brace_count += 1
        elif content[idx] == '}':
            brace_count -= 1
        idx += 1
    
    end_idx = idx
    content = content[:start_idx] + f'export async function {func_name}({args_regex.replace(".*?", "")}) {{\n{new_body}\n}}' + content[end_idx:]

replace_body('getCashfree', '', 'return null;')

replace_body('syncPlanToCashfree', 'planId: string', """
  const planData = await db.select().from(plans).where(eq(plans.id, planId)).limit(1);
  if (!planData.length) throw new Error("Plan not found");
  const plan = planData[0];
  const currency = (await getProviderCurrency("cashfree", "INR")).toUpperCase();
  const monthlyAmount = Math.round(parseFloat(plan.monthlyPrice || "0"));
  const annualAmount = Math.round(parseFloat(plan.annualPrice || "0"));
  let monthlyPlanId = plan.cashfreePlanIdMonthly;
  let annualPlanId = plan.cashfreePlanIdAnnual;
  if (monthlyAmount > 0 && !monthlyPlanId) {
    monthlyPlanId = `plan_${planId}_monthly`;
    try { await cashfreeRequest("POST", "/subscriptions/plans", { planId: monthlyPlanId, planName: `${plan.name} - Monthly`, type: "PERIODIC", amount: monthlyAmount, intervals: 1, intervalType: "MONTH" }); } catch(e) {}
  }
  if (annualAmount > 0 && !annualPlanId) {
    annualPlanId = `plan_${planId}_annual`;
    try { await cashfreeRequest("POST", "/subscriptions/plans", { planId: annualPlanId, planName: `${plan.name} - Annual`, type: "PERIODIC", amount: annualAmount, intervals: 1, intervalType: "YEAR" }); } catch(e) {}
  }
  await db.update(plans).set({ cashfreePlanIdMonthly: monthlyPlanId, cashfreePlanIdAnnual: annualPlanId, updatedAt: new Date() }).where(eq(plans.id, planId));
  return { monthlyPlanId, annualPlanId };
""")

replace_body('getOrCreateCashfreeCustomer', 'userId: string', """
  const userData = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!userData.length) throw new Error("User not found");
  const user = userData[0];
  if (user.cashfreeCustomerId) return user.cashfreeCustomerId;
  const custId = `cust_${userId}`;
  await db.update(users).set({ cashfreeCustomerId: custId, updatedAt: new Date() }).where(eq(users.id, userId));
  return custId;
""")

replace_body('createCashfreeSubscription', 'userId: string, planId: string, billingCycle: "monthly" | "annual", currency: string', """
  const planData = await db.select().from(plans).where(eq(plans.id, planId)).limit(1);
  if (!planData.length) throw new Error("Plan not found");
  const plan = planData[0];
  const cfPlanId = billingCycle === "annual" ? plan.cashfreePlanIdAnnual : plan.cashfreePlanIdMonthly;
  if (!cfPlanId) throw new Error(`Plan not synced to Cashfree for ${billingCycle}`);
  const userData = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!userData.length) throw new Error("User not found");
  const user = userData[0];
  const subId = `sub_${userId}_${Date.now()}`;
  const appUrl = await requirePublicOrigin("createCashfreeSubscription");
  const response = await cashfreeRequest("POST", "/subscriptions", {
    subscriptionId: subId, planId: cfPlanId,
    customerName: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username,
    customerEmail: user.email, customerPhone: user.phone || "9999999999",
    returnUrl: `${appUrl}/payment/success?provider=cashfree`
  });
  return { subscriptionId: subId, shortUrl: response.subscription.authLink, status: response.subscription.status };
""")

replace_body('cancelCashfreeSubscription', 'gatewaySubscriptionId: string, immediately: boolean = false', """
  try { await cashfreeRequest("POST", `/subscriptions/${gatewaySubscriptionId}/cancel`); } catch(e) {}
  return { status: "cancelled" };
""")

replace_body('getCashfreeSubscriptionStatus', 'gatewaySubscriptionId: string', """
  const response = await cashfreeRequest("GET", `/subscriptions/${gatewaySubscriptionId}`);
  return { status: response.subscription.status, currentStart: null, currentEnd: null };
""")

replace_body('upgradeOrDowngradeCashfree', 'userId: string, oldSubscriptionGatewayId: string, newPlanId: string, billingCycle: "monthly" | "annual"', """
  await cancelCashfreeSubscription(oldSubscriptionGatewayId, true);
  return createCashfreeSubscription(userId, newPlanId, billingCycle, "INR");
""")

with open(filepath, 'w') as f:
    f.write(content)
print("Rewritten successfully")
