import { db } from "./server/db";
import { plans } from "./shared/schema";

async function main() {
  const p = await db.select().from(plans);
  console.log(p);
  process.exit(0);
}
main();
