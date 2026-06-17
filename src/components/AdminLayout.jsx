import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const navItems = [
  {
    label: 'Overview',
    path: '/overview',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="5.5" height="5.5" rx="1.5" />
        <rect x="10.5" y="2" width="5.5" height="5.5" rx="1.5" />
        <rect x="2" y="10.5" width="5.5" height="5.5" rx="1.5" />
        <rect x="10.5" y="10.5" width="5.5" height="5.5" rx="1.5" />
      </svg>
    ),
  },
  {
    label: 'Users',
    path: '/users',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="5.5" r="2.5" />
        <path d="M1.5 16c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" />
        <circle cx="13.5" cy="5.5" r="2" />
        <path d="M16.5 16c0-2.485-1.343-4.5-3-4.5" />
      </svg>
    ),
  },
  {
    label: 'Transaction',
    path: '/transactions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="9" cy="4.5" rx="6" ry="2" />
        <path d="M3 4.5v4c0 1.105 2.686 2 6 2s6-.895 6-2v-4" />
        <path d="M3 8.5v4c0 1.105 2.686 2 6 2s6-.895 6-2v-4" />
      </svg>
    ),
  },
  {
    label: 'Fees',
    path: '/fees',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2.5H3.5a1 1 0 00-1 1v6a1 1 0 00.293.707l6 6a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-6-6A1 1 0 009.5 2.5z" />
        <circle cx="5.5" cy="5.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const pageMeta = {
  '/overview': { title: 'Overview', subtitle: 'Performance and wallet activity across the platform' },
  '/users': { title: 'Users', subtitle: 'Monitor users, balances and account status' },
  '/transactions': { title: 'Transactions', subtitle: 'All swaps, deposits and withdrawals across the platform' },
  '/fees': { title: 'App fees', subtitle: 'Configure platform fees for swaps, deposits and withdrawals.' },
};

export default function AdminLayout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const meta = pageMeta[location.pathname] ?? pageMeta['/overview'];

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className="admin-shell">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      <aside className={`sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <BrandLogo />
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <button type="button" className="logout-button" onClick={onLogout}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2H3.5A1.5 1.5 0 002 3.5v9A1.5 1.5 0 003.5 14H6" />
            <path d="M11 11l3-3-3-3M14 8H6" />
          </svg>
          Sign out
        </button>
      </aside>

      <main className="admin-main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="hamburger"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle navigation"
            >
              <span />
              <span />
              <span />
            </button>

            <div className="search-box">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="7" cy="7" r="4.5" />
                <path d="M13.5 13.5l-2.8-2.8" />
              </svg>
              <input type="text" placeholder="Search..." aria-label="Search" />
            </div>
          </div>

          <div className="topbar-right">
            <button type="button" className="notif-btn" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2a6 6 0 016 6v2.5l1.5 2.5H2.5L4 10.5V8a6 6 0 016-6z" />
                <path d="M8 16.5a2 2 0 004 0" />
              </svg>
              <span className="notif-badge" />
            </button>

            <div className="admin-profile">
              <div className="avatar">A</div>
              <div className="profile-copy">
                <strong>ADMIN</strong>
                <span>letszz@gmail.com</span>
              </div>
            </div>
          </div>
        </header>

        <div className="page-banner">
          <h2>{meta.title}</h2>
          <p>{meta.subtitle}</p>
        </div>

        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
