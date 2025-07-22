const pool = require('../config/db');
const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

const getAnalytics = async (req, res) => {
  try {
    await client.connect();
    const userId = req.user.id;
    const cacheKey = `analytics:${userId}`;
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      await client.quit();
      return res.json(JSON.parse(cachedData));
    }

    const monthlySpending = await pool.query(
      "SELECT TO_CHAR(date, 'YYYY-MM') as month, SUM(amount) as total FROM transactions WHERE user_id = $1 AND type = 'expense' GROUP BY month ORDER BY month",
      [userId]
    );

    const categoryBreakdown = await pool.query(
      "SELECT category, SUM(amount) as total FROM transactions WHERE user_id = $1 AND type = 'expense' GROUP BY category",
      [userId]
    );

    const incomeVsExpense = await pool.query(
      "SELECT type, SUM(amount) as total FROM transactions WHERE user_id = $1 GROUP BY type",
      [userId]
    );

    const analyticsData = {
      monthlySpending: monthlySpending.rows,
      categoryBreakdown: categoryBreakdown.rows,
      incomeVsExpense: incomeVsExpense.rows,
    };

    await client.setEx(cacheKey, 900, JSON.stringify(analyticsData)); // Cache for 15 minutes
    await client.quit();
    res.json(analyticsData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAnalytics }; 