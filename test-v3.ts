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
      subscription_id: "sub_v3_" + Date.now(),
      plan_details: {
        plan_id: "test_plan_3"
      },
      customer_details: {
        customer_name: "Test User",
        customer_email: "test@example.com",
        customer_phone: "9999999999"
      },
      subscription_meta: {
        return_url: "https://example.com/return"
      },
      authorization_details: {
        authorization_amount: 999,
        authorization_amount_refund: false
      }
    };

    const response = await axios({
      method: "POST",
      url: `${baseUrl}/subscriptions`,
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
