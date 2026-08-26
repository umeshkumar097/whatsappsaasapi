import { db } from "./server/db";
import { subscriptions } from "./shared/schema";
import { desc } from "drizzle-orm";

async function main() {
  const subs = await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt)).limit(5);
  console.log("Recent DB Subs:");
  subs.forEach(s => console.log(s.id, s.gatewaySubscriptionId, s.status, s.createdAt));
  process.exit(0);
}
main();
