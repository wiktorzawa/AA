import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_VALUES } from "@/constants";

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: DEFAULT_VALUES.SIDEBAR_OPEN,

      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      openSidebar: () => set({ isSidebarOpen: true }),

      closeSidebar: () => set({ isSidebarOpen: false }),
    }),
    {
      name: "ui-store",
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
      }),
    },
  ),
);
