import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "sterling_db";
const DB_INIT_DATABASE = process.env.DB_INIT_DATABASE || "postgres";
const DB_SSL = process.env.DB_SSL?.toLowerCase() === "true";

const sslConfig = DB_SSL ? { rejectUnauthorized: false } : false;

export let pool = null;

const createDatabaseIfNotExists = async () => {
  const client = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_INIT_DATABASE,
    ssl: sslConfig,
  });

  try {
    await client.query(`CREATE DATABASE "${DB_NAME}"`);
  } catch (error) {
    if (error.code !== "42P04") {
      throw error;
    }
  } finally {
    await client.end();
  }
};

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT NOT NULL,
      service TEXT,
      other_details TEXT,
      comments TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS consultations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      service TEXT,
      message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT DEFAULT '',
      mobile_no TEXT DEFAULT '',
      whatsapp_subscribed BOOLEAN DEFAULT false,
      company_name TEXT DEFAULT '',
      state TEXT DEFAULT '',
      billing_mobile TEXT DEFAULT '',
      billing_email TEXT DEFAULT ''
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tax_filings (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'Pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payment_orders (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE SET NULL,
      plan_name TEXT NOT NULL,
      plan_code TEXT NOT NULL,
      amount INT NOT NULL,
      currency VARCHAR(10) NOT NULL DEFAULT 'INR',
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      razorpay_signature TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id)`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_tax_filings_user_id ON tax_filings(user_id)`,
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      email TEXT PRIMARY KEY,
      otp TEXT NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL
    )
  `);
};

export const initializeDb = async () => {
  if (!process.env.DATABASE_URL) {
    await createDatabaseIfNotExists();
  }

  pool = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    ssl: sslConfig,
    connectionString: process.env.DATABASE_URL || undefined,
  });

  await pool.query("SELECT 1");
  await createTables();

  return pool;
};
