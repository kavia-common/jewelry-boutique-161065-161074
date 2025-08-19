const db = require('../db');

// PUBLIC_INTERFACE
async function createUser({ email, passwordHash, name }) {
  /** Create a user and return the inserted record with id. */
  const result = await db.query(
    `INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)`,
    [email, passwordHash, name || null]
  );
  const insertedId = result.insertId || (result[0] && result[0].insertId);
  return getById(insertedId);
}

// PUBLIC_INTERFACE
async function getByEmail(email) {
  /** Get user by email. */
  const rows = await db.query(`SELECT id, email, name, password_hash FROM users WHERE email = ? LIMIT 1`, [email]);
  return rows[0] || null;
}

// PUBLIC_INTERFACE
async function getById(id) {
  /** Get user by id. */
  const rows = await db.query(`SELECT id, email, name, created_at FROM users WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

module.exports = {
  createUser,
  getByEmail,
  getById,
};
