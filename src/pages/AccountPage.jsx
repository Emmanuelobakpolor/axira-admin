import { useEffect, useRef, useState } from 'react';
import { api } from '../api';

const sections = ['Profile', 'Change Password', 'Update Email'];

export default function AccountPage() {
  const [active, setActive] = useState('Profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.profile()
      .then((data) => setUser(data.user))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-stack"><p className="muted-text">Loading…</p></div>;
  if (error && !user) return <div className="page-stack"><p className="form-error">{error}</p></div>;

  const initials = user
    ? user.full_name.trim().split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="account-shell">
      <aside className="account-sidebar-panel">
        <h4 className="account-sidebar-title">Account</h4>
        <nav className="account-sidebar-nav">
          {sections.map((s) => (
            <button
              key={s}
              type="button"
              className={`account-nav-btn${active === s ? ' active' : ''}`}
              onClick={() => setActive(s)}
            >
              {s}
            </button>
          ))}
        </nav>
      </aside>

      <div className="account-content-panel">
        {active === 'Profile' && (
          <ProfileSection user={user} initials={initials} onUpdated={setUser} />
        )}
        {active === 'Change Password' && <ChangePasswordSection />}
        {active === 'Update Email' && (
          <UpdateEmailSection currentEmail={user?.email || ''} onUpdated={setUser} />
        )}
      </div>
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────

function ProfileSection({ user, initials, onUpdated }) {
  const [firstName, setFirstName] = useState(() => {
    const parts = (user?.full_name || '').trim().split(' ');
    return parts[0] || '';
  });
  const [lastName, setLastName] = useState(() => {
    const parts = (user?.full_name || '').trim().split(' ');
    return parts.slice(1).join(' ') || '';
  });
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const fileRef = useRef(null);

  const hasPhoto = !!(user?.profile_photo);
  const photoUrl = user?.profile_photo || null;

  async function handleSave(e) {
    e.preventDefault();
    const full_name = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (full_name.length < 2) { setErr('Name is too short.'); return; }
    setSaving(true); setErr(''); setMsg('');
    try {
      const data = await api.updateProfile({ full_name, phone });
      onUpdated(data.user);
      setMsg('Profile updated successfully.');
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr(''); setMsg('');
    try {
      const data = await api.uploadProfilePhoto(file);
      onUpdated(data.user);
      setMsg('Photo updated.');
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleRemovePhoto() {
    if (!hasPhoto) return;
    setUploading(true); setErr(''); setMsg('');
    try {
      const data = await api.removeProfilePhoto();
      onUpdated(data.user);
      setMsg('Photo removed.');
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form className="account-form" onSubmit={handleSave}>
      {/* Avatar row */}
      <div className="account-avatar-row">
        <div
          className="account-avatar-circle"
          style={photoUrl ? { backgroundImage: `url(${photoUrl})`, backgroundSize: 'cover', color: 'transparent' } : {}}
        >
          {!photoUrl && initials}
          {uploading && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'rgba(0,0,0,0.4)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: 11 }}>…</span>
            </div>
          )}
        </div>
        <div className="account-avatar-info">
          <strong>{user?.full_name}</strong>
          <span>{user?.email}</span>
        </div>
        <div className="account-avatar-actions">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
          <button
            type="button"
            className="avatar-action-btn"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? 'Uploading…' : 'Change picture'}
          </button>
          {hasPhoto && (
            <button
              type="button"
              className="avatar-action-btn"
              disabled={uploading}
              onClick={handleRemovePhoto}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {msg && <p className="form-success">{msg}</p>}
      {err && <p className="form-error">{err}</p>}

      <div className="account-field">
        <label>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div className="account-field">
        <label>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="account-field">
        <label>Email</label>
        <div className="account-email-row">
          <input type="email" value={user?.email || ''} readOnly />
          <span className="change-email-link muted-text" style={{ fontSize: 12 }}>
            Use "Update Email" tab to change
          </span>
        </div>
      </div>
      <div className="account-field">
        <label>Primary Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <button type="submit" className="account-submit-btn" disabled={saving}>
        {saving ? 'Saving…' : 'Update Profile'}
      </button>
    </form>
  );
}

// ── Change Password ───────────────────────────────────────────────────────────

function ChangePasswordSection() {
  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (newPw !== confirm) { setErr('New passwords do not match.'); return; }
    if (newPw.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    setSaving(true); setErr(''); setMsg('');
    try {
      await api.changePassword(current, newPw, confirm);
      setMsg('Password updated successfully.');
      setCurrent(''); setNewPw(''); setConfirm('');
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="account-form" onSubmit={handleSubmit}>
      {msg && <p className="form-success">{msg}</p>}
      {err && <p className="form-error">{err}</p>}

      <div className="account-field">
        <label>Current Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
        />
      </div>
      <div className="account-field">
        <label>New Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          required
        />
      </div>
      <div className="account-field">
        <label>Confirm New Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="account-submit-btn" disabled={saving}>
        {saving ? 'Updating…' : 'Update Password'}
      </button>
    </form>
  );
}

// ── Update Email ──────────────────────────────────────────────────────────────

function UpdateEmailSection({ currentEmail, onUpdated }) {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setErr(''); setMsg('');
    try {
      const data = await api.updateEmail(newEmail, password);
      onUpdated(data.user);
      setMsg('Email updated successfully.');
      setNewEmail(''); setPassword('');
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="account-form" onSubmit={handleSubmit}>
      {msg && <p className="form-success">{msg}</p>}
      {err && <p className="form-error">{err}</p>}

      <div className="account-field">
        <label>Current Email</label>
        <input type="email" value={currentEmail} readOnly />
      </div>
      <div className="account-field">
        <label>New Email</label>
        <input
          type="email"
          placeholder="Enter new email address"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
        />
      </div>
      <div className="account-field">
        <label>Confirm with Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="account-submit-btn" disabled={saving}>
        {saving ? 'Updating…' : 'Update Email'}
      </button>
    </form>
  );
}
