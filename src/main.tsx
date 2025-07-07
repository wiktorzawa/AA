import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { AxiosError } from "axios";

import App from "./App.tsx";
import "./index.css";

// Utwórz instancję QueryClient z prawidłową konfiguracją
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minut - dane "świeże" przez 5 minut
      gcTime: 1000 * 60 * 30, // 30 minut - cache garbage collection (v5 nazwa)
      retry: (failureCount, error) => {
        if (failureCount > 2) return false;

        if (error instanceof AxiosError) {
          const status = error.response?.status;
          if (status === 404 || status === 401 || status === 403) {
            return false;
          }
        }

        return true;
      },
      refetchOnWindowFocus: false, // Nie refetch przy focusie okna
      refetchOnReconnect: true, // Refetch przy ponownym połączeniu
    },
    mutations: {
      retry: 0, // Mutations nie powinny się retry automatycznie
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="bottom-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
