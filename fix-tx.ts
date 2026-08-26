import { db } from "./server/db";
import { transactions, subscriptions, users, plans } from "./shared/schema";
import { eq, desc } from "drizzle-orm";
import { activateSubscriptionFromTransaction } from "./server/controllers/webhooks.controller";

async function main() {
  const txs = await db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(1);
  if (!txs.length) return console.log('No transactions found.');
  const tx = txs[0];
  console.log('Latest transaction:', tx.id, tx.providerTransactionId, tx.status);
  
  if (tx.status !== 'completed') {
      console.log('Marking transaction as completed and activating subscription...');
      await db.update(transactions).set({ status: 'completed', paidAt: new Date() }).where(eq(transactions.id, tx.id));
      await activateSubscriptionFromTransaction(tx, tx.providerTransactionId, 'cashfree');
      console.log('Done!');
  } else {
      console.log('Transaction already completed.');
  }
  process.exit(0);
}
main();
