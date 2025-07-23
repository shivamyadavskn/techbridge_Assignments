import { useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { ThemeContext } from "../contexts/ThemeContext"

const Header = () => {
  const { user, logout, loading } = useContext(AuthContext)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const location = useLocation()

  // Don't show header on login/register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null
  }

  // Show loading state
  if (loading) {
    return (
      <header>
        <div className="header-content">
          <h1>💰 Personal Finance Tracker</h1>
          <div className="loading">Loading...</div>
        </div>
      </header>
    )
  }

  return (
    <header>
      <div className="header-content">
        <h1>💰 Personal Finance Tracker</h1>
        <nav className="header-nav">
          {user ? (
            <>
              <Link to="/dashboard">📊 Dashboard</Link>
              <Link to="/transactions">💳 Transactions</Link>
              <button onClick={logout} className="btn-secondary btn-small">
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">🔐 Login</Link>
              <Link to="/register">📝 Register</Link>
            </>
          )}
        </nav>
        <div className="header-controls">
          <button onClick={toggleTheme} className="btn-secondary btn-small">
            {theme === "light" ? "🌙" : "☀️"} {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
