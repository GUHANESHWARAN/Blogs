const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` : '/api');

function getAuthHeaders() {
  const token = localStorage.getItem('techblog_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  getPosts: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const res = await fetch(`${API_BASE}/posts?${query.toString()}`);
    return handleResponse(res);
  },

  getFeaturedPosts: async () => {
    const res = await fetch(`${API_BASE}/posts/featured`);
    return handleResponse(res);
  },

  getTrendingPosts: async () => {
    const res = await fetch(`${API_BASE}/posts/trending`);
    return handleResponse(res);
  },

  getPostBySlug: async (slug) => {
    const res = await fetch(`${API_BASE}/posts/slug/${slug}`);
    return handleResponse(res);
  },

  getPostById: async (id) => {
    const res = await fetch(`${API_BASE}/posts/${id}`);
    return handleResponse(res);
  },

  createPost: async (postData) => {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(postData)
    });
    return handleResponse(res);
  },

  updatePost: async (id, postData) => {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(postData)
    });
    return handleResponse(res);
  },

  deletePost: async (id) => {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  togglePublish: async (id) => {
    const res = await fetch(`${API_BASE}/posts/${id}/toggle-publish`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/posts/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    return handleResponse(res);
  },

  getCategories: async () => {
    const res = await fetch(`${API_BASE}/categories`);
    return handleResponse(res);
  },

  createCategory: async (categoryData) => {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(categoryData)
    });
    return handleResponse(res);
  },

  updateCategory: async (id, categoryData) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(categoryData)
    });
    return handleResponse(res);
  },

  deleteCategory: async (id) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getAuthors: async () => {
    const res = await fetch(`${API_BASE}/authors`);
    return handleResponse(res);
  },

  createAuthor: async (authorData) => {
    const res = await fetch(`${API_BASE}/authors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(authorData)
    });
    return handleResponse(res);
  },

  updateAuthor: async (id, authorData) => {
    const res = await fetch(`${API_BASE}/authors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(authorData)
    });
    return handleResponse(res);
  },

  deleteAuthor: async (id) => {
    const res = await fetch(`${API_BASE}/authors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getStats: async () => {
    const res = await fetch(`${API_BASE}/stats`);
    return handleResponse(res);
  },

  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
