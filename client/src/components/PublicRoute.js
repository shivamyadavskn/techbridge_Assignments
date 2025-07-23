
import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  // Show loading while checking authentication
  if (loading) {
    return <div className="loading">Checking authentication...</div>
  }

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  // If not logged in, show the public page (login/register)
  return children
}

export default PublicRoute
