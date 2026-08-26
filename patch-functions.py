import re

filepath = 'server/services/payment-gateway.service.ts'
with open(filepath, 'r') as f:
    content = f.read()

# Replace Razorpay import
content = content.replace('import Razorpay from "razorpay";', 'import axios from "axios";')

# Define new cashfree code
new_code = """
async function cashfreeRequest(method: string, path: string, data: any = null) {
  const provider = await getProviderConfig("cashfree");
  if (!provider) throw new Error("Cashfree is not configured");
  const isLive = provider.config?.isLive === true;
  const appId = isLive ? provider.config?.apiKey : provider.config?.apiKeyTest;
  const secretKey = isLive ? provider.config?.apiSecret : provider.config?.apiSecretTest;
  
  if (!appId || !secretKey) throw new Error("Cashfree credentials missing");
  
  const baseUrl = isLive ? "https://api.cashfree.com/api/v2" : "https://test.cashfree.com/api/v2";
  
  const response = await axios({
    method,
    url: `${baseUrl}${path}`,
    headers: {
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "Content-Type": "application/json"
    },
    data
  });
  return response.data;
}

export async function getCashfreeKeyId(): Promise<string | null> {
  const provider = await getProviderConfig("cashfree");
  if (!provider) return null;
  const isLive = provider.config?.isLive === true;
  return isLive ? provider.config?.apiKey || null : provider.config?.apiKeyTest || null;
}

export async function syncPlanToCashfree(planId: string) {
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
    try {
      await cashfreeRequest("POST", "/subscriptions/plans", {
        planId: monthlyPlanId,
        planName: `${plan.name} - Monthly`,
        type: "PERIODIC",
        amount: monthlyAmount,
        intervals: 1,
        intervalType: "MONTH"
      });
    } catch(e) { console.error(e); }
  }

  if (annualAmount > 0 && !annualPlanId) {
    annualPlanId = `plan_${planId}_annual`;
    try {
      await cashfreeRequest("POST", "/subscriptions/plans", {
        planId: annualPlanId,
        planName: `${plan.name} - Annual`,
        type: "PERIODIC",
        amount: annualAmount,
        intervals: 1,
        intervalType: "YEAR"
      });
    } catch(e) { console.error(e); }
  }

  await db.update(plans).set({
    cashfreePlanIdMonthly: monthlyPlanId,
    cashfreePlanIdAnnual: annualPlanId,
    updatedAt: new Date(),
  }).where(eq(plans.id, planId));

  return { monthlyPlanId, annualPlanId };
}

export async function getOrCreateCashfreeCustomer(userId: string): Promise<string> {
  const userData = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!userData.length) throw new Error("User not found");
  const user = userData[0];
  if (user.cashfreeCustomerId) return user.cashfreeCustomerId;
  const custId = `cust_${userId}`;
  await db.update(users).set({ cashfreeCustomerId: custId, updatedAt: new Date() }).where(eq(users.id, userId));
  return custId;
}

export async function createCashfreeSubscription(userId: string, planId: string, billingCycle: "monthly" | "annual", currency: string) {
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
    subscriptionId: subId,
    planId: cfPlanId,
    customerName: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username,
    customerEmail: user.email,
    customerPhone: user.phone || "9999999999",
    returnUrl: `${appUrl}/payment/success?provider=cashfree`
  });

  return {
    subscriptionId: subId,
    shortUrl: response.subscription.authLink,
    status: response.subscription.status
  };
}

export async function cancelCashfreeSubscription(gatewaySubscriptionId: string, immediately: boolean = false) {
  try {
    await cashfreeRequest("POST", `/subscriptions/${gatewaySubscriptionId}/cancel`);
  } catch(e) {}
  return { status: "cancelled" };
}

export async function getCashfreeSubscriptionStatus(gatewaySubscriptionId: string) {
  const response = await cashfreeRequest("GET", `/subscriptions/${gatewaySubscriptionId}`);
  return {
    status: response.subscription.status,
    currentStart: null,
    currentEnd: null,
  };
}

export async function upgradeOrDowngradeCashfree(userId: string, oldSubId: string, newPlanId: string, billingCycle: "monthly" | "annual") {
  await cancelCashfreeSubscription(oldSubId, true);
  return createCashfreeSubscription(userId, newPlanId, billingCycle, "INR");
}
"""

start_str = "export async function getRazorpay"
end_str = "export async function getRazorpayKeyId(): Promise<string | null> {"

start_idx = content.find(start_str)
end_idx = content.find("}", content.find(end_str)) + 1

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_code + "\n\n" + content[end_idx:]
    with open(filepath, 'w') as f:
        f.write(content)
    print("Replaced Razorpay correctly!")
else:
    print("Failed to find razorpay block bounds")

