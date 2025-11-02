// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication on app load
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        setIsAuthenticated(true)
        setUser(JSON.parse(userData))
      } catch (e) {
        console.error('Error parsing user data:', e)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    }
    
    setLoading(false)
  }, [])

  const signUp = async (userData) => {
    try {
      const response = await authService.signUp(userData)
      setIsAuthenticated(true)
      setUser(response)
      return { success: true, user: response }
    } catch (error) {
      return { success: false, error: error }
    }
  }

  const signIn = async (credentials) => {
    try {
      const response = await authService.signIn(credentials)
      // If backend requires password reset on first login, it will return message 'RESET_REQUIRED'
      if (response && response.message === 'RESET_REQUIRED') {
        // Do not set authenticated; return flag so UI can redirect to first-login reset
        return { success: false, resetRequired: true, userId: response.id, email: response.email }
      }

      if (response && response.token) {
        setIsAuthenticated(true)
        setUser(response)
        return { success: true, user: response }
      }

      return { success: false, error: 'Invalid sign-in response' }
    } catch (error) {
      return { success: false, error: error }
    }
  }

  const signOut = async () => {
    await authService.signOut()
    setIsAuthenticated(false)
    setUser(null)
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}