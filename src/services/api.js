export const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const asset = (u) => (u ? API + u : null);
export async function api(path, { method = 'GET', body, form } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(API + '/api' + path, {
    method,
    headers: { Accept: 'application/json', ...(token && { Authorization: 'Bearer ' + token }), ...(body && { 'Content-Type': 'application/json' }) },
    body: form || (body && JSON.stringify(body)),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'មានបញ្ហា');
  return data;
}
