import { create } from 'zustand';

export interface AuthUser {
  uid: string;
  email: string | null;
  googleDisplayName: string | null;
}

interface AuthState {
  initialized: boolean;
  user: AuthUser | null;
  profileName: string | null;
  setUser: (user: AuthUser | null) => void;
  setProfileName: (profileName: string | null) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  initialized: false,
  user: null,
  profileName: null,
  setUser: (user) => set({ user }),
  setProfileName: (profileName) => set({ profileName }),
  setInitialized: (initialized) => set({ initialized }),
}));