import { useAuthStore } from "@/stores/authStore";
import strapiAdapter from "./strapiAdapter";
import type { User } from "@/stores/authStore";

// Interfejs dla danych uwierzytelniających
export interface DaneLogowania {
  identifier: string; // email w Strapi
  password: string;
}

// Interfejs dla błędu API
export interface ApiError {
  message: string;
  details?: unknown;
}

// Interfejs dla odpowiedzi z logowania - teraz używa typu User z authStore
export interface OdpowiedzLogowania {
  success: boolean;
  jwt?: string;
  user?: User;
  error?: string | ApiError;
}

/**
 * Loguje użytkownika do systemu
 * @param credentials Dane logowania (email jako identifier, password)
 * @returns Odpowiedź z informacją o sukcesie, roli użytkownika i tokenach
 */
export const zaloguj = async (
  credentials: DaneLogowania,
): Promise<OdpowiedzLogowania> => {
  try {
    // 1. Zaloguj się, aby uzyskać token JWT
    const loginResponse = await strapiAdapter.post<
      DaneLogowania,
      { jwt: string; user: { id: number } } // Oczekujemy tylko podstawowych danych
    >("/auth/local", credentials);

    if (loginResponse.jwt) {
      // 2. Ustaw token w localStorage, aby następne żądanie było uwierzytelnione
      localStorage.setItem("token", loginResponse.jwt);

      // 3. Pobierz pełne dane użytkownika z zagnieżdżoną rolą
      // To zapytanie użyje tokenu, który właśnie zapisaliśmy
      const userWithRole = await strapiAdapter.get<User>(
        "/users/me?populate=role",
      );

      // 4. Sprawdź, czy otrzymaliśmy kompletne dane
      if (userWithRole?.id && userWithRole.role?.name) {
        let supplierId: string | undefined = undefined;

        // Jeśli rola to Dostawca, pobierz jego profil, aby uzyskać id_dostawcy
        if (
          userWithRole.role.name === "Supplier" ||
          userWithRole.role.name === "Dostawca"
        ) {
          try {
            // Adapter zwraca już tablicę obiektów, każdy z polem 'attributes'
            const suppliersResponse = await strapiAdapter.get<
              { id: number; attributes: any }[]
            >(`/suppliers?filters[user][id][$eq]=${userWithRole.id}`);

            // --- OSTATECZNY DEBUG ---
            console.log(
              "[Auth Debug] Raw response from /api/suppliers filter:",
              suppliersResponse,
            );

            if (suppliersResponse && suppliersResponse.length > 0) {
              // Bierzemy pierwszy pasujący profil dostawcy
              const supplierProfile = suppliersResponse[0];
              if (supplierProfile.attributes?.id_dostawcy) {
                supplierId = supplierProfile.attributes.id_dostawcy;
                userWithRole.supplierId = supplierId;
                console.log(
                  `[Auth Success] Found supplierId: ${supplierId} for user ${userWithRole.email}`,
                );
              } else {
                console.warn(
                  "[Auth Warn] Supplier profile found, but no id_dostawcy attribute.",
                  { profile: supplierProfile },
                );
              }
            } else {
              console.warn(
                `[Auth Warn] User role is Supplier, but no linked profile found in /api/suppliers.`,
              );
            }
          } catch (e) {
            console.error("[Auth Error] Failed to fetch supplier profile:", e);
            // Nie blokuj logowania, jeśli profilu nie da się pobrać, ale zaloguj błąd
          }
        }

        // 5. Zaktualizuj stan w authStore i zwróć sukces
        useAuthStore.getState().login({
          user: userWithRole,
          token: loginResponse.jwt,
          supplierId: supplierId,
        });

        return {
          success: true,
          jwt: loginResponse.jwt,
          user: userWithRole,
        };
      }
    }

    // Jeśli którykolwiek krok zawiódł, zwróć błąd
    return {
      success: false,
      error: "Błąd logowania - nieprawidłowa odpowiedź serwera lub brak roli.",
    };
  } catch (error: unknown) {
    console.error("🚨 Login error:", error);
    // Usuń token, jeśli logowanie się nie powiodło, aby uniknąć niespójności
    localStorage.removeItem("token");
    const apiError = error as {
      response?: { data?: { error?: { message: string; details: unknown } } };
    };
    const strapiError = apiError.response?.data?.error;

    return {
      success: false,
      error: {
        message: strapiError?.message || "Wystąpił nieznany błąd logowania.",
        details: strapiError?.details,
      },
    };
  }
};

/**
 * Weryfikuje token dostępu i pobiera dane użytkownika
 * @returns Dane użytkownika lub błąd
 */
export const weryfikujToken = async (): Promise<{
  success: boolean;
  user?: User;
  error?: string;
}> => {
  try {
    const userWithRole = await strapiAdapter.get<User>(
      "/users/me?populate=role",
    );

    if (userWithRole && userWithRole.id) {
      return {
        success: true,
        user: userWithRole,
      };
    }

    return {
      success: false,
      error: "Nie udało się zweryfikować tokenu",
    };
  } catch (error) {
    const apiError = error as { error?: string };
    return {
      success: false,
      error: apiError?.error || "Błąd podczas weryfikacji tokenu",
    };
  }
};

/**
 * Wylogowuje użytkownika z systemu
 * @returns Odpowiedź o sukcesie wylogowania
 */
export const wyloguj = async (): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> => {
  try {
    // Strapi nie ma dedykowanego endpointa do wylogowania
    // Usuwamy token z localStorage
    localStorage.removeItem("token");

    return {
      success: true,
      message: "Pomyślnie wylogowano",
    };
  } catch (error) {
    return {
      success: false,
      error: "Błąd podczas wylogowania",
    };
  }
};

/**
 * Pobiera profil użytkownika
 * @returns Dane profilu użytkownika
 */
export const pobierzProfilUzytkownika = async () => {
  try {
    const user = await strapiAdapter.get<User>("/users/me?populate=role");
    return {
      success: true,
      user: user,
    };
  } catch (error) {
    const apiError = error as { error?: string };
    return {
      success: false,
      error: apiError?.error || "Błąd podczas pobierania profilu użytkownika",
    };
  }
};

// Funkcje pomocnicze dla kompatybilności wstecznej
export const odswiezToken = async () => {
  // Strapi używa JWT które nie wymaga odświeżania w standardowej konfiguracji
  // Możemy zwrócić obecny token
  const token = localStorage.getItem("token");
  if (token) {
    return {
      success: true,
      token,
      jwt: token,
    };
  }

  return {
    success: false,
    error: "Brak tokenu do odświeżenia",
  };
};
