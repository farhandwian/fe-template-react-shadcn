import { StateCreator, create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Auth {
  refreshToken: string;
  accessToken: string;
}

interface AuthState {
  auth: Auth | null;
  setCredentials: (auth: Auth) => void;
  removeCredentials: () => void;
}

const authStoreSlice: StateCreator<AuthState> = (set) => ({
  auth: null,
  setCredentials: (auth) => set({ auth }),
  removeCredentials: () => set({ auth: null }),
});

const persistedAuthStore = persist<AuthState>(authStoreSlice, {
  name: "auth",
  storage: createJSONStorage(() => sessionStorage),
});

export const useAuthStore = create(persistedAuthStore);
