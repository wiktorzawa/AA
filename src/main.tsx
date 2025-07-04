import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initThemeMode } from "flowbite-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App.tsx";
import "./index.css";

// Utwórz instancję QueryClient z prawidłową konfiguracją
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minut - dane "świeże" przez 5 minut
      gcTime: 1000 * 60 * 30, // 30 minut - cache garbage collection (v5 nazwa)
      retry: (failureCount, error: unknown) => {
        // Nie retry dla 404, 401, 403
        if (
          error?.response?.status === 404 ||
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          return false;
        }
        return failureCount < 2; // Maksymalnie 2 próby
      },
      refetchOnWindowFocus: false, // Nie refetch przy focusie okna
      refetchOnReconnect: true, // Refetch przy ponownym połączeniu
    },
    mutations: {
      retry: 0, // Mutations nie powinny się retry automatycznie
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);

initThemeMode();
