"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  // Show loading while checking authentication
  if (loading) {
    return <div className="loading">Checking authentication...</div>
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If authenticated, render the protected component
  return children
}

export default ProtectedRoute
