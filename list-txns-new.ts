import { db } from "./server/db";
import { transactions } from "./shared/schema";
import { desc } from "drizzle-orm";

async function main() {
  const txns = await db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(1);
  console.log(txns[0].providerTransactionId);
  process.exit(0);
}
main();
