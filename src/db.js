import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Uncomment below for most cloud Postgres setups (like Render):
  // ssl: { rejectUnauthorized: false }
});
