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
    throw Object.assign(new Error(err.detail || err.error || 'Request failed'), { status: res.status });
  }

  return res.json();
}

export const api = {
  login: (email, password) => request('POST', '/auth/sign-in/', { email, password }),
  overview: () => request('GET', '/admin/overview/'),
  users: () => request('GET', '/admin/users/'),
  userDetail: (id) => request('GET', `/admin/users/${id}/`),
  toggleBlacklist: (id) => request('POST', `/admin/users/${id}/`),
  transactions: (type) => request('GET', `/admin/transactions/${type ? `?type=${type}` : ''}`),
};
