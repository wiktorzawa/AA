import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  pobierzDostawcow,
  pobierzDostawce,
  dodajDostawceZHaslem,
  aktualizujDostawce,
  usunDostawce,
  type NowyDostawcaBezId,
  type AktualizacjaDostawcy,
} from "@/api/supplierApi";
import { QUERY_KEYS } from "@/constants";
import { logger } from "@/utils/logger";

/**
 * Hook do pobierania wszystkich dostawców
 */
export const useSuppliers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUPPLIERS,
    queryFn: pobierzDostawcow,
    staleTime: 1000 * 60 * 5, // 5 minut
  });
};

/**
 * Hook do pobierania konkretnego dostawcy
 */
export const useSupplier = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SUPPLIERS, id],
    queryFn: () => pobierzDostawce(id),
    enabled: !!id, // Tylko gdy mamy ID
    staleTime: 1000 * 60 * 5, // 5 minut
  });
};

/**
 * Hook do tworzenia nowego dostawcy
 */
export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (supplierData: NowyDostawcaBezId) =>
      dodajDostawceZHaslem(supplierData),
    onSuccess: (result) => {
      logger.info("Supplier created successfully", { result });

      // Invalidate lista dostawców
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUPPLIERS,
      });
    },
    onError: (error) => {
      logger.error("Failed to create supplier", { error });
    },
  });
};

/**
 * Hook do aktualizacji dostawcy
 */
export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AktualizacjaDostawcy }) =>
      aktualizujDostawce(id, data),
    onSuccess: (result, variables) => {
      logger.info("Supplier updated successfully", { result });

      // Invalidate lista dostawców i konkretny dostawca
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUPPLIERS,
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.SUPPLIERS, variables.id],
      });
    },
    onError: (error) => {
      logger.error("Failed to update supplier", { error });
    },
  });
};

/**
 * Hook do usuwania dostawcy
 */
export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usunDostawce(id),
    onSuccess: (result, id) => {
      logger.info("Supplier deleted successfully", { id });

      // Invalidate lista dostawców i usuń konkretny dostawca z cache
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUPPLIERS,
      });
      queryClient.removeQueries({
        queryKey: [...QUERY_KEYS.SUPPLIERS, id],
      });
    },
    onError: (error) => {
      logger.error("Failed to delete supplier", { error });
    },
  });
};
