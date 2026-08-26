import { db } from "./server/db";
import { walletTransactions, wallets } from "./shared/schema";
import { desc } from "drizzle-orm";

async function main() {
  const txs = await db.select().from(walletTransactions).orderBy(desc(walletTransactions.createdAt)).limit(10);
  console.log("Recent transactions:");
  txs.forEach(t => console.log(JSON.stringify(t)));
  const ws = await db.select().from(wallets);
  console.log("Wallets:");
  ws.forEach(w => console.log(JSON.stringify(w)));
  process.exit(0);
}
main();
