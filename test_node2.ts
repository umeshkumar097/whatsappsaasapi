import { db } from "./server/db";
import { channels } from "./shared/schema";
import fetch from "node-fetch";

async function test() {
  const allChannels = await db.select().from(channels);
  const c = allChannels[0];
  const url = `https://graph.facebook.com/v24.0/${c.whatsappBusinessAccountId}?fields=id,name,phone_numbers,message_templates`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${c.accessToken}`,
    }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
  process.exit(0);
}
test();
