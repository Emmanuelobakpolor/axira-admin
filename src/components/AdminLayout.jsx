import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  '/user-details': { title: 'User Details', subtitle: 'View selected user profile information' },
  '/transactions': { title: 'Transactions', subtitle: 'All swaps, deposits and withdrawals across the platform' },
  '/fees': { title: 'App fees', subtitle: 'Configure platform fees for swaps, deposits and withdrawals.' },
  '/account': { title: 'Account Settings', subtitle: 'Manage your profile, password and email address.' },
};

export default function AdminLayout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState('all');
  const [profileOpen, setProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const meta = pageMeta[location.pathname] ?? (
    location.pathname.startsWith('/users/') ? pageMeta['/user-details'] : pageMeta['/overview']
  );

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  // Close panels when clicking outside
  useEffect(() => {
    function handleOutside(e) {
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileOpen && profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [notifOpen, profileOpen]);

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
                end={item.path === '/users'}
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
            {/* ── Notification bell ── */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                type="button"
                className={`notif-btn${notifOpen ? ' notif-btn-active' : ''}`}
                aria-label="Notifications"
                onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 2a6 6 0 016 6v2.5l1.5 2.5H2.5L4 10.5V8a6 6 0 016-6z" />
                  <path d="M8 16.5a2 2 0 004 0" />
                </svg>
                <span className="notif-badge" />
              </button>

              {notifOpen && (
                <div className="notif-panel">
                  <div className="notif-panel-header">
                    <h3>Notification</h3>
                    <button type="button" className="notif-close" onClick={() => setNotifOpen(false)}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M1 1l12 12M13 1L1 13" />
                      </svg>
                    </button>
                  </div>

                  <div className="notif-tab-row">
                    <button
                      type="button"
                      className={`notif-tab${notifTab === 'all' ? ' active' : ''}`}
                      onClick={() => setNotifTab('all')}
                    >
                      All Notification
                    </button>
                    <button
                      type="button"
                      className={`notif-tab${notifTab === 'unread' ? ' active' : ''}`}
                      onClick={() => setNotifTab('unread')}
                    >
                      Unread
                    </button>
                  </div>

                  <div className="notif-empty-state">
                    <div className="notif-empty-icon-wrap">
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <path d="M18 4a10 10 0 0110 10v4.2l2.5 4.2H5.5L8 18.2V14A10 10 0 0118 4z" fill="#3b82f6" opacity=".18" />
                        <path d="M18 4a10 10 0 0110 10v4.2l2.5 4.2H5.5L8 18.2V14A10 10 0 0118 4z" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14.5 28a3.5 3.5 0 007 0" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="26" cy="26" r="6" fill="#2563eb" />
                        <path d="M23 26l2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h4>You're all caught up</h4>
                    <p>We'll let you know when something needs your attention</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Admin profile ── */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button
                type="button"
                className="admin-profile-btn"
                onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
              >
                <div className="avatar">A</div>
                <div className="profile-copy">
                  <strong>ADMIN</strong>
                  <span>letszz@gmail.com</span>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M3 5l4 4 4-4" />
                </svg>
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-head">
                    <div className="avatar">A</div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.84rem', color: '#111827' }}>ADMIN</strong>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>letszz@gmail.com</span>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider" />

                  <button
                    type="button"
                    className="profile-dropdown-item"
                    onClick={() => { navigate('/account'); setProfileOpen(false); }}
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="7.5" cy="4.5" r="2.5" />
                      <path d="M1.5 14c0-3.314 2.686-6 6-6s6 2.686 6 6" />
                    </svg>
                    View Profile
                  </button>
                  <button
                    type="button"
                    className="profile-dropdown-item"
                    onClick={() => { navigate('/account'); setProfileOpen(false); }}
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="7.5" cy="7.5" r="5.5" />
                      <path d="M7.5 4.5v3l2 1.5" />
                    </svg>
                    Account Settings
                  </button>

                  <div className="profile-dropdown-divider" />

                  <button
                    type="button"
                    className="profile-dropdown-item danger"
                    onClick={() => { setProfileOpen(false); onLogout(); }}
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5.5 2H3A1.5 1.5 0 001.5 3.5v8A1.5 1.5 0 003 13h2.5" />
                      <path d="M10 10.5l3-3-3-3M13 7.5H5.5" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
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
