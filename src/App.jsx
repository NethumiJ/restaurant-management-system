// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import SignIn from './components/auth/SignIn'
import SignUp from './components/signup/SignUp'
import Dashboard from './components/dashboard/Dashboard'
import ChefDashboard from './components/dashboard/ChefDashboard'
import CashierDashboard from './components/dashboard/CashierDashboard'

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
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
  }
  
  return isAuthenticated ? children : <Navigate to="/signin" />
}

// Role-based route component
const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user, loading } = useAuth()
  
  // Wait for loading to complete
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
  }
  
  // Check authentication first
  if (!isAuthenticated) {
    return <Navigate to="/signin" />
  }
  
  // If user data is not loaded yet, wait
  if (!user) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading user data...</div>
  }
  
  // Normalize role to uppercase for comparison
  const userRole = user.role ? user.role.toUpperCase() : null
  
  // Debug logging (remove in production)
  console.log('RoleBasedRoute - User role:', userRole, 'Allowed roles:', allowedRoles)
  
  // ADMIN and MANAGER have access to everything
  if (userRole === 'ADMIN' || userRole === 'MANAGER' || allowedRoles.map(r => r.toUpperCase()).includes(userRole)) {
    return children
  }
  
  // Redirect to appropriate dashboard based on role
  if (userRole === 'CHEF') {
    return <Navigate to="/chef-dashboard" />
  } else if (userRole === 'CASHIER') {
    return <Navigate to="/cashier-dashboard" />
  } else if (userRole === 'MANAGER' || userRole === 'ADMIN') {
    return <Navigate to="/manager-dashboard" />
  }
  
  // If role doesn't match, redirect to signin
  console.warn('RoleBasedRoute - Access denied. User role:', userRole, 'Required roles:', allowedRoles)
  return <Navigate to="/signin" />
}

// Manager/Admin-only route (for staff management)
const ManagerRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth()
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" />
  }
  
  // Normalize role to uppercase for comparison
  const userRole = user.role ? user.role.toUpperCase() : null
  
  console.log('ManagerRoute - User role:', userRole)
  
  return (userRole === 'MANAGER' || userRole === 'ADMIN') ? children : <Navigate to="/signin" />
}

// Component to redirect users to their role-specific dashboard
const RoleBasedRedirect = () => {
  const { user, loading } = useAuth()
  
  if (loading || !user) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>
  }
  
  // Normalize role to uppercase for comparison
  const userRole = user.role ? user.role.toUpperCase() : null
  
  console.log('RoleBasedRedirect - User role:', userRole)
  
  if (userRole === 'CHEF') {
    return <Navigate to="/chef-dashboard" replace />
  } else if (userRole === 'CASHIER') {
    return <Navigate to="/cashier-dashboard" replace />
  } else if (userRole === 'MANAGER' || userRole === 'ADMIN') {
    return <Navigate to="/manager-dashboard" replace />
  }
  return <Navigate to="/signin" replace />
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
                  <RoleBasedRedirect />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chef-dashboard" 
              element={
                <RoleBasedRoute allowedRoles={['CHEF', 'MANAGER', 'ADMIN']}>
                  <ChefDashboard />
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/cashier-dashboard" 
              element={
                <RoleBasedRoute allowedRoles={['CASHIER', 'MANAGER', 'ADMIN']}>
                  <CashierDashboard />
                </RoleBasedRoute>
              } 
            />
            <Route 
              path="/manager-dashboard" 
              element={
                <RoleBasedRoute allowedRoles={['MANAGER', 'ADMIN']}>
                  <Dashboard />
                </RoleBasedRoute>
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
                <ManagerRoute>
                  <Admin />
                </ManagerRoute>
              }
            />
            <Route path="/request-reset" element={<ResetRequest />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/complete-first-login" element={<FirstLoginReset />} />
            <Route path="/" element={
              <ProtectedRoute>
                <RoleBasedRedirect />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
