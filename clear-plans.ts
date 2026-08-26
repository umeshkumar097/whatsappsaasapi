import { db } from "./server/db";
import { plans } from "./shared/schema";

async function main() {
    await db.update(plans).set({
        cashfreePlanIdMonthly: null,
        cashfreePlanIdAnnual: null
    });
    console.log("Cleared Cashfree plan IDs in DB");
    process.exit(0);
}
main().catch(console.error);
