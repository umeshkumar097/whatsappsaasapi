import { db } from "./server/db";
import { plans } from "./shared/schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Updating plans...");
  
  // Update permissions JSONB to include "meta_ai": "Yes" for all plans
  await db.execute(sql`
    UPDATE plans 
    SET permissions = jsonb_set(
      COALESCE(permissions, '{}'::jsonb), 
      '{meta_ai}', 
      '"Yes"'::jsonb, 
      true
    )
  `);
  
  console.log("All plans updated successfully!");
  process.exit(0);
}

main().catch(console.error);
