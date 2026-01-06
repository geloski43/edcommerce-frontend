import { Store } from "@tanstack/react-store";

export interface Product {
  id: number;
  name: string;
  price: number;
  sub_category: string;
  productId: string;
  thumbnail: string;
  details: string;
  isDigital: boolean;
  hasPurchased?: boolean;
}

export interface ProductState {
  products: Product[];
  isLoading: boolean;
  lastUpdated: number | null;
}

export const productStore = new Store<ProductState>({
  products: [],
  isLoading: false,
  lastUpdated: null,
});

export const productActions = {
  setProducts: (products: Product[]) => {
    productStore.setState((state) => ({
      ...state,
      products,
      lastUpdated: Date.now(),
    }));
  },

  addProduct: (newProduct: Product) => {
    productStore.setState((state) => {
      const exists = state.products.some(
        (c) => c.productId === newProduct.productId,
      );
      if (exists) return state;

      return {
        ...state,
        products: [...state.products, newProduct],
      };
    });
  },

  // 2. FIXED: Reference 'products' instead of 'categories'
  updateProduct: (productId: string, updates: Partial<Product>) => {
    productStore.setState((state) => ({
      ...state,
      products: state.products.map((p) =>
        p.productId === productId ? { ...p, ...updates } : p,
      ),
    }));
  },

  resetStore: () => {
    productStore.setState(() => ({
      products: [],
      isLoading: false,
      lastUpdated: null,
    }));
  },

  setLoading: (isLoading: boolean) => {
    productStore.setState((state) => ({ ...state, isLoading }));
  },
};
