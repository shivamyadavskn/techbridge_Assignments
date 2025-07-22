const pool = require('../config/db');

const Transaction = {
  async create(userId, type, amount, category, date, description) {
    const result = await pool.query(
      'INSERT INTO transactions (user_id, type, amount, category, date, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, type, amount, category, date, description]
    );
    return result.rows[0];
  },

  async findByUserId(userId, filters = {}) {
    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    const queryParams = [userId];
    let paramIndex = 2;

    if (filters.search) {
      query += ` AND (category ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      queryParams.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND category = $${paramIndex}`;
      queryParams.push(filters.category);
      paramIndex++;
    }
    
    query += ' ORDER BY date DESC';

    const result = await pool.query(query, queryParams);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id, amount, category, date, description) {
    const result = await pool.query(
      'UPDATE transactions SET amount = $1, category = $2, date = $3, description = $4 WHERE id = $5 RETURNING *',
      [amount, category, date, description, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
  },
};

module.exports = Transaction; 