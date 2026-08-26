import { db } from "./server/db";
import { webhookConfigs } from "./shared/schema";

async function main() {
  const configs = await db.select().from(webhookConfigs);
  console.log("Configs:", configs);
  process.exit(0);
}
main();
