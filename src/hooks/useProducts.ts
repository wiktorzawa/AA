import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/productsApi";
import { getProductsByDeliveryId } from "@/api/deliveryApi";
import { QUERY_KEYS } from "@/constants";

/**
 * Hook do pobierania produktów z paginacją i wyszukiwaniem
 */
export const useProducts = (searchTerm?: string, currentPage?: number) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.PRODUCTS,
      { searchTerm: searchTerm || "", currentPage: currentPage || 1 },
    ],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [
        string[],
        { searchTerm: string; currentPage: number },
      ];
      return getProducts({
        page: params.currentPage,
        searchTerm: params.searchTerm,
      });
    },
    placeholderData: (previousData) => previousData,
    retry: 1,
  });
};

/**
 * Hook do pobierania produktów dla konkretnej dostawy
 * @param deliveryId - ID dostawy
 * @param enabled - czy query ma być aktywny (np. tylko gdy rząd rozwinięty)
 */
export const useProductsByDelivery = (deliveryId: string, enabled: boolean) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.DELIVERIES, deliveryId, "products"],
    queryFn: () => getProductsByDeliveryId(deliveryId),
    enabled: !!deliveryId && enabled,
  });
};

/**
 * Hook do pobierania statystyk produktów
 */
export const useProductsStats = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS_STATS],
    queryFn: () => getProducts({ page: 1, limit: 1000 }), // Pobierz wszystkie dla statystyk
    staleTime: 1000 * 60 * 10,
  });
};
