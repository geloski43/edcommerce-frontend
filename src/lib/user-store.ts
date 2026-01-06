import { Store } from "@tanstack/react-store";

export interface UserState {
  email: string | null;
  clerkId: string | null;
  purchasedIds: string[];
  blocked: boolean;
  isLoaded: boolean;
}

const INITIAL_STATE: UserState = {
  email: null,
  clerkId: null,
  purchasedIds: [],
  blocked: false,
  isLoaded: false,
};

// 1. Initialize the Store with clean state
export const userStore = new Store<UserState>(INITIAL_STATE);

// 2. Define Actions
export const userActions = {
  /**
   * Primary sync action used by AuthSync component
   */
  setUser: (data: {
    email: string;
    clerkId: string;
    blocked?: boolean;
    purchasedIds: string[];
  }) => {
    userStore.setState(() => ({
      email: data.email,
      clerkId: data.clerkId,
      blocked: data.blocked ?? false,
      purchasedIds: data.purchasedIds,
      isLoaded: true,
    }));
  },

  /**
   * Call this during logout or when auth session ends
   */
  clearUser: () => {
    userStore.setState(() => INITIAL_STATE);
  },

  /**
   * Simple toggle for admin/block logic
   */
  setBlocked: (blocked: boolean) => {
    userStore.setState((state) => ({ ...state, blocked }));
  },

  /**
   * Useful for immediate UI updates after a successful purchase
   * before the next background sync completes
   */
  addPurchase: (productId: string) => {
    userStore.setState((state) => {
      if (state.purchasedIds.includes(productId)) return state;
      return {
        ...state,
        purchasedIds: [...state.purchasedIds, productId],
      };
    });
  },
};
