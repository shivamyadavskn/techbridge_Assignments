import { useState, useCallback } from "react"
import { useNavigate, Link } from "react-router-dom"
import authService from "../services/authService"

const Register = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setError("")
      setSuccess(false)

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }

      setLoading(true)

      try {
        await authService.register(username, password)
        setSuccess(true)
        setTimeout(() => {
          navigate("/login", { replace: true })
        }, 2000)
      } catch (err) {
        setError("Username already exists or registration failed")
      } finally {
        setLoading(false)
      }
    },
    [username, password, confirmPassword, navigate],
  )

  if (success) {
    return (
      <div className="form-container">
        <div className="alert alert-success">
          <h3>🎉 Account Created Successfully!</h3>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="form-container">
      <h2>📝 Create Account</h2>
      <p style={{ marginBottom: "2rem", color: "#6b7280" }}>Join us to start tracking your finances</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            disabled={loading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Creating Account..." : "🎉 Create Account"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#6b7280" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#667eea", textDecoration: "none", fontWeight: "500" }}>
          Sign in here
        </Link>
      </p>
    </div>
  )
}

export default Register
