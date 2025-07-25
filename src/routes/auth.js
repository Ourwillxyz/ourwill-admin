import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js'; // Use named import!

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const {
      username,
      email,
      mobile,
      county_code,
      subcounty_code,
      ward_code,
      polling_centre_code,
      password,
    } = req.body;

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (
        username, email, mobile, county_code, subcounty_code, ward_code, polling_centre_code, password_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [username, email, mobile, county_code, subcounty_code, ward_code, polling_centre_code, password_hash]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
