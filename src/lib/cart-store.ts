import { Store } from "@tanstack/react-store";
import { Product } from "./product-store";

// 1. Define a CartItem (Product + Quantity)
export interface CartItem extends Product {
  quantity: number;
}

// 2. Define the Store State
export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// 3. Initialize the Store
export const cartStore = new Store<CartState>({
  items: [],
  isOpen: false,
});

// 4. Create Actions
export const cartActions = {
  // Add item to cart with Digital Product check
  addItem: (product: Product) => {
    cartStore.setState((state) => {
      const existingItem = state.items.find(
        (item) => item.productId === product.productId,
      );

      if (existingItem) {
        // RULE: If product is digital, do NOT allow incrementing beyond 1
        if (product.isDigital) return state;

        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === product.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      // If new, add to array with quantity 1
      return {
        ...state,
        items: [...state.items, { ...product, quantity: 1 }],
      };
    });
  },

  // Remove item completely
  removeItem: (productId: string) => {
    cartStore.setState((state) => ({
      ...state,
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },

  // Update quantity specifically with Digital Product check
  updateQuantity: (productId: string, amount: number) => {
    cartStore.setState((state) => ({
      ...state,
      items: state.items
        .map((item) => {
          if (item.productId === productId) {
            // RULE: If digital and trying to increase (amount > 0), prevent it
            if (item.isDigital && amount > 0) return item;

            return {
              ...item,
              quantity: Math.max(0, item.quantity + amount),
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0), // Remove if quantity hits 0
    }));
  },

  // Toggle Cart UI
  setIsOpen: (isOpen: boolean) => {
    cartStore.setState((state) => ({ ...state, isOpen }));
  },

  // Clear Cart
  clearCart: () => {
    cartStore.setState((state) => ({
      ...state,
      items: [],
    }));
  },
};
