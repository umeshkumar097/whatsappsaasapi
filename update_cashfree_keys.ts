import { db } from "./server/db";
import { paymentProviders } from "./shared/schema";
import { eq } from "drizzle-orm";

async function main() {
  const config = {
    isLive: true,
    apiKey: "134239153569b2e4371d9db1ea11932431",
    apiSecret: "cfsk_ma_prod_807ffe1d0bcb6cf4b8b2cd2e2abbfe08_47a8f452",
    apiKeyTest: "",
    apiSecretTest: ""
  };
  
  const existing = await db.select().from(paymentProviders).where(eq(paymentProviders.providerKey, "cashfree"));
  
  if (existing.length > 0) {
    await db.update(paymentProviders)
      .set({ config: config, isActive: true })
      .where(eq(paymentProviders.providerKey, "cashfree"));
    console.log("Updated Cashfree keys in DB");
  } else {
    await db.insert(paymentProviders).values({
      providerKey: "cashfree",
      name: "Cashfree",
      isActive: true,
      config: config
    });
    console.log("Inserted Cashfree keys in DB");
  }
  process.exit(0);
}
main();
