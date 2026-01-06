// src/lib/ui-store.ts
import { Store } from "@tanstack/react-store";

type Theme = "light" | "dark";
type ViewMode = "grid" | "list"; // Define the type
// Keys for localStorage
const THEME_KEY = "ui-theme";
const VIEW_MODE_KEY_CATEGORY = "ui-category-view";
const VIEW_MODE_KEY_ORDER = "ui-order-view";
const VIEW_MODE_KEY_CART = "ui-cart-view";

// Add default state
export const uiStore = new Store({
  sidebarOpen: false,
  theme: "dark" as Theme,
  categoryViewMode: "grid" as ViewMode,
  orderViewMode: "grid" as ViewMode,
  cartViewMode: "grid" as ViewMode,
});

export const uiActions = {
  setTheme(theme: Theme) {
    uiStore.setState((s) => ({ ...s, theme }));
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_KEY, theme);
    }
  },

  // categories
  setCategoryViewMode(mode: ViewMode) {
    uiStore.setState((s) => ({ ...s, categoryViewMode: mode }));
    if (typeof window !== "undefined") {
      localStorage.setItem(VIEW_MODE_KEY_CATEGORY, mode);
    }
  },

  // orders
  setOrderViewMode(mode: ViewMode) {
    uiStore.setState((s) => ({ ...s, orderViewMode: mode }));
    if (typeof window !== "undefined") {
      localStorage.setItem(VIEW_MODE_KEY_ORDER, mode);
    }
  },

  // orders
  setCartViewMode(mode: ViewMode) {
    uiStore.setState((s) => ({ ...s, cartViewMode: mode }));
    if (typeof window !== "undefined") {
      localStorage.setItem(VIEW_MODE_KEY_CART, mode);
    }
  },

  hydrateTheme() {
    if (typeof window !== "undefined") {
      // Hydrate Theme
      const storedTheme = localStorage.getItem(THEME_KEY) as Theme;
      if (storedTheme === "light" || storedTheme === "dark") {
        uiStore.setState((s) => ({ ...s, theme: storedTheme }));
      }

      // Hydrate Categories View Mode
      const storedCategoryView = localStorage.getItem(
        VIEW_MODE_KEY_CATEGORY,
      ) as ViewMode;
      if (storedCategoryView === "grid" || storedCategoryView === "list") {
        uiStore.setState((s) => ({
          ...s,
          categoryViewMode: storedCategoryView,
        }));
      }

      // Hydrate Orders View Mode
      const storedOrderView = localStorage.getItem(
        VIEW_MODE_KEY_ORDER,
      ) as ViewMode;
      if (storedOrderView === "grid" || storedOrderView === "list") {
        uiStore.setState((s) => ({
          ...s,
          orderViewMode: storedOrderView,
        }));
      }

      // Hydrate Cart View Mode
      const storedCartView = localStorage.getItem(
        VIEW_MODE_KEY_CART,
      ) as ViewMode;
      if (storedCartView === "grid" || storedCartView === "list") {
        uiStore.setState((s) => ({
          ...s,
          cartViewMode: storedCartView,
        }));
      }
    }
  },

  setSidebar(isOpen: boolean) {
    uiStore.setState((s) => ({ ...s, sidebarOpen: isOpen }));
  },
};
