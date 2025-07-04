import axiosInstance from "./axios";
import { API_ENDPOINTS } from "../constants";
import type { Product } from "../types/product.types";
import { logger } from "../utils/logger";

// Interfejsy dla products API
export interface ProductsResponse {
  success: boolean;
  data: Product[];
}

export interface ProductsError {
  success: false;
  message: string;
  error?: string;
}

// Interfejs dla produktu z API dostawy
interface DeliveryProduct {
  id_produktu_dostawy: number;
  id_dostawy: string;
  nazwa_produktu: string;
  kategoria_produktu?: string;
  cena_produktu_spec?: number;
  ilosc: number;
  kod_ean?: string;
  kod_asin?: string;
  nr_palety?: string;
  status_weryfikacji: string;
}

// Interfejs dla dostawy z API
interface Delivery {
  id_dostawy: string;
  [key: string]: unknown; // Inne pola mogą istnieć
}

/**
 * Pobiera wszystkie produkty ze wszystkich dostaw
 * Ta funkcja pobiera najpierw dostawy, a następnie produkty dla każdej dostawy
 */
export const getProducts = async ({
  queryKey,
}: {
  queryKey: (string | number | { searchTerm?: string; currentPage?: number })[];
}): Promise<{
  products: Product[];
  pagination: { page: number; totalPages: number; totalItems: number };
}> => {
  const queryData = queryKey.find((item) => typeof item === "object") as
    | { searchTerm?: string; currentPage?: number }
    | undefined;
  const searchTerm = queryData?.searchTerm || "";
  const currentPage = queryData?.currentPage || 1;

  try {
    // Krok 1: Pobierz wszystkie dostawy
    const deliveriesResponse = await axiosInstance.get(
      `${API_ENDPOINTS.DELIVERIES.BASE}`,
      {
        params: {
          limit: 100, // Pobierz więcej dostaw żeby mieć więcej produktów
          page: 1,
        },
      },
    );

    if (
      !deliveriesResponse.data.success ||
      !Array.isArray(deliveriesResponse.data.data)
    ) {
      throw new Error("Failed to fetch deliveries");
    }

    const deliveries = deliveriesResponse.data.data;
    logger.info("Fetched deliveries for products", {
      count: deliveries.length,
    });

    // Krok 2: Pobierz produkty dla każdej dostawy
    const allProducts: Product[] = [];
    let productId = 1;

    // Pobierz produkty dla każdej dostawy (maksymalnie pierwszych 10 żeby nie przeciążyć)
    const deliveryPromises = deliveries
      .slice(0, 10)
      .map(async (delivery: Delivery) => {
        try {
          const productsResponse = await axiosInstance.get(
            `${API_ENDPOINTS.DELIVERIES.BASE}/${delivery.id_dostawy}/products`,
          );

          if (
            productsResponse.data.success &&
            Array.isArray(productsResponse.data.data)
          ) {
            return productsResponse.data.data as DeliveryProduct[];
          }
          return [];
        } catch (error) {
          logger.warn("Failed to fetch products for delivery", {
            deliveryId: delivery.id_dostawy,
            error,
          });
          return [];
        }
      });

    const deliveryProductsArrays = await Promise.all(deliveryPromises);

    // Krok 3: Przekształć produkty dostawy na produkty UI
    deliveryProductsArrays.forEach((deliveryProducts) => {
      deliveryProducts.forEach((product: DeliveryProduct) => {
        // Filtruj według wyszukiwania jeśli podano
        if (
          searchTerm &&
          !product.nazwa_produktu
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        ) {
          return;
        }

        allProducts.push({
          id: productId.toString(),
          name: product.nazwa_produktu || "Unknown Product",
          category: product.kategoria_produktu || "Unknown Category",
          brand: "Various", // Brak brand w modelu backend
          price: product.cena_produktu_spec || 0,
          stock: product.ilosc || 0,
          totalSales: Math.floor(Math.random() * 100), // Mock data - backend nie ma tych danych
          status: product.ilosc > 0 ? "In Stock" : "Out of Stock",
          image:
            "https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-front-image.png", // Default image
          details: `EAN: ${product.kod_ean || "N/A"}, ASIN: ${product.kod_asin || "N/A"}`,
        });
        productId++;
      });
    });

    // Krok 4: Implementuj prostą paginację (frontend-side)
    const itemsPerPage = 10;
    const totalItems = allProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);

    logger.info("Products fetched and paginated", {
      total: totalItems,
      page: currentPage,
      totalPages,
      returned: paginatedProducts.length,
    });

    return {
      products: paginatedProducts,
      pagination: {
        page: currentPage,
        totalPages,
        totalItems,
      },
    };
  } catch (error) {
    logger.error("Error fetching products", { error });
    throw new Error("Failed to fetch products");
  }
};

/**
 * Pobiera statystyki produktów ze wszystkich dostaw
 */
export const getProductsStats = async () => {
  try {
    // Wykorzystaj istniejącą funkcję getProducts
    const { products } = await getProducts({
      queryKey: ["products", { searchTerm: "", currentPage: 1 }],
    });

    return {
      totalProducts: products.length,
      newProducts: Math.floor(products.length * 0.15), // 15% produktów to "nowe"
      totalSales: products.reduce((sum, p) => sum + p.totalSales, 0),
      totalIncome: products.reduce((sum, p) => sum + p.price * p.totalSales, 0),
    };
  } catch (error) {
    logger.error("Error fetching product stats", { error });
    throw new Error("Failed to fetch product statistics");
  }
};
