import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function main() {
  try {
    await db.execute(sql`ALTER TABLE wallet_transactions ADD COLUMN IF NOT EXISTS status varchar(20) NOT NULL DEFAULT 'completed'`);
    await db.execute(sql`ALTER TABLE wallet_transactions ADD COLUMN IF NOT EXISTS order_id varchar(100)`);
    console.log("Migration done!");
  } catch(e: any) {
    console.log("Error:", e.message);
  }
  process.exit(0);
}
main();
