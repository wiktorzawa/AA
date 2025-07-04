import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/productsApi";
import { getProductsByDeliveryId } from "@/api/deliveryApi";
import { QUERY_KEYS } from "@/constants";

/**
 * Hook do pobierania produktów z paginacją i wyszukiwaniem
 */
export const useProducts = (searchTerm?: string, currentPage?: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, { searchTerm, currentPage }],
    queryFn: getProducts,
    // placeholderData zachowuje poprzednie dane podczas ładowania nowych
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2, // Produkty "świeże" przez 2 minuty
  });
};

/**
 * Hook do pobierania produktów dla konkretnej dostawy
 * @param deliveryId - ID dostawy
 * @param enabled - czy query ma być aktywny (np. tylko gdy rząd rozwinięty)
 */
export const useProductsByDelivery = (deliveryId: string, enabled = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, "delivery", deliveryId],
    queryFn: () => getProductsByDeliveryId(deliveryId),
    enabled: enabled && !!deliveryId, // Fetch tylko gdy enabled=true i mamy deliveryId
  });
};

/**
 * Hook do pobierania statystyk produktów
 */
export const useProductsStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS_STATS,
    queryFn: getProducts, // Zakładam że istnieje getProductsStats API
    staleTime: 1000 * 60 * 10, // Stats są "świeże" przez 10 minut
  });
};
