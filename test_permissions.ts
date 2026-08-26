import { db } from "./server/db";
import { channels } from "./shared/schema";
import fetch from "node-fetch";

async function test() {
  const allChannels = await db.select().from(channels);
  const c = allChannels[0];
  const url = `https://graph.facebook.com/v24.0/me/permissions?access_token=${c.accessToken}`;
  
  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
  process.exit(0);
}
test();
