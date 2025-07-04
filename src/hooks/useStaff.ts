import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  pobierzPracownikow,
  pobierzPracownika,
  dodajPracownikaZHaslem,
  aktualizujPracownika,
  usunPracownika,
  type NowyPracownikBezId,
  type AktualizacjaPracownika,
} from "@/api/staffApi";
import { QUERY_KEYS } from "@/constants";
import { logger } from "@/utils/logger";

/**
 * Hook do pobierania wszystkich pracowników
 */
export const useStaff = () => {
  return useQuery({
    queryKey: QUERY_KEYS.STAFF,
    queryFn: pobierzPracownikow,
    staleTime: 1000 * 60 * 5, // 5 minut
  });
};

/**
 * Hook do pobierania konkretnego pracownika
 */
export const useStaffMember = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.STAFF, id],
    queryFn: () => pobierzPracownika(id),
    enabled: !!id, // Tylko gdy mamy ID
    staleTime: 1000 * 60 * 5, // 5 minut
  });
};

/**
 * Hook do tworzenia nowego pracownika
 */
export const useCreateStaffMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffData: NowyPracownikBezId) =>
      dodajPracownikaZHaslem(staffData),
    onSuccess: (result) => {
      logger.info("Staff member created successfully", { result });

      // Invalidate lista pracowników
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.STAFF,
      });
    },
    onError: (error) => {
      logger.error("Failed to create staff member", { error });
    },
  });
};

/**
 * Hook do aktualizacji pracownika
 */
export const useUpdateStaffMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AktualizacjaPracownika }) =>
      aktualizujPracownika(id, data),
    onSuccess: (result, variables) => {
      logger.info("Staff member updated successfully", { result });

      // Invalidate lista pracowników i konkretny pracownik
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.STAFF,
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.STAFF, variables.id],
      });
    },
    onError: (error) => {
      logger.error("Failed to update staff member", { error });
    },
  });
};

/**
 * Hook do usuwania pracownika
 */
export const useDeleteStaffMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usunPracownika(id),
    onSuccess: (result, id) => {
      logger.info("Staff member deleted successfully", { id });

      // Invalidate lista pracowników i usuń konkretny pracownik z cache
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.STAFF,
      });
      queryClient.removeQueries({
        queryKey: [...QUERY_KEYS.STAFF, id],
      });
    },
    onError: (error) => {
      logger.error("Failed to delete staff member", { error });
    },
  });
};
