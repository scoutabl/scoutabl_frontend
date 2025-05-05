import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar'
import AuthNavbar from './components/AuthNavbar'
import HomePage from './pages/HomePage'
import { Toaster } from './components/ui/sonner'
import { AuthProvider, useAuth } from './context/AuthContext'
import SkillAssesment from './pages/SkillAssesment'

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

// Navigation wrapper component
const NavigationWrapper = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {isAuthPage ? <AuthNavbar /> : user && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavigationWrapper>
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
            <Route
              path="/assesment"
              element={
                <ProtectedRoute>
                  <SkillAssesment />
                </ProtectedRoute>
              }
            />
            {/* Redirect root to dashboard or login based on auth state */}
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />
          </Routes>
        </NavigationWrapper>
        <Toaster />
      </AuthProvider>
    </Router>
  )
}

export default App
