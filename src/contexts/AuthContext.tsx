import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { weryfikujToken, odswiezToken, wyloguj } from "@/api/authApi";

export interface User {
  id_logowania: string;
  id_uzytkownika: string;
  adres_email: string;
  rola_uzytkownika: "admin" | "staff" | "supplier";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, refreshToken: string, userData: User) => void;
  logout: () => Promise<void>;
  refreshUserToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (token: string, refreshToken: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("userRole", userData.rola_uzytkownika);
    localStorage.setItem("username", userData.adres_email);
    setUser(userData);
  };

  const logout = useCallback(async () => {
    const token = localStorage.getItem("token");

    // Wywołaj API wylogowania jeśli mamy token
    if (token) {
      try {
        await wyloguj(token);
        console.log("✅ Wylogowano z backendu pomyślnie");
      } catch (error) {
        console.error("❌ Błąd podczas wylogowania z backendu:", error);
        // Kontynuuj wylogowanie lokalnie nawet jeśli backend nie odpowiada
      }
    }

    // Zawsze wyczyść localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    setUser(null);
  }, []);

  const refreshUserToken = useCallback(async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await odswiezToken({ refresh_token: refreshToken });
      if (response.success && response.token && response.refresh_token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("refresh_token", response.refresh_token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  }, []);

  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await weryfikujToken(token);
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        // Spróbuj odświeżyć token
        const refreshSuccess = await refreshUserToken();
        if (refreshSuccess) {
          // Ponów weryfikację z nowym tokenem
          const newToken = localStorage.getItem("token");
          if (newToken) {
            const retryResponse = await weryfikujToken(newToken);
            if (retryResponse.success && retryResponse.user) {
              setUser(retryResponse.user);
            } else {
              logout();
            }
          }
        } else {
          logout();
        }
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [refreshUserToken, logout]);

  useEffect(() => {
    verifyToken();
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUserToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
