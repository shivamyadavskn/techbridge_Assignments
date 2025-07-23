
import { useState, useEffect, useCallback, useMemo, useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import transactionService from "../services/transactionService"

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState(null)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const data = await transactionService.getTransactions({ search, category })
      setTransactions(data)
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
    } finally {
      setLoading(false)
    }
  }, [search, category])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
    setPage(1)
  }

  const handleAdd = () => {
    setIsEditing(false)
    setCurrentTransaction(null)
    setIsFormVisible(true)
  }

  const handleEdit = (transaction) => {
    setIsEditing(true)
    setCurrentTransaction(transaction)
    setIsFormVisible(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.deleteTransaction(id)
        fetchTransactions()
      } catch (error) {
        console.error("Failed to delete transaction:", error)
      }
    }
  }

  const handleSubmit = async (transaction) => {
    try {
      if (isEditing) {
        await transactionService.updateTransaction(transaction.id, transaction)
      } else {
        await transactionService.createTransaction(transaction)
      }
      fetchTransactions()
      setIsFormVisible(false)
    } catch (error) {
      console.error("Failed to save transaction:", error)
    }
  }

  const transactionsPerPage = 10
  const paginatedTransactions = useMemo(() => {
    const startIndex = (page - 1) * transactionsPerPage
    return transactions.slice(startIndex, startIndex + transactionsPerPage)
  }, [transactions, page])

  const totalPages = Math.ceil(transactions.length / transactionsPerPage)

  if (loading) {
    return <div className="loading">Loading transactions...</div>
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">💳 Transaction History</h2>
          <p>Manage and track all your financial transactions</p>
        </div>

        <div className="controls">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search transactions..."
            value={search}
            onChange={handleSearch}
          />
          <select value={category} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            <option value="Food">🍔 Food</option>
            <option value="Transport">🚗 Transport</option>
            <option value="Entertainment">🎬 Entertainment</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Bills">📄 Bills</option>
            <option value="Healthcare">🏥 Healthcare</option>
            <option value="Other">📦 Other</option>
          </select>
          {user.role !== "read-only" && <button onClick={handleAdd}>➕ Add Transaction</button>}
        </div>
      </div>

      {isFormVisible && (
        <TransactionForm
          onSubmit={handleSubmit}
          transaction={currentTransaction}
          onCancel={() => setIsFormVisible(false)}
          isEditing={isEditing}
        />
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              {user.role !== "read-only" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={user.role !== "read-only" ? 6 : 5} style={{ textAlign: "center", padding: "2rem" }}>
                  No transactions found
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        backgroundColor: transaction.type === "income" ? "#dcfce7" : "#fee2e2",
                        color: transaction.type === "income" ? "#166534" : "#991b1b",
                      }}
                    >
                      {transaction.type === "income" ? "💰 Income" : "💸 Expense"}
                    </span>
                  </td>
                  <td
                    style={{
                      fontWeight: "600",
                      color: transaction.type === "income" ? "#059669" : "#dc2626",
                    }}
                  >
                    ${Number.parseFloat(transaction.amount).toFixed(2)}
                  </td>
                  <td>{transaction.category}</td>
                  <td>{transaction.description}</td>
                  {user.role !== "read-only" && (
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={() => handleEdit(transaction)} className="btn-secondary btn-small">
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(transaction.id)} className="btn-danger btn-small">
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage(page - 1)} disabled={page === 1} className="btn-secondary">
            ← Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="btn-secondary">
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

const TransactionForm = ({ onSubmit, transaction, onCancel, isEditing }) => {
  const [type, setType] = useState(transaction?.type || "expense")
  const [amount, setAmount] = useState(transaction?.amount || "")
  const [category, setCategory] = useState(transaction?.category || "")
  const [date, setDate] = useState(transaction?.date ? new Date(transaction.date).toISOString().split("T")[0] : "")
  const [description, setDescription] = useState(transaction?.description || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        id: transaction?.id,
        type,
        amount: Number.parseFloat(amount),
        category,
        date,
        description,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h3>{isEditing ? "✏️ Edit Transaction" : "➕ Add New Transaction"}</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="type">Transaction Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">💰 Income</option>
            <option value="expense">💸 Expense</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select a category</option>
            <option value="Food">🍔 Food</option>
            <option value="Transport">🚗 Transport</option>
            <option value="Entertainment">🎬 Entertainment</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Bills">📄 Bills</option>
            <option value="Healthcare">🏥 Healthcare</option>
            <option value="Salary">💼 Salary</option>
            <option value="Investment">📈 Investment</option>
            <option value="Other">📦 Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Add a note about this transaction..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit" disabled={loading} style={{ flex: 1 }}>
            {loading ? "Saving..." : isEditing ? "💾 Update" : "➕ Add Transaction"}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary" style={{ flex: 1 }}>
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default Transactions
