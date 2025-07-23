"use client"

import { createContext, useState, useEffect } from "react"
import { jwtDecode as jwt_decode } from "jwt-decode"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // Add loading state

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const decodedToken = jwt_decode(token)
          // Check if token is expired
          if (decodedToken.exp * 1000 > Date.now()) {
            setUser({ id: decodedToken.id, role: decodedToken.role })
          } else {
            // Token expired, remove it
            localStorage.removeItem("token")
            setUser(null)
          }
        }
      } catch (error) {
        // Invalid token, remove it
        console.error("Invalid token:", error)
        localStorage.removeItem("token")
        setUser(null)
      } finally {
        setLoading(false) // Set loading to false after initialization
      }
    }

    initializeAuth()
  }, [])

  const login = (token) => {
    try {
      localStorage.setItem("token", token)
      const decodedToken = jwt_decode(token)
      setUser({ id: decodedToken.id, role: decodedToken.role })
    } catch (error) {
      console.error("Login error:", error)
      localStorage.removeItem("token")
      setUser(null)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}
