import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  bio?: string;
  createdAt: string;
}

export interface DesignWork {
  id: string;
  title: string;
  description: string;
  category: 'vectors' | 'photos' | 'icons' | 'psd' | 'ai' | 'templates';
  image: string;
  files: string[];
  license: 'free' | 'personal' | 'commercial';
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  likes: number;
  downloads: number;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AppState {
  user: User | null;
  works: DesignWork[];
  favorites: string[];
  setUser: (user: User | null) => void;
  addWork: (work: DesignWork) => void;
  updateWork: (id: string, updates: Partial<DesignWork>) => void;
  deleteWork: (id: string) => void;
  toggleFavorite: (workId: string) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      works: [],
      favorites: [],
      
      setUser: (user) => set({ user }),
      
      addWork: (work) => set((state) => ({ 
        works: [...state.works, work] 
      })),
      
      updateWork: (id, updates) => set((state) => ({
        works: state.works.map(work => 
          work.id === id ? { ...work, ...updates } : work
        )
      })),
      
      deleteWork: (id) => set((state) => ({
        works: state.works.filter(work => work.id !== id)
      })),
      
      toggleFavorite: (workId) => set((state) => ({
        favorites: state.favorites.includes(workId)
          ? state.favorites.filter(id => id !== workId)
          : [...state.favorites, workId]
      })),
      
      logout: () => set({ user: null }),
    }),
    {
      name: 'zi-design-storage',
    }
  )
);
