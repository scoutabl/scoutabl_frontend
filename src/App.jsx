import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import { Toaster } from './components/ui/sonner'
import { AuthProvider, useAuth } from './context/AuthContext'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          {/* <Route path='/organization-setup' element={<OrganizationSetupPage />} /> */}

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          {/* Redirect root to dashboard or login based on auth state */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  )
}

export default App
