import type { AuthProvider } from '@refinedev/core';

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Login failed');
    }

    const { token } = await res.json();
    if (token) {
      localStorage.setItem('admin_token', token);
    }
    return { success: true, redirectTo: '/' };
  },

  logout: async () => {
    localStorage.removeItem('admin_token');
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    return { success: true, redirectTo: '/login' };
  },

  check: async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return { authenticated: false };

    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    if (!res.ok) return { authenticated: false };
    return { authenticated: true };
  },

  getIdentity: async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return null;
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { id: 1, name: data.email ?? 'Admin', email: data.email };
  },

  onError: () => Promise.resolve({ logout: false }),
};
