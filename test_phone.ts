import { db } from "./server/db";
import { channels } from "./shared/schema";
import fetch from "node-fetch";

async function test() {
  const allChannels = await db.select().from(channels);
  const c = allChannels[0];
  const url = `https://graph.facebook.com/v24.0/${c.phoneNumberId}/message_templates`;
  
  const payload = {
    name: "test_template_12345",
    category: "MARKETING",
    language: "en_US",
    components: [
      {
        type: "BODY",
        text: "Hello ji!"
      }
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${c.accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
  process.exit(0);
}
test();
