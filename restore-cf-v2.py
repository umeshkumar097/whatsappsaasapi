with open('server/services/payment-gateway.service.ts', 'a') as f:
    f.write("""

// --- Cashfree Restored Logic V2 ---
export async function getCashfreeKeyId(): Promise<string | null> {
  const provider = await getProviderConfig("cashfree");
  return provider.config?.apiKey || null;
}

export async function getCashfree() {
  const provider = await getProviderConfig("cashfree");
  return provider.config?.isLive ? "live" : "sandbox";
}

export async function syncPlanToCashfree(planId: string) {
  const planData = await db.select().from(plans).where(eq(plans.id, planId)).limit(1);
  if (!planData.length) throw new Error("Plan not found");
  const plan = planData[0];
  
  const provider = await getProviderConfig("cashfree");
  const isLive = provider.config?.isLive === true;
  const appId = isLive ? provider.config?.apiKey : provider.config?.apiKeyTest;
  const secretKey = isLive ? provider.config?.apiSecret : provider.config?.apiSecretTest;
  const baseUrl = isLive ? "https://api.cashfree.com/api/v2" : "https://sandbox.cashfree.com/api/v2";

  const axios = (await import("axios")).default;
  
  const monthlyAmount = Math.round(parseFloat(plan.monthlyPrice || "0"));
  const annualAmount = Math.round(parseFloat(plan.annualPrice || "0"));
  
  let monthlyPlanId = plan.cashfreePlanIdMonthly;
  let annualPlanId = plan.cashfreePlanIdAnnual;
  
  const headers = {
    "x-client-id": appId,
    "x-client-secret": secretKey,
    "Content-Type": "application/json"
  };

  if (monthlyAmount > 0 && !monthlyPlanId) {
    monthlyPlanId = `p2_${planId.substring(0, 8)}_m`;
    await axios.post(`${baseUrl}/subscription-plans`, {
      planId: monthlyPlanId,
      planName: `${plan.name} - Monthly`,
      type: "PERIODIC",
      amount: monthlyAmount,
      intervals: 1,
      intervalType: "MONTH"
    }, { headers }).catch(e => console.log("Cashfree create monthly plan err:", e.response?.data || e.message));
  }
  
  if (annualAmount > 0 && !annualPlanId) {
    annualPlanId = `p2_${planId.substring(0, 8)}_a`;
    await axios.post(`${baseUrl}/subscription-plans`, {
      planId: annualPlanId,
      planName: `${plan.name} - Annual`,
      type: "PERIODIC",
      amount: annualAmount,
      intervals: 1,
      intervalType: "YEAR"
    }, { headers }).catch(e => console.log("Cashfree create annual plan err:", e.response?.data || e.message));
  }
  
  await db.update(plans).set({
    cashfreePlanIdMonthly: monthlyPlanId,
    cashfreePlanIdAnnual: annualPlanId,
    updatedAt: new Date()
  }).where(eq(plans.id, planId));

  return { success: true, monthlyPlanId, annualPlanId };
}

export async function createCashfreeSubscription(userId: string, planId: string, billingCycle: "monthly" | "annual", currency: string, txnId?: string) {
  const planData = await db.select().from(plans).where(eq(plans.id, planId)).limit(1);
  if (!planData.length) throw new Error("Plan not found");
  const plan = planData[0];
  const cfPlanId = billingCycle === "annual" ? plan.cashfreePlanIdAnnual : plan.cashfreePlanIdMonthly;
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
  const baseUrl = isLive ? "https://api.cashfree.com/api/v2" : "https://sandbox.cashfree.com/api/v2";

  const axios = (await import("axios")).default;
  let phone = user.phone || "";
  if (phone.length < 10 || phone === "9999999999" || phone === "0000000000") {
      phone = "9876543210";
  } else {
      phone = phone.replace(/[^0-9]/g, "").slice(-10);
  }

  const res = await axios({
    method: "POST",
    url: `${baseUrl}/subscriptions`,
    headers: {
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "Content-Type": "application/json"
    },
    data: {
      subscriptionId: subId,
      planId: cfPlanId,
      customerName: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "User",
      customerEmail: user.email,
      customerPhone: phone,
      returnUrl: `${appUrl.replace("http://", "https://")}/payment/success?provider=cashfree`
    }
  });

  const response = res.data;
  
  // V2 returns response.subscription.authLink as the checkout URL
  const checkoutUrl = response.subscription?.authLink || response.authLink;

  return {
    subscriptionId: response.subscription?.subscriptionId || subId,
    shortUrl: checkoutUrl,
    status: response.subscription?.status || "pending",
  };
}

export async function cancelCashfreeSubscription(gatewaySubscriptionId: string) {
  const provider = await getProviderConfig("cashfree");
  const isLive = provider.config?.isLive === true;
  const appId = isLive ? provider.config?.apiKey : provider.config?.apiKeyTest;
  const secretKey = isLive ? provider.config?.apiSecret : provider.config?.apiSecretTest;
  const baseUrl = isLive ? "https://api.cashfree.com/api/v2" : "https://sandbox.cashfree.com/api/v2";
  const axios = (await import("axios")).default;
  
  await axios.post(`${baseUrl}/subscriptions/${gatewaySubscriptionId}/cancel`, {}, {
    headers: {
      "x-client-id": appId,
      "x-client-secret": secretKey
    }
  }).catch(e => {
    console.log("Failed to cancel Cashfree subscription:", e.message);
  });
}

export async function upgradeOrDowngradeCashfree(userId: string, gatewaySubscriptionId: string, oldPlanId: string, newPlanId: string, newCycle: "monthly" | "annual") {
  await cancelCashfreeSubscription(gatewaySubscriptionId);
  return { success: true };
}
""")
