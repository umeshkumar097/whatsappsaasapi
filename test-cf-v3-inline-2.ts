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
      url: `https://api.cashfree.com/pg/subscriptions`,
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json"
      },
      data: {
        subscription_id: "test_" + Date.now(),
        plan_details: { plan_id: "p2_3d6a9c58_m" }, // Let's use the plan we just created via frontend
        customer_details: { customer_name: "Test User", customer_email: "test@example.com", customer_phone: "9876543210" },
        subscription_meta: { return_url: `https://app.waki.in/payment/success?provider=cashfree` },
        authorization_details: { authorization_amount: 999, authorization_amount_refund: false }
      }
    });
    console.log("With Auth URL:", res.data.subscription_session_id);
  } catch(e: any) {
    console.log("Error:", e.response?.data || e.message);
  }

  process.exit(0);
}
main();
