const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async create(username, password, role = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at',
      [username, hashedPassword, role]
    );
    return result.rows[0];
  },

  async findByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query('SELECT id, username, role FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async comparePasswords(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  },
};

module.exports = User; 