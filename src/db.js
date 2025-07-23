import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';

export async function initDB() {
  const db = await open({
    filename: './ourwill.sqlite',
    driver: sqlite3.Database
  });

  // Create users table if not exists
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      isAdmin INTEGER DEFAULT 0,
      groupName TEXT
    )
  `);

  // Create demo users if not exist
  const adminExists = await db.get('SELECT * FROM users WHERE username = ?', 'admin');
  if (!adminExists) {
    await db.run(
      'INSERT INTO users (username, password, isAdmin, groupName) VALUES (?, ?, ?, ?)',
      'admin', await bcrypt.hash('admin123', 10), 1, null
    );
  }
  const userExists = await db.get('SELECT * FROM users WHERE username = ?', 'user');
  if (!userExists) {
    await db.run(
      'INSERT INTO users (username, password, isAdmin, groupName) VALUES (?, ?, ?, ?)',
      'user', await bcrypt.hash('user123', 10), 0, 'agent'
    );
  }

  return db;
}
