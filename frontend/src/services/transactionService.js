import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

const transactionService = {
  async getTransactions(params) {
    const token = localStorage.getItem('token');
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  },

  async createTransaction(transaction) {
    const token = localStorage.getItem('token');
    const response = await axios.post(API_URL, transaction, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async updateTransaction(id, transaction) {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/${id}`, transaction, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async deleteTransaction(id) {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default transactionService; 