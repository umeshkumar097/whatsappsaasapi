import axios from "axios";
import { db } from "./server/db";
import { paymentProviders } from "./shared/schema";
import { eq } from "drizzle-orm";

async function main() {
  const providers = await db.select().from(paymentProviders).where(eq(paymentProviders.providerKey, "cashfree")).limit(1);
  const provider = providers[0];
  const config = provider.config as any;
  const appId = config.apiKey;
  const secretKey = config.apiSecret;

  try {
    const res = await axios({
      method: "POST",
      url: `https://api.cashfree.com/pg/subscriptions/plans`,
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json"
      },
      data: {
        plan_id: "plan_test_v3_" + Date.now(),
        plan_name: "Test V3 Plan",
        plan_type: "PERIODIC",
        plan_recurring_amount: 999,
        plan_max_amount: 999,
        plan_intervals: 1,
        plan_interval_type: "MONTH"
      }
    });
    console.log("Plan created:", res.data);
  } catch(e: any) {
    console.log("Error:", e.response?.data || e.message);
  }
  process.exit(0);
}
main();
