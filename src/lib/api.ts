const API_BASE = {
  auth: 'https://functions.poehali.dev/cccbb107-18cc-46d3-bd75-3d7584c6f3e4',
  works: 'https://functions.poehali.dev/30d23050-a7fc-4a19-8116-21341e1de8c0',
};

export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Work {
  id: number;
  title: string;
  description: string;
  category: 'vectors' | 'photos' | 'icons' | 'psd' | 'ai' | 'templates';
  image_url: string;
  file_urls: string[];
  license: 'free' | 'personal' | 'commercial';
  tags: string[];
  author_id: number;
  author_name: string;
  author_avatar?: string;
  status: 'pending' | 'approved' | 'rejected';
  likes: number;
  downloads: number;
  created_at: string;
}

export const api = {
  auth: {
    register: async (email: string, name: string): Promise<User> => {
      const response = await fetch(API_BASE.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', email, name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      return data.user;
    },

    login: async (email: string): Promise<User> => {
      const response = await fetch(API_BASE.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      return data.user;
    },

    updateProfile: async (userId: number, updates: Partial<User>): Promise<User> => {
      const response = await fetch(API_BASE.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_profile', user_id: userId, ...updates }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Update failed');
      return data.user;
    },
  },

  works: {
    getAll: async (filters?: { status?: string; category?: string; author_id?: number }): Promise<Work[]> => {
      const params = new URLSearchParams();
      if (filters?.status) params.set('status', filters.status);
      if (filters?.category) params.set('category', filters.category);
      if (filters?.author_id) params.set('author_id', filters.author_id.toString());

      const response = await fetch(`${API_BASE.works}?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch works');
      return data.works;
    },

    create: async (work: {
      title: string;
      description: string;
      category: string;
      license: string;
      tags: string[];
      author_id: number;
      author_role: string;
      image_base64: string;
    }): Promise<Work> => {
      const response = await fetch(API_BASE.works, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(work),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create work');
      return data.work;
    },

    update: async (workId: number, updates: { status?: string }): Promise<Work> => {
      const response = await fetch(API_BASE.works, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ work_id: workId, ...updates }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update work');
      return data.work;
    },

    delete: async (workId: number): Promise<void> => {
      const response = await fetch(`${API_BASE.works}?id=${workId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete work');
      }
    },
  },
};
