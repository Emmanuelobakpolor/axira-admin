import { useNavigate, useParams } from 'react-router-dom';
import { StatusPill } from '../components/StatusPill';
import { users } from '../data/mockData';

function statusTone(status) {
  if (status === 'Blacklisted') return 'danger';
  if (status === 'Pending') return 'warning';
  return 'success';
}

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = users.find((item) => item.id === id);

  if (!user) {
    return (
      <div className="page-stack user-details-page">
        <button type="button" className="back-button" onClick={() => navigate('/users')}>
          Back to users
        </button>
        <section className="empty-state-card">
          <h2>User not found</h2>
          <p>The requested user profile does not exist.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack user-details-page">
      <button type="button" className="back-button" onClick={() => navigate('/users')}>
        Back to users
      </button>

      <section className="detail-hero-card">
        <div className="detail-avatar">{user.profilePic}</div>
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <div className="detail-status-row">
            <StatusPill tone={statusTone(user.status)}>{user.status}</StatusPill>
            <span>Last active {user.lastActive}</span>
          </div>
        </div>
      </section>

      <section className="detail-card">
        <div className="detail-card-header">
          <h2>Personal Details</h2>
          <span>Account profile</span>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Full name</span>
            <strong>{user.name}</strong>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone number</span>
            <strong>{user.phone}</strong>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <strong>{user.email}</strong>
          </div>
          <div className="detail-item">
            <span className="detail-label">Profile picture</span>
            <div className="detail-avatar small">{user.profilePic}</div>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <StatusPill tone={statusTone(user.status)}>{user.status}</StatusPill>
          </div>
          <div className="detail-item">
            <span className="detail-label">Balance</span>
            <strong>{user.balance}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
