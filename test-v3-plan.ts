import axios from "axios";
import { db } from "./server/db";
import { paymentProviders } from "./shared/schema";
import { eq } from "drizzle-orm";

async function main() {
  const providers = await db.select().from(paymentProviders).where(eq(paymentProviders.providerKey, "cashfree")).limit(1);
  const provider = providers[0];
  const isLive = provider.config?.isLive === true;
  const config = provider.config as any;
  const appId = isLive ? config.apiKey : config.apiKeyTest;
  const secretKey = isLive ? config.apiSecret : config.apiSecretTest;
  const baseUrl = isLive ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

  try {
    const data = {
      plan_id: "plan_v3_" + Date.now(),
      plan_name: "Test V3 Plan",
      plan_type: "PERIODIC",
      plan_currency: "INR",
      plan_recurring_amount: 999,
      plan_max_amount: 999,
      plan_intervals: 1,
      plan_interval_type: "MONTH"
    };

    const response = await axios({
      method: "POST",
      url: `${baseUrl}/subscriptions/plans`,
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json"
      },
      data
    });
    console.log("Success:", JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.log("Error:", JSON.stringify(error.response?.data || error.message, null, 2));
  }
  process.exit(0);
}
main().catch(console.error);
