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

async function findStaffProfile(email: string): Promise<Staff | null> {
  try {
    const response = await strapiAdapter.get<{ data: any[] }>("/staffs", {
      populate: "*",
    });
    const lowercasedEmail = email.toLowerCase();
    console.log(
      "STAFF RESPONSE:",
      response.data,
      "SZUKANY EMAIL:",
      lowercasedEmail,
    );
    const profile = response.data?.find(
      (s) => s && s.email && s.email.toLowerCase() === lowercasedEmail,
    );
    return profile ?? null;
  } catch (error) {
    console.error("Błąd podczas wyszukiwania profilu pracownika:", error);
    return null;
  }
}

async function findSupplierProfile(email: string): Promise<Supplier | null> {
  try {
    const response = await strapiAdapter.get<{ data: Supplier[] }>(
      "/suppliers",
      {
        populate: "*",
      },
    );
    const lowercasedEmail = email.toLowerCase();
    console.log(
      "SUPPLIER RESPONSE:",
      response.data,
      "SZUKANY EMAIL:",
      lowercasedEmail,
    );
    const profile = response.data?.find(
      (s) => s && s.email && s.email.toLowerCase() === lowercasedEmail,
    );
    return profile ?? null;
  } catch (error) {
    console.error("Błąd podczas wyszukiwania profilu dostawcy:", error);
    return null;
  }
}

export const zaloguj = async (
  credentials: DaneLogowania,
): Promise<OdpowiedzLogowania> => {
  try {
    // Zamień email na identifier w payloadzie
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

    const staffProfile = await findStaffProfile(user.email);
    if (staffProfile && staffProfile.position) {
      const position = staffProfile.position.toLowerCase();
      let appRole: AppRole;
      if (position === "admin") {
        appRole = "admin";
      } else if (position === "staff") {
        appRole = "staff";
      } else {
        throw new Error(
          `Nieznana rola w polu position profilu staff: ${position}`,
        );
      }
      useAuthStore
        .getState()
        .login({ user, token: jwt, appRole, profile: staffProfile });
      return { success: true, jwt, user, appRole, profile: staffProfile };
    }

    const supplierProfile = await findSupplierProfile(user.email);
    if (supplierProfile) {
      const appRole = "supplier";
      useAuthStore
        .getState()
        .login({ user, token: jwt, appRole, profile: supplierProfile });
      return { success: true, jwt, user, appRole, profile: supplierProfile };
    }

    throw new Error("Nie znaleziono powiązanego profilu staff lub supplier.");
  } catch (error: unknown) {
    console.error("🚨 Login error:", error);
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
