const Transaction = require('../models/transaction');

const transactionController = {
  async getAllTransactions(req, res) {
    try {
      const transactions = await Transaction.findByUserId(req.user.id, req.query);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async createTransaction(req, res) {
    try {
      const { type, amount, category, date, description } = req.body;
      const newTransaction = await Transaction.create(req.user.id, type, amount, category, date, description);
      res.status(201).json(newTransaction);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getTransactionById(req, res) {
    try {
      const transaction = await Transaction.findById(req.params.id);
      if (!transaction || transaction.user_id !== req.user.id) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async updateTransaction(req, res) {
    try {
      const { amount, category, date, description } = req.body;
      const transaction = await Transaction.findById(req.params.id);
      if (!transaction || transaction.user_id !== req.user.id) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      const updatedTransaction = await Transaction.update(req.params.id, amount, category, date, description);
      res.json(updatedTransaction);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async deleteTransaction(req, res) {
    try {
      const transaction = await Transaction.findById(req.params.id);
      if (!transaction || transaction.user_id !== req.user.id) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      await Transaction.delete(req.params.id);
      res.json({ message: 'Transaction deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};

module.exports = transactionController; 