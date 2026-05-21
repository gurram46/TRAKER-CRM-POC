const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    await pool.query(`
      ALTER TABLE rfqs 
      ADD COLUMN IF NOT EXISTS items JSONB,
      ADD COLUMN IF NOT EXISTS company VARCHAR(255),
      ADD COLUMN IF NOT EXISTS delivery_location VARCHAR(255);
    `);
    console.log("DB altered successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
main();
