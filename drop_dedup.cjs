const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query('DROP TABLE IF EXISTS webhook_dedup;');
    console.log("Dropped webhook_dedup");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
run();
