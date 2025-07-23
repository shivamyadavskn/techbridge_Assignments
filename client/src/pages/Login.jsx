
import { useState, useContext, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import authService from "../services/authService"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setLoading(true)
      setError("")

      try {
        const { token } = await authService.login(username, password)
        login(token)
        navigate("/dashboard")
      } catch (err) {
        setError("Invalid credentials. Please try again.")
      } finally {
        setLoading(false)
      }
    },
    [username, password, login, navigate],
  )

  return (
    <div className="form-container">
      <h2>🔐 Welcome Back</h2>
      <p style={{ marginBottom: "2rem", color: "#6b7280" }}>Sign in to your account to continue</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Signing in..." : "🚀 Sign In"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#6b7280" }}>
        Don't have an account?{" "}
        <a href="/register" style={{ color: "#667eea", textDecoration: "none", fontWeight: "500" }}>
          Sign up here
        </a>
      </p>
    </div>
  )
}

export default Login
