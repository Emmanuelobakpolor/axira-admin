import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import TransactionsPage from './pages/TransactionsPage';
import UsersPage from './pages/UsersPage';
import FeesPage from './pages/FeesPage';

const AUTH_KEY = 'axira-admin-auth';
const DEMO_CREDENTIALS = {
  email: 'admin@axira.com',
  password: 'axira123',
};

function ProtectedRoutes({ onLogout }) {
  return (
    <AdminLayout onLogout={onLogout}>
      <Routes>
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/fees" element={<FeesPage />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </AdminLayout>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem(AUTH_KEY) === 'true');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }

    if (isAuthenticated && location.pathname === '/login') {
      navigate('/overview', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const authActions = useMemo(
    () => ({
      login: (email, password) => {
        if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
          localStorage.setItem(AUTH_KEY, 'true');
          setAuthError('');
          setIsAuthenticated(true);
          navigate('/overview', { replace: true });
          return true;
        }

        setAuthError('Invalid credentials. Use admin@axira.com and axira123.');
        return false;
      },
      logout: () => {
        localStorage.removeItem(AUTH_KEY);
        setIsAuthenticated(false);
        navigate('/login', { replace: true });
      },
    }),
    [navigate],
  );

  return isAuthenticated ? (
    <ProtectedRoutes onLogout={authActions.logout} />
  ) : (
    <Routes>
      <Route path="/login" element={<LoginPage error={authError} onLogin={authActions.login} />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
