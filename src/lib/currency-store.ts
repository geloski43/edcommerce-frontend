import { Store } from "@tanstack/react-store";

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
  rate: number;
  isDefault: boolean;
  precision: number;
}

export interface CurrencyState {
  current: CurrencyConfig;
  available: Record<string, CurrencyConfig>;
  isLoading: boolean;
}

const INITIAL_FALLBACK: CurrencyConfig = {
  code: "PHP",
  symbol: "₱",
  label: "Philippine Peso",
  rate: 1,
  isDefault: true,
  precision: 2,
};

// Helper to get saved currency from previous sessions
const getSavedCurrencyCode = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("user-currency");
  }
  return null;
};

export const currencyStore = new Store<CurrencyState>({
  current: INITIAL_FALLBACK,
  available: { PHP: INITIAL_FALLBACK },
  isLoading: true,
});

export const currencyActions = {
  setAvailableCurrencies: (configs: CurrencyConfig[]) => {
    const newMap = configs.reduce(
      (acc, config) => {
        acc[config.code] = config;
        return acc;
      },
      {} as Record<string, CurrencyConfig>,
    );

    currencyStore.setState((state) => {
      const savedCode = getSavedCurrencyCode();
      const defaultFromStrapi =
        configs.find((c) => c.isDefault) || configs[0] || INITIAL_FALLBACK;

      // Logic to determine which currency to show:
      // 1. If it's the very first load, check LocalStorage, then Strapi Default.
      // 2. If it's a re-sync (navigation), keep the CURRENT selected state.
      let nextCurrency: CurrencyConfig;

      if (state.isLoading) {
        // First time loading data
        nextCurrency =
          savedCode && newMap[savedCode]
            ? newMap[savedCode]
            : defaultFromStrapi;
      } else {
        // We are navigating/re-syncing; preserve the user's current choice
        nextCurrency = newMap[state.current.code] || defaultFromStrapi;
      }

      return {
        ...state,
        available: newMap,
        current: nextCurrency,
        isLoading: false,
      };
    });
  },

  setCurrency: (code: string) => {
    currencyStore.setState((state) => {
      const selected = state.available[code];
      if (!selected) return state;

      // Save choice to localStorage so it persists across refreshes
      localStorage.setItem("user-currency", code);

      return {
        ...state,
        current: selected,
      };
    });
  },
};
