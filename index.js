require('dotenv').config();
const express = require('express');
const pool = require('./db');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, mobile, county, subcounty, ward, polling_centre, password } = req.body;

  if (!username || !email || !mobile || !county || !subcounty || !ward || !polling_centre || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if the email is already registered
    const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert into users table
    await pool.query(
      `INSERT INTO users (username, email, mobile, county_code, subcounty_code, ward_code, polling_centre_code, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [username, email, mobile, county, subcounty, ward, polling_centre, password_hash]
    );

    res.json({ message: 'Registration successful! Please verify your email/mobile.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed due to server error.' });
  }
});

// (Optional) Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required.' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials.' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials.' });

    res.json({ message: 'Login successful!', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed due to server error.' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
