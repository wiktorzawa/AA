import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Supplier } from "@/types/supplier.types";
import type { Staff } from "@/types/staff.types"; // Corrected import path if it exists

// This is the basic User object returned by Strapi's /users/me endpoint
export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  // The 'role' from users-permissions plugin is not needed for our logic, but we can keep it
  role: {
    id: number;
    name: string;
    description: string;
    type: string;
  };
}

// Our custom application role
export type AppRole = "admin" | "staff" | "supplier";

// The profile can be either Staff or Supplier
export type UserProfile = Staff | Supplier;

// Interfejs stanu Auth Store
interface AuthState {
  user: StrapiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  appRole: AppRole | null;
  profile: UserProfile | null;
}

// Interfejs akcji Auth Store
interface AuthActions {
  login: (data: {
    user: StrapiUser;
    token: string;
    appRole: AppRole;
    profile: UserProfile;
  }) => void;
  logout: () => void;
  setUser: (user: StrapiUser) => void;
}

// Kombinacja stanu i akcji
type AuthStore = AuthState & AuthActions;

// Wartości początkowe stanu
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  appRole: null,
  profile: null,
};

// Tworzenie Auth Store z persist middleware
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      login: (data) =>
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          appRole: data.appRole,
          profile: data.profile,
        }),

      logout: () => {
        console.log("Logging out and clearing auth state.");
        set(initialState);
      },

      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        appRole: state.appRole,
        profile: state.profile,
      }),
    },
  ),
);
