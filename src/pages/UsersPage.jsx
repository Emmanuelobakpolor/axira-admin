import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsersTable } from '../components/DataTable';
import { api } from '../api';

export default function UsersPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.users()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-stack"><p className="muted-text">Loading…</p></div>;
  if (error) return <div className="page-stack"><p className="form-error">{error}</p></div>;

  const userStats = [
    { label: 'Total', value: data.total, color: '#2f86ff' },
    { label: 'Active', value: data.active, color: '#10b981' },
    { label: 'Blacklisted', value: data.blacklisted, color: '#dd3d53' },
  ];

  const filtered = search.trim()
    ? data.users.filter(
        (u) =>
          u.full_name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.phone.includes(search),
      )
    : data.users;

  const rows = filtered.map((u) => ({
    id: u.id,
    name: u.full_name,
    email: u.email,
    phone: u.phone,
    balance: '₦' + (parseFloat(u.ngn_balance) || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 }),
    status: u.is_active ? 'Active' : 'Blacklisted',
    lastActive: new Date(u.created_at).toLocaleDateString('en-NG'),
    profilePic: u.full_name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
  }));

  return (
    <div className="page-stack">
      <section className="headline-card">
        <strong>Number of Users: </strong>
        <span>{data.total.toLocaleString()}</span>
      </section>

      <section className="user-toolbar">
        <div className="user-stats-grid">
          {userStats.map((item) => (
            <article key={item.label} className="user-stat-card">
              <div className="user-stat-label">
                <span className="user-stat-dot" style={{ backgroundColor: item.color }} />
                <p>{item.label}</p>
              </div>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>

        <div className="toolbar-actions">
          <input
            className="toolbar-button muted"
            style={{ cursor: 'text', minWidth: 180 }}
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <UsersTable
        rows={rows}
        onUserSelect={(row) => navigate(`/users/${encodeURIComponent(row.id)}`)}
      />
    </div>
  );
}
