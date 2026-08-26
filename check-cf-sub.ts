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
    const res = await axios.get("https://api.cashfree.com/pg/subscriptions/319552190", {
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01"
      }
    });
    console.log("Sub Details:", JSON.stringify(res.data, null, 2));
  } catch(e: any) {
    console.log("Error:", e.response?.data || e.message);
  }
  process.exit(0);
}
main();
