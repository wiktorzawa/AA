import strapiAdapter from "./strapiAdapter";
import { logger } from "../utils/logger";
import type { ApiStaffStaff } from "@/types/strapi";
import type { StaffProfile as Staff } from "@/types/app.types";

export interface StaffWithPassword {
  staff: Staff;
  password: string;
}

interface StrapiStaffItem {
  id: number;
  attributes: ApiStaffStaff["attributes"];
}

const mapStrapiToAppFormat = (strapiData: StrapiStaffItem): Staff => {
  const {
    staffId,
    firstName,
    lastName,
    position,
    email,
    phone,
    hireDate,
    terminationDate,
  } = strapiData.attributes;

  return {
    id: strapiData.id,
    staffId,
    firstName,
    lastName,
    position,
    email,
    phone,
    hireDate,
    terminationDate,
  };
};

const mapAppToStrapiFormat = (appData: Partial<Omit<Staff, "id">>) => {
  const strapiData: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(appData)) {
    strapiData[key] = value;
  }
  return strapiData;
};

export const fetchStaffMembers = async (): Promise<Staff[]> => {
  try {
    const response = await strapiAdapter.get<{ data: StrapiStaffItem[] }>(
      "/staffs?populate=*",
    );
    return response.data ? response.data.map(mapStrapiToAppFormat) : [];
  } catch (error) {
    logger.error("Failed to get staff members", { error });
    throw error;
  }
};

export const fetchStaffMember = async (id: string): Promise<Staff> => {
  try {
    const response = await strapiAdapter.get<{ data: StrapiStaffItem }>(
      `/staffs/${id}?populate=*`,
    );
    if (response.data) {
      return mapStrapiToAppFormat(response.data);
    }
    throw new Error(`Staff member with ID ${id} not found`);
  } catch (error) {
    logger.error("Failed to get staff member", { id, error });
    throw error;
  }
};

export const addStaffWithPassword = async (
  staff: Omit<Staff, "id">,
): Promise<StaffWithPassword> => {
  const password = Math.random().toString(36).slice(-8) + "A1!";
  const payload = { data: mapAppToStrapiFormat(staff) };
  try {
    const response = await strapiAdapter.post<
      typeof payload,
      { data: StrapiStaffItem }
    >("/staffs", payload);

    if (!response.data) {
      throw new Error("Failed to create staff member, no data received.");
    }
    const createdStaff = mapStrapiToAppFormat(response.data);

    try {
      await strapiAdapter.post("/auth/local/register", {
        username: staff.email,
        email: staff.email,
        password: password,
        role: staff.position || "staff",
        staff_profile: createdStaff.id,
      });
    } catch (authError) {
      logger.warn("Failed to create auth user for staff member", { authError });
    }

    return {
      staff: createdStaff,
      password: password,
    };
  } catch (error) {
    logger.error("Failed to add staff member with password", { error });
    throw error;
  }
};

export const updateStaffMember = async (
  id: string,
  data: Partial<Omit<Staff, "id">>,
): Promise<Staff> => {
  const payload = { data: mapAppToStrapiFormat(data) };
  try {
    const response = await strapiAdapter.put<
      typeof payload,
      { data: StrapiStaffItem }
    >(`/staffs/${id}`, payload);

    if (response.data) {
      return mapStrapiToAppFormat(response.data);
    }
    throw new Error(
      `Failed to update staff member with ID ${id}, no data received.`,
    );
  } catch (error) {
    logger.error("Failed to update staff member", { id, error });
    throw error;
  }
};

export const deleteStaffMember = async (
  id: string,
): Promise<{ success: true }> => {
  try {
    await strapiAdapter.delete(`/staffs/${id}`);
    return { success: true };
  } catch (error) {
    logger.error("Failed to delete staff member", { id, error });
    throw error;
  }
};

// Aliasy eksportów dla polskich nazw używanych w hookach
export const pobierzPracownikow = fetchStaffMembers;
export const pobierzPracownika = fetchStaffMember;
export const dodajPracownikaZHaslem = addStaffWithPassword;
export const aktualizujPracownika = updateStaffMember;
export const usunPracownika = deleteStaffMember;

// Typy dla polskich nazw
export type NowyPracownikBezId = Omit<Staff, "id">;
export type AktualizacjaPracownika = Partial<Omit<Staff, "id">>;
