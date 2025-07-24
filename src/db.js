import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // If you want SSL (for Render/Postgres), uncomment below:
  // ssl: { rejectUnauthorized: false }
});
