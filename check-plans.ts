import { db } from "./server/db";
import { plans } from "./shared/schema";

async function main() {
    const allPlans = await db.select().from(plans);
    console.log(allPlans.map(p => ({ id: p.id, name: p.name, cashfreeMonthly: p.cashfreePlanIdMonthly })));
    process.exit(0);
}
main().catch(console.error);
