import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardContent from './DashboardContent';
import TasksPage from './TasksPage';
import ContactsPage from './ContactsPage';
import LeadsPage from './LeadsPage';
import DealsPage from './DealsPage';
import AccountsPage from './AccountsPage';
import SettingsPage from './SettingsPage';
import UserProfilePage from './UserProfilePage';
import ReportsPage from './ReportsPage';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import { AuthProvider, useAuth } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

function AuthenticatedLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#1c1c1c] overflow-hidden text-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUpPage />
          </PublicRoute>
        }
      />

      {/* Authenticated Dashboard Routes */}
      <Route element={<AuthenticatedLayout />}>
        <Route path="/" element={<DashboardContent />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route
          path="*"
          element={
            <div className="p-8 text-gray-400">
              <h2 className="text-xl font-bold text-white mb-2">Page Not Found</h2>
              <p>The page you requested is under construction or does not exist.</p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
