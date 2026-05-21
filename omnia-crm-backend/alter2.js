const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    await pool.query(`
      ALTER TABLE rfqs 
      ADD COLUMN IF NOT EXISTS rfq_type VARCHAR(100) DEFAULT 'Simple RFQ',
      ADD COLUMN IF NOT EXISTS approved_makes JSONB,
      ADD COLUMN IF NOT EXISTS certifications JSONB,
      ADD COLUMN IF NOT EXISTS confidence_score INTEGER DEFAULT 80,
      ADD COLUMN IF NOT EXISTS payment_terms TEXT,
      ADD COLUMN IF NOT EXISTS delivery_terms TEXT;
    `);
    console.log("DB altered successfully for multi-format RFQ.");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
main();
