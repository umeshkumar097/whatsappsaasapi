const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query(`
      ALTER TABLE channels ADD COLUMN IF NOT EXISTS gupshup_app_id TEXT;
      
      CREATE TABLE IF NOT EXISTS wallets (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        balance DECIMAL(12,4) NOT NULL DEFAULT '0',
        currency VARCHAR(10) NOT NULL DEFAULT 'INR',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS wallet_transactions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet_id VARCHAR NOT NULL REFERENCES wallets(id),
        amount DECIMAL(12,4) NOT NULL,
        type VARCHAR(20) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS message_rates (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        category VARCHAR(50) NOT NULL UNIQUE,
        price DECIMAL(12,4) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Seed some default rates
      INSERT INTO message_rates (category, price) VALUES 
        ('MARKETING', 0.8),
        ('UTILITY', 0.3),
        ('AUTHENTICATION', 0.1),
        ('SERVICE', 0.3)
      ON CONFLICT (category) DO NOTHING;
    `);
    console.log("Wallet schema applied successfully!");
  } catch (err) {
    console.error("Error applying schema:", err);
  } finally {
    await client.end();
  }
}
run();
