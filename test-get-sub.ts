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
  const baseUrl = isLive ? "https://api.cashfree.com/api/v2" : "https://test.cashfree.com/api/v2";

  try {
    const response = await axios({
      method: "GET",
      url: `${baseUrl}/subscriptions/sub_test_1787155871216`,
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "Content-Type": "application/json"
      }
    });
    console.log("Success:", JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.log("Error:", error.response?.data || error.message);
  }
  process.exit(0);
}
main().catch(console.error);
