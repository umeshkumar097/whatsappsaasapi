import re

with open('server/services/payment-gateway.service.ts', 'r') as f:
    content = f.read()

# Make sure we don't duplicate
if 'export async function createCashfreeSubscription' in content and 'export async function createRazorpaySubscription' not in content:
    print("Already Cashfree")
    exit(0)

# Replace all simple occurrences of Razorpay to Cashfree
content = content.replace('Razorpay', 'Cashfree').replace('razorpay', 'cashfree').replace('RAZORPAY', 'CASHFREE')

# Now the code has `createCashfreeSubscription` but with Razorpay's code inside.
# We will completely overwrite everything from `export async function getCashfree()` to `upgradeOrDowngradeCashfree(...) { ... }`

start_regex = re.compile(r'export async function getCashfree\(\).*?\{', re.DOTALL)
end_regex = re.compile(r'export async function upgradeOrDowngradeCashfree.*?\n\}', re.DOTALL)

start_match = start_regex.search(content)
# Find the LAST match of upgradeOrDowngradeCashfree to replace the whole block
end_match = None
for match in end_regex.finditer(content):
    end_match = match

new_cashfree_code = """async function cashfreeRequest(method: string, path: string, data: any = null) {
  const provider = await getProviderConfig("cashfree");
  if (!provider) throw new Error("Cashfree is not configured");
  const isLive = provider.config?.isLive === true;
  const appId = isLive ? provider.config?.apiKey : provider.config?.apiKeyTest;
  const secretKey = isLive ? provider.config?.apiSecret : provider.config?.apiSecretTest;
  
  if (!appId || !secretKey) throw new Error("Cashfree credentials missing");
  
  const baseUrl = isLive ? "https://api.cashfree.com/api/v2" : "https://test.cashfree.com/api/v2";
  
  const axios = (await import("axios")).default;
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
    monthlyPlanId = `p_${planId.substring(0, 8)}_m`;
    try {
      await cashfreeRequest("POST", "/subscription-plans", {
        planId: monthlyPlanId, planName: `${plan.name} - Monthly`, type: "PERIODIC", amount: monthlyAmount, intervals: 1, intervalType: "MONTH"
      });
    } catch(e) {}
  }

  if (annualAmount > 0 && !annualPlanId) {
    annualPlanId = `p_${planId.substring(0, 8)}_a`;
    try {
      await cashfreeRequest("POST", "/subscription-plans", {
        planId: annualPlanId, planName: `${plan.name} - Annual`, type: "PERIODIC", amount: annualAmount, intervals: 1, intervalType: "YEAR"
      });
    } catch(e) {}
  }

  await db.update(plans).set({
    cashfreePlanIdMonthly: monthlyPlanId, cashfreePlanIdAnnual: annualPlanId, updatedAt: new Date(),
  }).where(eq(plans.id, planId));

  return { monthlyPlanId, annualPlanId };
}

export async function createCashfreeSubscription(userId: string, planId: string, billingCycle: "monthly" | "annual", currency: string) {
  const planData = await db.select().from(plans).where(eq(plans.id, planId)).limit(1);
  if (!planData.length) throw new Error("Plan not found");
  const plan = planData[0];
  const cfPlanId = billingCycle === "annual" ? plan.cashfreePlanIdAnnual : plan.cashfreePlanIdMonthly;
  const amount = billingCycle === "annual" ? Math.round(parseFloat(plan.annualPrice || "0")) : Math.round(parseFloat(plan.monthlyPrice || "0"));
  if (!cfPlanId) throw new Error(`Plan not synced to Cashfree for ${billingCycle}`);
  
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
      subscription_meta: {
        return_url: `${appUrl}/payment/success?provider=cashfree`
      },
      authorization_details: {
        authorization_amount: amount,
        authorization_amount_refund: false
      }
    }
  });

  const response = res.data;
  const shortUrl = `${checkoutDomain}/subscriptions/checkout/${response.subscription_session_id}`;
  return { subscriptionId: response.cf_subscription_id ? response.cf_subscription_id.toString() : subId, shortUrl: shortUrl, status: response.subscription_status || "INITIALIZED" };
}

export async function upgradeOrDowngradeStripe(
  subscriptionGatewayId: string,
  newPlanId: string,
  billingCycle: "monthly" | "annual"
) {
  const stripe = await getStripe();
  if (!stripe) throw new Error("Stripe is not configured");

  const planData = await db.select().from(plans).where(eq(plans.id, newPlanId)).limit(1);
  if (!planData.length) throw new Error("Plan not found");
  const plan = planData[0];

  const newPriceId =
    billingCycle === "annual" ? plan.stripePriceIdAnnual : plan.stripePriceIdMonthly;
  if (!newPriceId) {
    throw new Error(
      `Plan "${plan.name}" has no Stripe price for ${billingCycle} cycle. Please sync the plan first.`
    );
  }

  const existingSub = await stripe.subscriptions.retrieve(subscriptionGatewayId);

  const updated = await stripe.subscriptions.update(subscriptionGatewayId, {
    items: [
      {
        id: existingSub.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: "create_prorations",
    metadata: { platformPlanId: newPlanId },
  });

  return {
    subscriptionId: updated.id,
    status: updated.status,
    currentPeriodEnd: new Date(((updated as any).current_period_end || 0) * 1000),
  };
}

export async function upgradeOrDowngradeCashfree(
  userId: string,
  oldSubscriptionGatewayId: string,
  newPlanId: string,
  billingCycle: "monthly" | "annual"
) {
  try {
    await cashfreeRequest("POST", `/subscriptions/${oldSubscriptionGatewayId}/cancel`);
  } catch { }

  const currency = (await getProviderCurrency("cashfree", "INR")).toUpperCase();
  const result = await createCashfreeSubscription(userId, newPlanId, billingCycle, currency);
  return result;
}

export async function cancelStripeSubscription(
  gatewaySubscriptionId: string,
  immediately: boolean = false
) {
  const stripe = await getStripe();
  if (!stripe) throw new Error("Stripe is not configured");

  if (immediately) {
    const cancelled = await stripe.subscriptions.cancel(gatewaySubscriptionId);
    return { status: cancelled.status, canceledAt: new Date() };
  } else {
    const updated = await stripe.subscriptions.update(gatewaySubscriptionId, {
      cancel_at_period_end: true,
    });
    return {
      status: updated.status,
      cancelAtPeriodEnd: true,
      currentPeriodEnd: new Date(((updated as any).current_period_end || 0) * 1000),
    };
  }
}

export async function cancelCashfreeSubscription(
  gatewaySubscriptionId: string,
  immediately: boolean = false
) {
  try {
    await cashfreeRequest("POST", `/subscriptions/${gatewaySubscriptionId}/cancel`);
  } catch { }
  return { status: "cancelled", cancelAtPeriodEnd: !immediately };
}
"""

if start_match and end_match:
    content = content[:start_match.start()] + new_cashfree_code + content[end_match.end():]
    with open('server/services/payment-gateway.service.ts', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Failed")
