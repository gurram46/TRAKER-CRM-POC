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
      source_message_id TEXT,
      source_received_at TIMESTAMP,
      source_subject TEXT,
      source_sender TEXT,
      source_from_address TEXT,
      source_summary TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE UNIQUE INDEX IF NOT EXISTS rfqs_source_message_id_unique
    ON rfqs (source_message_id)
    WHERE source_message_id IS NOT NULL;
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
