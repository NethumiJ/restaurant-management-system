// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import SignIn from './components/auth/SignIn'
import SignUp from './components/signup/SignUp'
import Dashboard from './components/dashboard/Dashboard'

// import Products from './components/Products'
// import Inventory from './components/Inventory'
import Analytics from './components/analytics/Food-analytics'
import Admin from './components/admin/Admin'
import ResetRequest from './components/auth/ResetRequest'
import ResetPassword from './components/auth/ResetPassword'
import FirstLoginReset from './components/auth/FirstLoginReset'
// import Settings from './components/Settings'
import './App.css'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/signin" />
}

// Admin-only route
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  return isAuthenticated && user?.role === 'ADMIN' ? children : <Navigate to="/signin" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/food-analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route path="/request-reset" element={<ResetRequest />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/complete-first-login" element={<FirstLoginReset />} />
            <Route path="/" element={<Navigate to="/signin" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App