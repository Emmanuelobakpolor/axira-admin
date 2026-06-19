import { useNavigate } from 'react-router-dom';
import { UsersTable } from '../components/DataTable';
import { userStats, users } from '../data/mockData';

export default function UsersPage() {
  const navigate = useNavigate();

  return (
    <div className="page-stack">
      <section className="headline-card">
        <strong>Number of Users: </strong>
        <span>1200</span>
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
          <button type="button" className="toolbar-button muted">
            Filters
          </button>
          <button type="button" className="toolbar-button primary-outline">
            Show all
          </button>
        </div>
      </section>

      <UsersTable
        rows={users}
        onUserSelect={(row) => navigate(`/users/${encodeURIComponent(row.id)}`)}
      />
    </div>
  );
}
