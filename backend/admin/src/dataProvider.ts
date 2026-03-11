import type { DataProvider } from '@refinedev/core';

const API_URL = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchApi(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response;
}

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters }) => {
    const { current = 1, pageSize = 10 } = pagination ?? {};
    const params = new URLSearchParams();
    params.set('page', String(current));
    params.set('limit', String(pageSize));

    if (resource === 'contacts') {
      const res = await fetch(`${API_URL}/contacts`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) {
        return { data: [], total: 0 };
      }
      const data = await res.json();
      const normalized = { ...data, id: data.id ?? 'contact' };
      return { data: [normalized], total: 1 };
    }

    const url = `${API_URL}/${resource}?${params}`;
    const res = await fetchApi(url);
    const data = await res.json();

    const list = Array.isArray(data) ? data : (data.data ?? []);
    const total = data.total ?? list.length;

    const slugResources = ['holiday-rentals', 'your-future-home', 'blog-posts'];
    const normalized = list.map((item: Record<string, unknown>) => {
      if (slugResources.includes(resource)) {
        return { ...item, id: item.slug ?? item.id };
      }
      if (resource === 'contact-form-submissions') {
        return { ...item, id: item.id };
      }
      return item;
    });

    return { data: normalized, total };
  },

  getOne: async ({ resource, id }) => {
    if (resource === 'contacts') {
      const res = await fetchApi(`${API_URL}/contacts`);
      const data = await res.json();
      return { data: { ...data, id: data.id ?? 'contact' } };
    }

    if (resource === 'contact-form-submissions') {
      const res = await fetchApi(`${API_URL}/contact-form-submissions/${id}`);
      const data = await res.json();
      return { data };
    }

    const slugResources = ['holiday-rentals', 'your-future-home', 'blog-posts'];
    const identifier = slugResources.includes(resource) ? id : id;
    const res = await fetchApi(`${API_URL}/${resource}/${identifier}`);
    const data = await res.json();

    const normalized = slugResources.includes(resource)
      ? { ...data, id: data.slug ?? data.id }
      : data;

    return { data: normalized };
  },

  create: async ({ resource, variables }) => {
    if (resource === 'contacts') {
      const res = await fetchApi(`${API_URL}/contacts`, {
        method: 'PATCH',
        body: JSON.stringify(variables),
      });
      const data = await res.json();
      return { data: { ...data, id: data.id ?? 'contact' } };
    }

    const res = await fetchApi(`${API_URL}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(variables),
    });
    const data = await res.json();

    const slugResources = ['holiday-rentals', 'your-future-home', 'blog-posts'];
    const normalized = slugResources.includes(resource)
      ? { ...data, id: data.slug ?? data.id }
      : data;

    return { data: normalized };
  },

  update: async ({ resource, id, variables }) => {
    if (resource === 'contacts') {
      const res = await fetchApi(`${API_URL}/contacts`, {
        method: 'PATCH',
        body: JSON.stringify(variables),
      });
      const data = await res.json();
      return { data: { ...data, id: data.id ?? 'contact' } };
    }

    const slugResources = ['holiday-rentals', 'your-future-home', 'blog-posts'];
    const identifier = slugResources.includes(resource) ? id : id;
    const res = await fetchApi(`${API_URL}/${resource}/${identifier}`, {
      method: 'PATCH',
      body: JSON.stringify(variables),
    });
    const data = await res.json();

    const normalized = slugResources.includes(resource)
      ? { ...data, id: data.slug ?? data.id }
      : data;

    return { data: normalized };
  },

  deleteOne: async ({ resource, id }) => {
    const slugResources = ['holiday-rentals', 'your-future-home', 'blog-posts'];
    const identifier = slugResources.includes(resource) ? id : id;
    await fetchApi(`${API_URL}/${resource}/${identifier}`, {
      method: 'DELETE',
    });
    return { data: { id } };
  },

  getApiUrl: () => API_URL,
};
