import { db } from "./server/db";
import { channels } from "./shared/schema";
async function check() {
  const allChannels = await db.select().from(channels);
  console.log(allChannels.map(c => ({
    name: c.name,
    phone_id: c.phoneNumberId,
    waba_id: c.whatsappBusinessAccountId
  })));
  process.exit(0);
}
check();
