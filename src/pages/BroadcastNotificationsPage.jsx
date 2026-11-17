import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';

export default function BroadcastNotificationsPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [targetScope, setTargetScope] = useState('all_users');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [messageType, setMessageType] = useState('general');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.users()
      .then((data) => {
        setUsers(data.users || []);
      })
      .catch((e) => setError(e.message || 'Could not load users.'))
      .finally(() => setLoadingUsers(false));
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) => {
      const name = (user.full_name || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      return name.includes(query) || email.includes(query);
    });
  }, [users, search]);

  function toggleUser(user) {
    setSelectedUserIds((current) => {
      const isSelected = current.includes(user.id);
      return isSelected
        ? current.filter((id) => id !== user.id)
        : [...current, user.id];
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !body.trim()) {
      setError('Title and message are required.');
      return;
    }

    if (targetScope === 'specific_users' && selectedUserIds.length === 0) {
      setError('Select at least one user when sending to specific users.');
      return;
    }

    setSending(true);

    try {
      const payload = {
        title: title.trim(),
        body: body.trim(),
        message_type: messageType,
        target_scope: targetScope,
        user_ids: targetScope === 'specific_users' ? selectedUserIds : [],
      };

      const result = await api.sendBroadcast(payload);
      setSuccess(
        `Broadcast sent successfully to ${result.target_users || 0} user${(result.target_users || 0) === 1 ? '' : 's'}.`,
      );
      setTitle('');
      setBody('');
      setSelectedUserIds([]);
      setTargetScope('all_users');
    } catch (e) {
      setError(e.message || 'Broadcast failed.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="headline-card">
        <strong>Broadcast Messages</strong>
        <span>Send push + in-app notifications to all users or selected people.</span>
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field">
            <span>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="System update"
              maxLength={200}
            />
          </label>

          <label className="field">
            <span>Message type</span>
            <select value={messageType} onChange={(e) => setMessageType(e.target.value)}>
              <option value="general">General</option>
              <option value="update">Update</option>
              <option value="alert">Alert</option>
              <option value="security">Security</option>
            </select>
          </label>
        </div>

        <div className="field">
          <span>Audience</span>
          <div className="segment-control">
            <button
              type="button"
              className={targetScope === 'all_users' ? 'active' : ''}
              onClick={() => setTargetScope('all_users')}
            >
              All users
            </button>
            <button
              type="button"
              className={targetScope === 'specific_users' ? 'active' : ''}
              onClick={() => setTargetScope('specific_users')}
            >
              Specific users
            </button>
          </div>
        </div>

        {targetScope === 'specific_users' && (
          <div className="field">
            <span>Select users</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
            />

            <div className="user-pick-list">
              {loadingUsers ? (
                <p className="muted-text">Loading users…</p>
              ) : filteredUsers.length === 0 ? (
                <p className="muted-text">No users found.</p>
              ) : (
                filteredUsers.map((user) => {
                  const selected = selectedUserIds.includes(user.id);
                  return (
                    <button
                      key={user.id}
                      type="button"
                      className={`user-pick-item${selected ? ' selected' : ''}`}
                      onClick={() => toggleUser(user)}
                    >
                      <div>
                        <strong>{user.full_name || 'Unnamed user'}</strong>
                        <small>{user.email}</small>
                      </div>
                      <span>{selected ? 'Selected' : 'Select'}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        <label className="field">
          <span>Message</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Write the message users should receive in-app and as push notification"
          />
        </label>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={sending}>
            {sending ? 'Sending…' : 'Send broadcast'}
          </button>
        </div>
      </form>
    </div>
  );
}
