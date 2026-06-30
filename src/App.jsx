import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import TransactionsPage from './pages/TransactionsPage';
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetailPage';
import FeesPage from './pages/FeesPage';
import AccountPage from './pages/AccountPage';
import { api, getToken, setToken } from './api';

const AUTH_KEY = 'axira-admin-auth';

function ProtectedRoutes({ onLogout }) {
  return (
    <AdminLayout onLogout={onLogout}>
      <Routes>
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/fees" element={<FeesPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </AdminLayout>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(AUTH_KEY) === 'true' && !!getToken(),
  );
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
      login: async (email, password) => {
        try {
          const data = await api.login(email, password);
          if (!data.user?.is_staff) {
            setAuthError('Access denied. Admin accounts only.');
            return false;
          }
          setToken(data.access);
          localStorage.setItem(AUTH_KEY, 'true');
          setAuthError('');
          setIsAuthenticated(true);
          navigate('/overview', { replace: true });
          return true;
        } catch (err) {
          setAuthError(err.message || 'Invalid credentials.');
          return false;
        }
      },
      logout: () => {
        setToken('');
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
