import { create } from "zustand";
import { persist } from "zustand/middleware";

// Definicja interfejsu User (skopiowana z AuthContext)
export interface User {
  id_logowania: string;
  id_uzytkownika: string;
  adres_email: string;
  rola_uzytkownika: "admin" | "staff" | "supplier";
  id_dostawcy?: string;
}

// Interfejs stanu Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// Interfejs akcji Auth Store
interface AuthActions {
  login: (data: { user: User; token: string; refreshToken: string }) => void;
  logout: () => void;
  setTokens: (data: { token: string; refreshToken: string }) => void;
}

// Kombinacja stanu i akcji
type AuthStore = AuthState & AuthActions;

// Wartości początkowe stanu
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
};

// Tworzenie Auth Store z persist middleware
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Stan początkowy
      ...initialState,

      // Akcja login - ustawia dane użytkownika i tokeny
      login: (data) =>
        set({
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        }),

      // Akcja logout - resetuje stan do wartości początkowych
      logout: () => set(initialState),

      // Akcja setTokens - aktualizuje tylko tokeny
      setTokens: (data) =>
        set((state) => ({
          ...state,
          token: data.token,
          refreshToken: data.refreshToken,
        })),
    }),
    {
      name: "auth-storage",
      // Konfiguracja persist - utrwalamy wszystkie pola stanu
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      // Opcjonalne logowanie informacji o przywróceniu stanu
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("Auth store rehydrated:", {
            isAuthenticated: state.isAuthenticated,
            hasUser: !!state.user,
            hasToken: !!state.token,
          });
        }
      },
    },
  ),
);
