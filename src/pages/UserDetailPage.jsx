import { useNavigate, useParams } from 'react-router-dom';
import { users } from '../data/mockData';

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = users.find((item) => item.id === id);

  if (!user) {
    return (
      <div className="page-stack">
        <button type="button" className="back-button" onClick={() => navigate('/users')}>
          ← Back to users
        </button>
        <div className="empty-state-card">
          <h2>User not found</h2>
          <p>The requested user profile does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <button type="button" className="back-button" onClick={() => navigate('/users')}>
        ← Back to users
      </button>

      <p className="ud-section-label">User Information</p>

      <div className="ud-card">
        <h3 className="ud-card-title">Personal Details (Preview)</h3>
        <div className="ud-divider" />

        <div className="ud-content">
          <div className="ud-info">
            <div className="ud-info-row">
              <span className="ud-info-key">Full Name:</span>
              <span className="ud-info-val">{user.name}</span>
            </div>
            <div className="ud-info-row">
              <span className="ud-info-key">Email:</span>
              <span className="ud-info-val">{user.email}</span>
            </div>
            <div className="ud-info-row">
              <span className="ud-info-key">Phone Number:</span>
              <span className="ud-info-val">{user.phone}</span>
            </div>
          </div>

          <div className="ud-photo-col">
            <div className="ud-avatar-photo">{user.profilePic}</div>
            <button type="button" className="ud-blacklist-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="8" cy="8" r="6.5" />
                <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" />
              </svg>
              Blacklist user
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
