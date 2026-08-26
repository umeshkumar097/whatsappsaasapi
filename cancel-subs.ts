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

  const ids = [
    "319418459",
    "319417581",
    "319416253",
    "319410187",
    "319409538",
    "319409265",
    "319409004",
    "319406954",
    "319405467",
    "319405017"
  ];

  for (const id of ids) {
    try {
      const res = await axios.post(`https://api.cashfree.com/api/v2/subscriptions/${id}/cancel`, {}, {
        headers: {
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "Content-Type": "application/json"
        }
      });
      console.log(`Cancelled ${id}:`, res.data);
    } catch(e: any) {
      console.log(`Failed to cancel ${id}:`, e.response?.data || e.message);
    }
  }
  process.exit(0);
}
main();
