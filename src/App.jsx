import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import OrganizationSetupPage from './pages/OrganizationSetupPage'
import HomePage from './pages/HomePage'
import { Toaster } from './components/ui/sonner'
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path='/organization-setup' element={<OrganizationSetupPage />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/home' element={<HomePage />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
