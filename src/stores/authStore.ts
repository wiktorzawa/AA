import { create } from "zustand";
import { persist } from "zustand/middleware";

// Standardowy interfejs roli ze Strapi
export interface UserRole {
  id: number;
  name: string;
  description: string;
  type: string;
}

// Nowy, ujednolicony interfejs Użytkownika, zgodny ze Strapi
export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  supplierId?: string; // Dodajemy opcjonalne pole dla dostawców
}

// Interfejs stanu Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  supplierId: string | null; // Dodajemy pole na ID dostawcy
}

// Interfejs akcji Auth Store
interface AuthActions {
  login: (data: { user: User; token: string; supplierId?: string }) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

// Kombinacja stanu i akcji
type AuthStore = AuthState & AuthActions;

// Wartości początkowe stanu
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  supplierId: null, // Stan początkowy dla ID dostawcy
};

// Tworzenie Auth Store z persist middleware
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Stan początkowy
      ...initialState,

      // Akcja login - ustawia dane użytkownika i token
      login: (data) =>
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          supplierId: data.supplierId ?? null,
        }),

      // Akcja logout - resetuje stan do wartości początkowych
      logout: () => {
        console.log("Logging out and clearing auth state.");
        set(initialState);
      },

      // Akcja setUser - aktualizuje tylko dane użytkownika
      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),
    }),
    {
      name: "auth-storage",
      // Konfiguracja persist - utrwalamy wszystkie pola stanu
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        supplierId: state.supplierId, // Utrwalamy ID dostawcy
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("Auth store rehydrated:", {
            isAuthenticated: state.isAuthenticated,
            hasUser: !!state.user,
            hasToken: !!state.token,
            supplierId: state.supplierId,
          });
        }
      },
    },
  ),
);
