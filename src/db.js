const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // This is the variable Render provides for your PostgreSQL database
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = pool;
