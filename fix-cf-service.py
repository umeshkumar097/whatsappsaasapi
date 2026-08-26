import re
import sys

def patch_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find the start of createCashfreeSubscription
    start_str = 'export async function createCashfreeSubscription'
    start_idx = content.find(start_str)
    if start_idx == -1:
        print("Function not found!")
        sys.exit(1)

    # Find the end of the function using brace counting
    brace_count = 0
    in_function = False
    end_idx = -1
    
    for i in range(start_idx, len(content)):
        if content[i] == '{':
            if not in_function:
                in_function = True
            brace_count += 1
        elif content[i] == '}':
            brace_count -= 1
            if in_function and brace_count == 0:
                end_idx = i + 1
                break

    if end_idx == -1:
        print("End of function not found!")
        sys.exit(1)

    old_func = content[start_idx:end_idx]

    # The new function definition
    new_func = """export async function createCashfreeSubscription(userId: string, planId: string, billingCycle: "monthly" | "annual", currency: string, txnId?: string) {
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

    content = content[:start_idx] + new_func + content[end_idx:]

    with open(filepath, 'w') as f:
        f.write(content)

    print("Replaced successfully!")

patch_file('server/services/payment-gateway.service.ts')
