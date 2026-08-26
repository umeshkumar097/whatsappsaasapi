import { db } from "./server/db";
import { templates } from "./shared/schema";
async function test() {
  const ts = await db.select().from(templates);
  console.log(ts.map(t => t.name));
  process.exit(0);
}
test();
