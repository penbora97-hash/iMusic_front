import { api } from './api';
export const stats = () => api('/admin/stats');
export const users = () => api('/admin/users');
export const toggleUser = (id) => api(`/admin/users/${id}/toggle`, { method: 'PATCH' });
