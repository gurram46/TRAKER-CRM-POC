import { query } from './src/config/db';

async function setup() {
  const sql = `
    CREATE TABLE IF NOT EXISTS rfqs (
      id SERIAL PRIMARY KEY,
      rfq_number VARCHAR(50) UNIQUE NOT NULL,
      client_name VARCHAR(255),
      contact_number VARCHAR(50),
      material_type VARCHAR(100),
      quantity_mt DECIMAL(10,2),
      required_by DATE,
      special_requirements TEXT,
      status VARCHAR(50) DEFAULT 'New',
      source VARCHAR(50) DEFAULT 'manual',
      raw_email TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  try {
    await query(sql);
    console.log("Table rfqs created successfully!");
  } catch (err) {
    console.error("Error creating table:", err);
  }
  process.exit();
}

setup();
