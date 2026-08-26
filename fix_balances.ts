import { db } from "./server/db";
import { walletTransactions, wallets } from "./shared/schema";
import { eq } from "drizzle-orm";

async function main() {
  // Fix wallet balance - sum all completed credits
  const wallet = await db.query.wallets.findFirst({ 
    where: eq(wallets.id, "74cb173f-b374-47ea-9f6b-6d29e655a4b7")
  });
  
  const completedTxs = await db.select().from(walletTransactions)
    .where(eq(walletTransactions.walletId, "74cb173f-b374-47ea-9f6b-6d29e655a4b7"));
  
  let balance = 0;
  for (const tx of completedTxs) {
    if (tx.status === "completed" || tx.status === "CREDIT") {
      balance += parseFloat(tx.amount as string);
    }
  }
  
  await db.update(wallets)
    .set({ balance: balance.toFixed(4) })
    .where(eq(wallets.id, "74cb173f-b374-47ea-9f6b-6d29e655a4b7"));
  
  // Also fix the pending latest transaction - mark as completed and credit
  await db.update(walletTransactions)
    .set({ status: "completed" })
    .where(eq(walletTransactions.id, "a211f658-c632-4f68-9893-cb731081c65e"));
  
  const newBalance = balance + 100;
  await db.update(wallets)
    .set({ balance: newBalance.toFixed(4) })
    .where(eq(wallets.id, "74cb173f-b374-47ea-9f6b-6d29e655a4b7"));
  
  console.log(`Balance fixed to ₹${newBalance.toFixed(2)}`);
  process.exit(0);
}
main();
