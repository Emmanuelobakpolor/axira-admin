const BASE = 'https://web-production-b557d.up.railway.app/api';

let _token = localStorage.getItem('axira-admin-token') || '';

export function setToken(t) {
  _token = t;
  if (t) localStorage.setItem('axira-admin-token', t);
  else localStorage.removeItem('axira-admin-token');
}

export function getToken() {
  return _token;
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(
      new Error(err.detail || err.error || `Request failed (${res.status})`),
      { status: res.status },
    );
  }

  return res.json();
}

async function uploadFile(path, fieldName, file) {
  const form = new FormData();
  form.append(fieldName, file);

  const headers = {};
  if (_token) headers['Authorization'] = `Bearer ${_token}`;

  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(
      new Error(err.detail || err.error || `Upload failed (${res.status})`),
      { status: res.status },
    );
  }

  return res.json();
}

export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  login: (email, password) =>
    request('POST', '/auth/sign-in/', { email, password }),

  // ── Admin profile ─────────────────────────────────────────────────────────
  profile: () => request('GET', '/admin/profile/'),
  updateProfile: (data) => request('PATCH', '/admin/profile/', data),
  uploadProfilePhoto: (file) =>
    uploadFile('/auth/update-profile-photo/', 'profile_photo', file),
  removeProfilePhoto: () => request('POST', '/auth/remove-profile-photo/'),

  // Password / email
  changePassword: (currentPassword, newPassword, confirmPassword) =>
    request('POST', '/auth/change-password/', {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }),
  updateEmail: (newEmail, password) =>
    request('POST', '/auth/update-email/', { new_email: newEmail, password }),

  // ── Users ─────────────────────────────────────────────────────────────────
  users: () => request('GET', '/admin/users/'),
  userDetail: (id) => request('GET', `/admin/users/${id}/`),
  toggleBlacklist: (id) => request('POST', `/admin/users/${id}/`),

  // ── Transactions ──────────────────────────────────────────────────────────
  transactions: (type) =>
    request('GET', `/admin/transactions/${type ? `?type=${type}` : ''}`),

  // ── Crypto fee settings ───────────────────────────────────────────────────
  fees: () => request('GET', '/admin/fees/'),
  updateFee: (id, data) => request('PATCH', `/admin/fees/${id}/`, data),

  // ── Crypto order management ───────────────────────────────────────────────
  cryptoOrders: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/admin/crypto/orders/${qs ? `?${qs}` : ''}`);
  },
  cryptoOrderAction: (reference, action, note = '') =>
    request('POST', `/admin/crypto/orders/${reference}/`, { action, note }),
};
