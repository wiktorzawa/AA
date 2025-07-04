import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDeliveries,
  uploadDeliveryFile,
  type DeliveryUploadRequest,
} from "@/api/deliveryApi";
import { QUERY_KEYS } from "@/constants";
import { logger } from "@/utils/logger";

/**
 * Hook do pobierania listy dostaw
 */
export const useDeliveries = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DELIVERIES,
    queryFn: getDeliveries,
  });
};

/**
 * Hook do uploadu nowej dostawy z automatycznym invalidation
 */
export const useUploadDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeliveryUploadRequest) => uploadDeliveryFile(data),
    onSuccess: (result) => {
      logger.info("Delivery upload successful", { result });

      // Invalidate i refetch lista dostaw
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DELIVERIES,
      });

      // Opcjonalnie można dodać optimistic update
      // queryClient.setQueryData(QUERY_KEYS.DELIVERIES, (old: any) => ({
      //   ...old,
      //   data: [result.data, ...(old?.data || [])]
      // }));
    },
    onError: (error) => {
      logger.error("Delivery upload failed", { error });
    },
  });
};
