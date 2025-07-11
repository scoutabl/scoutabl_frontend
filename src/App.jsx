// export default App
import "./App.css";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "./components/ui/sonner";
import AssesmentLayout from "./layouts/AssesmentLayout";
import { ThemeProvider } from "./context/ThemeContext";
import { PageTransition } from "./components/PageTransition";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { EnumsProvider } from "@/context/EnumsContext";
import NotFoundPage from "./pages/NotFoundPage";
import AuthNavbar from "./components/AuthNavbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AssessmentOnboarding from "./pages/AssessmentOnboarding";
import { AssessmentProvider } from "./context/AssesmentContext";
import Assesment from "./components/features/assesment/Assesment";
import CreateAssessmentFlow from "./components/features/assesment/create/CreateAssesmentFlow";
import SkillAssesment from "./pages/SkillAssesment";
import CodingAssesment from "./components/features/candidateAssesments/CodingAssesment";
import { handleAPIError } from "./lib/errorHandling";
import NavbarWrapper from "./components/common/NavbarWrapper";
import { ROUTES } from "./lib/routes";

// Protected Route component for authenticated users
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

// Auth Route component - prevents authenticated users from accessing login/register
const AuthRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if not loading and user is authenticated
    if (!loading && isAuthenticated) {
      navigate(ROUTES.ASSESSMENT_ONBOARDING, { replace: true });
    }
  }, [user, loading, isAuthenticated, navigate]);

  // Show loading while checking auth status
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is authenticated, don't render children (redirect handled by useEffect)
  if (isAuthenticated) {
    return null;
  }

  // Render children if user is not authenticated
  return children;
};

// Navigation wrapper component
const NavigationWrapper = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {isAuthPage ? <AuthNavbar /> : ""}
      <AnimatePresence mode="wait">{children}</AnimatePresence>
    </>
  );
};

// Routes wrapper component
const RoutesWithTransitions = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* Auth routes - only accessible when not logged in */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <AuthRoute>
            <PageTransition>
              <LoginPage />
            </PageTransition>
          </AuthRoute>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <AuthRoute>
            <PageTransition>
              <SignupPage />
            </PageTransition>
          </AuthRoute>
        }
      />

      {/* Protected routes - only accessible when logged in */}
      <Route
        path={ROUTES.ASSESSMENT_ONBOARDING}
        element={
          <ProtectedRoute>
            <NavbarWrapper>
              <PageTransition>
                <AssessmentOnboarding />
              </PageTransition>
            </NavbarWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ASSESSMENT}
        element={
          <ProtectedRoute>
            <NavbarWrapper>
              <PageTransition>
                <Assesment />
              </PageTransition>
            </NavbarWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.ASSESSMENT_CREATE}
        element={
          <ProtectedRoute>
            <NavbarWrapper>
              <PageTransition>
                <AssessmentProvider>
                  <CreateAssessmentFlow />
                </AssessmentProvider>
              </PageTransition>
            </NavbarWrapper>
          </ProtectedRoute>
        }
      />
      <Route element={<AssesmentLayout />}>
        <Route
          path={ROUTES.SKILL_ASSESSMENT}
          element={
            <ProtectedRoute>
              <NavbarWrapper>
                <PageTransition>
                  <SkillAssesment />
                </PageTransition>
              </NavbarWrapper>
            </ProtectedRoute>
          }
        />
      </Route>
      <Route element={<AssesmentLayout />}>
        <Route
          path={ROUTES.CODING_ASSESSMENT}
          element={
            <ProtectedRoute>
              <NavbarWrapper>
                <PageTransition>
                  <CodingAssesment />
                </PageTransition>
              </NavbarWrapper>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Redirect root based on auth state */}
      <Route
        path={ROUTES.ROOT}
        element={<Navigate to={ROUTES.ASSESSMENT_ONBOARDING} replace />}
      />
      <Route
        path={ROUTES.NOT_FOUND}
        element={
          <PageTransition>
            <NotFoundPage />
          </PageTransition>
        }
      />
    </Routes>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: handleAPIError,
    },
    mutations: {
      onError: handleAPIError,
    },
  },
});

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
            <Toaster richColors />
          </AuthProvider>
        </Router>
      </EnumsProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
