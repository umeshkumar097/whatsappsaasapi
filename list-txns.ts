import { db } from "./server/db";
import { transactions } from "./shared/schema";
import { desc } from "drizzle-orm";

async function main() {
  const txns = await db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(3);
  console.log("Recent TXNs:");
  txns.forEach(t => console.log(t.id, t.providerTransactionId, t.status, t.createdAt, t.paymentProviderId));
  process.exit(0);
}
main();
