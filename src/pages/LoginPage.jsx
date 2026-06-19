import { useState } from 'react';

export default function LoginPage({ onLogin, error }) {
  const [email, setEmail] = useState('admin@axira.com');
  const [password, setPassword] = useState('axira123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    onLogin(email.trim(), password);
    setLoading(false);
  };

  return (
    <div className="login-screen">
      <div className="login-panel">
        <div className="login-brand">
          <img src="/LOGOADMIN.png" alt="Axira" className="brand-logo-img" />
          <h1>AXIRA</h1>
          <p>TRADE · INVEST · GROW</p>
          <span className="login-tag">Admin Dashboard</span>
        </div>

        <div className="login-card">
          <div className="login-copy">
            <h2>Welcome back</h2>
            <p>Sign in to manage the Axira platform.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <label>
              <span>Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@axira.com"
                required
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            {error ? <p className="form-error">{error}</p> : null}

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="login-hint">
            <span>Demo credentials</span>
            <strong>admin@axira.com · axira123</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
