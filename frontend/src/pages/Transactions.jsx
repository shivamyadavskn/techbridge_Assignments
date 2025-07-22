import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import transactionService from '../services/transactionService';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const { user } = useContext(AuthContext);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  const fetchTransactions = useCallback(async () => {
    const data = await transactionService.getTransactions({ search, category });
    setTransactions(data);
  }, [search, category]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleAdd = () => {
    setIsEditing(false);
    setCurrentTransaction(null);
    setIsFormVisible(true);
  };

  const handleEdit = (transaction) => {
    setIsEditing(true);
    setCurrentTransaction(transaction);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    await transactionService.deleteTransaction(id);
    fetchTransactions();
  };

  const handleSubmit = async (transaction) => {
    if (isEditing) {
      await transactionService.updateTransaction(transaction.id, transaction);
    } else {
      await transactionService.createTransaction(transaction);
    }
    fetchTransactions();
    setIsFormVisible(false);
  };

  const transactionsPerPage = 10;
  const paginatedTransactions = useMemo(() => {
    const startIndex = (page - 1) * transactionsPerPage;
    return transactions.slice(startIndex, startIndex + transactionsPerPage);
  }, [transactions, page]);

  return (
    <div>
      <h2>Transactions</h2>
      {user.role !== 'read-only' && <button onClick={handleAdd}>Add Transaction</button>}
      <input type="text" placeholder="Search..." value={search} onChange={handleSearch} />
      <select value={category} onChange={handleCategoryChange}>
        <option value="">All Categories</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
      </select>
      {isFormVisible && (
        <TransactionForm
          onSubmit={handleSubmit}
          transaction={currentTransaction}
          onCancel={() => setIsFormVisible(false)}
        />
      )}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            {user.role !== 'read-only' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.type}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.category}</td>
              <td>{transaction.description}</td>
              {user.role !== 'read-only' && (
                <td>
                  <button onClick={() => handleEdit(transaction)}>Edit</button>
                  <button onClick={() => handleDelete(transaction.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)} disabled={paginatedTransactions.length < transactionsPerPage}>
          Next
        </button>
      </div>
    </div>
  );
};

const TransactionForm = ({ onSubmit, transaction, onCancel }) => {
    const [type, setType] = useState(transaction?.type || 'expense');
    const [amount, setAmount] = useState(transaction?.amount || '');
    const [category, setCategory] = useState(transaction?.category || '');
    const [date, setDate] = useState(transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : '');
    const [description, setDescription] = useState(transaction?.description || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ id: transaction?.id, type, amount, category, date, description });
    };

    return (
        <form onSubmit={handleSubmit}>
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <button type="submit">Submit</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};


export default Transactions; 