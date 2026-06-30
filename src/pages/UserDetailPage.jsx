import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

function TxRow({ tx }) {
  const typeLabel = {
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    giftcard_buy: 'Gift Card Buy',
    giftcard_sell: 'Gift Card Sell',
  }[tx.type] || tx.type;

  const statusColor = {
    completed: '#10b981',
    approved: '#10b981',
    pending: '#f59e0b',
    failed: '#ef4444',
    declined: '#ef4444',
  }[tx.status] || '#9ca3af';

  return (
    <tr>
      <td>{new Date(tx.created_at).toLocaleDateString('en-NG')}</td>
      <td>{typeLabel}</td>
      <td>₦{(parseFloat(tx.amount_ngn) || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
      <td>
        <span style={{ color: statusColor, fontWeight: 600, textTransform: 'capitalize' }}>
          {tx.status}
        </span>
      </td>
      <td style={{ fontSize: 12, color: '#9ca3af' }}>{tx.reference}</td>
    </tr>
  );
}

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [blacklisting, setBlacklisting] = useState(false);

  useEffect(() => {
    api.userDetail(decodeURIComponent(id))
      .then(setUser)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleToggleBlacklist() {
    if (!window.confirm(user.is_active ? 'Blacklist this user?' : 'Restore this user?')) return;
    setBlacklisting(true);
    try {
      const res = await api.toggleBlacklist(user.id);
      setUser((u) => ({ ...u, is_active: res.is_active }));
    } catch (e) {
      alert(e.message);
    } finally {
      setBlacklisting(false);
    }
  }

  if (loading) return <div className="page-stack"><p className="muted-text">Loading…</p></div>;
  if (error) return (
    <div className="page-stack">
      <button type="button" className="back-button" onClick={() => navigate('/users')}>← Back to users</button>
      <div className="empty-state-card"><p className="form-error">{error}</p></div>
    </div>
  );

  const balance = (parseFloat(user.ngn_balance) || 0).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
  });

  return (
    <div className="page-stack">
      <button type="button" className="back-button" onClick={() => navigate('/users')}>
        ← Back to users
      </button>

      <p className="ud-section-label">User Information</p>

      <div className="ud-card">
        <h3 className="ud-card-title">Personal Details</h3>
        <div className="ud-divider" />

        <div className="ud-content">
          <div className="ud-info">
            <div className="ud-info-row">
              <span className="ud-info-key">Full Name:</span>
              <span className="ud-info-val">{user.full_name}</span>
            </div>
            <div className="ud-info-row">
              <span className="ud-info-key">Email:</span>
              <span className="ud-info-val">{user.email}</span>
            </div>
            <div className="ud-info-row">
              <span className="ud-info-key">Phone:</span>
              <span className="ud-info-val">{user.phone}</span>
            </div>
            <div className="ud-info-row">
              <span className="ud-info-key">NGN Balance:</span>
              <span className="ud-info-val" style={{ fontWeight: 700 }}>₦{balance}</span>
            </div>
            <div className="ud-info-row">
              <span className="ud-info-key">Status:</span>
              <span
                className="ud-info-val"
                style={{ color: user.is_active ? '#10b981' : '#ef4444', fontWeight: 600 }}
              >
                {user.is_active ? 'Active' : 'Blacklisted'}
              </span>
            </div>
            <div className="ud-info-row">
              <span className="ud-info-key">Joined:</span>
              <span className="ud-info-val">{new Date(user.created_at).toLocaleDateString('en-NG')}</span>
            </div>
          </div>

          <div className="ud-photo-col">
            {user.profile_photo ? (
              <img src={user.profile_photo} alt={user.full_name} className="ud-avatar-photo" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="ud-avatar-photo">
                {user.full_name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              className="ud-blacklist-btn"
              onClick={handleToggleBlacklist}
              disabled={blacklisting}
              style={!user.is_active ? { background: '#d1fae5', color: '#065f46', borderColor: '#6ee7b7' } : {}}
            >
              {user.is_active ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <circle cx="8" cy="8" r="6.5" /><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" />
                  </svg>
                  {blacklisting ? 'Working…' : 'Blacklist user'}
                </>
              ) : blacklisting ? 'Working…' : 'Restore user'}
            </button>
          </div>
        </div>
      </div>

      {user.transactions.length > 0 && (
        <div className="ud-card">
          <h3 className="ud-card-title">Transaction History</h3>
          <div className="ud-divider" />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ color: '#9ca3af', textAlign: 'left' }}>
                  <th style={{ padding: '8px 12px' }}>Date</th>
                  <th style={{ padding: '8px 12px' }}>Type</th>
                  <th style={{ padding: '8px 12px' }}>Amount</th>
                  <th style={{ padding: '8px 12px' }}>Status</th>
                  <th style={{ padding: '8px 12px' }}>Reference</th>
                </tr>
              </thead>
              <tbody>
                {user.transactions.map((tx) => <TxRow key={tx.id} tx={tx} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
