import { useAuthStore } from "@/stores/authStore";
import strapiAdapter from "./strapiAdapter";
import type { StrapiUser, AppRole, UserProfile } from "@/stores/authStore";
import type { Staff } from "@/types/staff.types";
import type { Supplier } from "@/types/supplier.types";

export interface DaneLogowania {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  details?: unknown;
}

export interface OdpowiedzLogowania {
  success: boolean;
  jwt?: string;
  user?: StrapiUser;
  appRole?: AppRole;
  profile?: UserProfile;
  error?: string | ApiError;
}

// Interfejs dla użytkownika z relacjami z /users/me
interface UserWithProfile extends StrapiUser {
  staff_profile?: Staff;
  supplier_profile?: Supplier;
}

function determineAppRole(userWithProfile: UserWithProfile): AppRole {
  console.log("🎯 DETERMINING APP ROLE:", {
    hasStaffProfile: !!userWithProfile.staff_profile,
    hasSupplierProfile: !!userWithProfile.supplier_profile,
    staffPosition: userWithProfile.staff_profile?.position || "N/A",
  });

  // 1. Jeśli ma profil Staff - sprawdź position
  if (userWithProfile.staff_profile && userWithProfile.staff_profile.position) {
    const position = userWithProfile.staff_profile.position.toLowerCase();
    if (position === "admin") {
      console.log("✅ ROLE: admin (from staff.position)");
      return "admin";
    } else if (position === "staff") {
      console.log("✅ ROLE: staff (from staff.position)");
      return "staff";
    } else {
      console.warn("⚠️ Unknown staff position:", position);
      throw new Error(`Nieznana rola w polu position: ${position}`);
    }
  }

  // 2. Jeśli ma profil Supplier - zawsze supplier
  if (userWithProfile.supplier_profile) {
    console.log("✅ ROLE: supplier (from supplier profile)");
    return "supplier";
  }

  // 3. Jeśli nic nie znaleziono
  throw new Error(
    "Nie można określić roli użytkownika - brak profilu staff lub supplier",
  );
}

function getActiveProfile(userWithProfile: UserWithProfile): UserProfile {
  if (userWithProfile.staff_profile) {
    console.log("📋 ACTIVE PROFILE: staff");
    return userWithProfile.staff_profile;
  }
  if (userWithProfile.supplier_profile) {
    console.log("📋 ACTIVE PROFILE: supplier");
    return userWithProfile.supplier_profile;
  }
  throw new Error("Brak aktywnego profilu użytkownika");
}

export const zaloguj = async (
  credentials: DaneLogowania,
): Promise<OdpowiedzLogowania> => {
  try {
    console.log("🚀 ROZPOCZĘCIE LOGOWANIA:", credentials.email);

    // 1. Uwierzytelnienie użytkownika
    const loginPayload = {
      identifier: credentials.email,
      password: credentials.password,
    };

    const loginResponse = await strapiAdapter.post<
      typeof loginPayload,
      { jwt: string; user: StrapiUser }
    >("/auth/local", loginPayload);

    if (!loginResponse.jwt || !loginResponse.user) {
      throw new Error("Brak tokenu JWT lub danych użytkownika w odpowiedzi.");
    }

    const { jwt, user } = loginResponse;
    localStorage.setItem("token", jwt);
    console.log("✅ TOKEN ZAPISANY, pobieranie profilu użytkownika...");

    // 2. Pobierz użytkownika z relacjami (JEDEN REQUEST!)
    console.log("🔍 Pobieranie /users/me?populate=*...");
    const userWithProfile = await strapiAdapter.get<UserWithProfile>(
      "/users/me?populate=*",
    );

    console.log("📊 USER PROFILE SUMMARY:", {
      email: userWithProfile.email,
      hasStaffProfile: !!userWithProfile.staff_profile,
      hasSupplierProfile: !!userWithProfile.supplier_profile,
      staffPosition: userWithProfile.staff_profile?.position || "N/A",
      supplierCompany: userWithProfile.supplier_profile?.companyName || "N/A",
    });

    // 3. Określ rolę aplikacji na podstawie profilu
    const appRole = determineAppRole(userWithProfile);
    const profile = getActiveProfile(userWithProfile);

    // 4. Zapisz stan uwierzytelnienia
    useAuthStore.getState().login({ user, token: jwt, appRole, profile });

    console.log("🎉 LOGOWANIE ZAKOŃCZONE SUKCESEM:", {
      email: user.email,
      appRole,
      profileType: userWithProfile.staff_profile ? "staff" : "supplier",
    });

    return { success: true, jwt, user, appRole, profile };
  } catch (error) {
    console.error("🚨 BŁĄD LOGOWANIA:", error);
    localStorage.removeItem("token");

    const apiError = error as {
      response?: { data?: { error?: { message: string; details: unknown } } };
      message?: string;
    };
    const strapiError = apiError.response?.data?.error;

    return {
      success: false,
      error: {
        message:
          strapiError?.message ||
          apiError.message ||
          "Wystąpił nieznany błąd logowania.",
        details: strapiError?.details,
      },
    };
  }
};

export const wyloguj = async (): Promise<{ success: boolean }> => {
  localStorage.removeItem("token");
  useAuthStore.getState().logout();
  return { success: true };
};

export const pobierzProfilUzytkownika = async (): Promise<{
  success: boolean;
  user?: StrapiUser;
  error?: string;
}> => {
  try {
    const user = await strapiAdapter.get<StrapiUser>("/users/me?populate=role");
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
