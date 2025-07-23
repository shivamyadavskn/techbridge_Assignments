
import { useContext } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { ThemeContext } from "../contexts/ThemeContext"

const Header = () => {
  const { user, logout, loading } = useContext(AuthContext)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const location = useLocation()
  const navigate = useNavigate()

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

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <header>
      <div className="header-content">
        <h1>💰 Personal Finance Tracker</h1>
        <nav className="header-nav">
          {user ? (
            <>
              <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
                📊 Dashboard
              </Link>
              <Link to="/transactions" className={location.pathname === "/transactions" ? "active" : ""}>
                💳 Transactions
              </Link>
              <button onClick={handleLogout} className="btn-secondary btn-small">
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
