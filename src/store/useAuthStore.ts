import { create } from 'zustand';

interface AuthState {
  hydrated: boolean;
  userName: string | null;
  setUserName: (userName: string | null) => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  hydrated: false,
  userName: null,
  setUserName: (userName) => set({ userName }),
  setHydrated: (hydrated) => set({ hydrated }),
}));