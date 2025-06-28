import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AnimatePresence } from 'framer-motion';
import { Toaster } from './components/ui/sonner'
import AssesmentLayout from './layouts/AssesmentLayout';
import { ThemeProvider } from './context/ThemeContext';
import { PageTransition } from './components/PageTransition';
import { AuthProvider, useAuth } from './context/AuthContext'
import { EnumsProvider } from "@/context/EnumsContext";
import NotFoundPage from './pages/NotFoundPage';
import AuthNavbar from './components/AuthNavbar'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import { AssessmentProvider } from './context/AssesmentContext';
import Assesment from './components/features/assesment/Assesment';
import CreateAssessmentFlow from './components/features/assesment/create/CreateAssesmentFlow';
import SkillAssesment from './pages/SkillAssesment'
import CodingAssesment from './components/features/candidateAssesments/CodingAssesment'

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
  // const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {isAuthPage ? <AuthNavbar /> : ""}
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </>
  );
};

// Routes wrapper component
const RoutesWithTransitions = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/login"
        element={
          <LoginPage />
        }
      />
      <Route
        path="/register"
        element={
          <SignupPage />
        }
      />
      {/* <Route path='/organization-setup' element={<OrganizationSetupPage />} /> */}

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <PageTransition>
              <HomePage />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessment"
        element={
          <ProtectedRoute>
            <PageTransition>
              <Assesment />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessment/create/:stepId"
        element={
          <ProtectedRoute>
            <PageTransition>
              <AssessmentProvider>
                <CreateAssessmentFlow />
              </AssessmentProvider>
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route element={<AssesmentLayout />}>
        <Route
          path="/skill-assesment"
          element={
            <ProtectedRoute>
              <PageTransition>
                <SkillAssesment />
              </PageTransition>
            </ProtectedRoute>
          }
        />
      </Route>
      <Route element={<AssesmentLayout />}>
        <Route
          path="/coding-assesment"
          element={
            <ProtectedRoute>
              <PageTransition>
                <CodingAssesment />
              </PageTransition>
            </ProtectedRoute>
          }
        />
      </Route>
      {/* Redirect root to dashboard or login based on auth state */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />
      <Route
        path="*"
        element={
          <PageTransition>
            <NotFoundPage />
          </PageTransition>
        }
      />
    </Routes>
  );
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EnumsProvider>
        <Router>
          <AuthProvider>
            <ThemeProvider>
              <NavigationWrapper>
                <RoutesWithTransitions />
              </NavigationWrapper>
            </ThemeProvider>
            <Toaster />
          </AuthProvider>
        </Router>
      </EnumsProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
