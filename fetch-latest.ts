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
    // V3 doesn't have an easy list endpoint, but let's try calling it or V2 list
    // Actually, V3 list is GET /pg/subscriptions?limit=5 maybe? No, let's use V2 to list
    const res = await axios.get("https://api.cashfree.com/api/v2/subscriptions", {
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "Content-Type": "application/json"
      }
    });
    console.log("V2 Subs:", res.data);
  } catch(e: any) {
    console.log("V2 Error:", e.response?.data || e.message);
  }
  process.exit(0);
}
main();
