import { db } from "./server/db";
import { subscriptions } from "./shared/schema";
import { eq } from "drizzle-orm";

async function main() {
  const subs = await db.select().from(subscriptions).where(eq(subscriptions.gatewayProvider, "cashfree"));
  console.log("DB Subs:", subs.map(s => s.gatewaySubscriptionId));
  process.exit(0);
}
main();
