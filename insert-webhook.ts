import { db } from "./server/db";
import { webhookConfigs } from "./shared/schema";
import crypto from "crypto";

async function main() {
  const configs = await db.select().from(webhookConfigs);
  if (configs.length === 0) {
    const verifyToken = "WAKI_" + crypto.randomBytes(8).toString("hex").toUpperCase();
    await db.insert(webhookConfigs).values({
      webhookUrl: "https://app.waki.in/webhook/global",
      verifyToken: verifyToken,
      events: ["messages", "message_status"],
      isActive: true
    });
    console.log("Inserted new webhook config with token:", verifyToken);
  } else {
    console.log("Existing token:", configs[0].verifyToken);
  }
  process.exit(0);
}
main();
