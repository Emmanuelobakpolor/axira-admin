import { useState } from 'react';

const sections = ['Profile', 'Change Password', 'Update Email'];

export default function AccountPage() {
  const [active, setActive] = useState('Profile');

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
        {active === 'Profile' && <ProfileSection />}
        {active === 'Change Password' && <ChangePasswordSection />}
        {active === 'Update Email' && <UpdateEmailSection />}
      </div>
    </div>
  );
}

function ProfileSection() {
  return (
    <div className="account-form">
      <div className="account-avatar-row">
        <div className="account-avatar-circle">CM</div>
        <div className="account-avatar-info">
          <strong>chioma Maureen</strong>
          <span>chioma@axira.com</span>
        </div>
        <div className="account-avatar-actions">
          <button type="button" className="avatar-action-btn">Change picture</button>
          <button type="button" className="avatar-action-btn">Remove</button>
        </div>
      </div>

      <div className="account-field">
        <label>First Name</label>
        <input type="text" defaultValue="Feranmi" />
      </div>
      <div className="account-field">
        <label>Last Name</label>
        <input type="text" defaultValue="Adeleke" />
      </div>
      <div className="account-field">
        <label>Email</label>
        <div className="account-email-row">
          <input type="email" defaultValue="chioma@zinid.com" readOnly />
          <button type="button" className="change-email-link">Change Email</button>
        </div>
      </div>
      <div className="account-field">
        <label>Primary Phone Number</label>
        <input type="tel" defaultValue="080104233379" />
      </div>

      <button type="button" className="account-submit-btn">Update Profile</button>
    </div>
  );
}

function ChangePasswordSection() {
  return (
    <div className="account-form">
      <div className="account-field">
        <label>Current Password</label>
        <input type="password" placeholder="••••••••" />
      </div>
      <div className="account-field">
        <label>New Password</label>
        <input type="password" placeholder="••••••••" />
      </div>
      <div className="account-field">
        <label>Confirm New Password</label>
        <input type="password" placeholder="••••••••" />
      </div>
      <button type="button" className="account-submit-btn">Update Password</button>
    </div>
  );
}

function UpdateEmailSection() {
  return (
    <div className="account-form">
      <div className="account-field">
        <label>Current Email</label>
        <input type="email" defaultValue="chioma@zinid.com" readOnly />
      </div>
      <div className="account-field">
        <label>New Email</label>
        <input type="email" placeholder="Enter new email address" />
      </div>
      <div className="account-field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" />
      </div>
      <button type="button" className="account-submit-btn">Update Email</button>
    </div>
  );
}
