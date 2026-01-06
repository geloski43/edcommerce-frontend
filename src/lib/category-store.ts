import { Store } from "@tanstack/react-store";

// 1. Define the Shape of a SubCategory
export interface SubCategory {
  subCategoryId: string;
  name: string;
}

// 2. Updated Shape of a Category to include subcategories
export interface Category {
  name: string;
  description: string;
  categoryId: string;
  subs: SubCategory[]; // The linked subcategories array
}

// 3. Define the Store State
export interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  lastUpdated: number | null;
}

// 4. Initialize the Store
export const categoryStore = new Store<CategoryState>({
  categories: [],
  isLoading: false,
  lastUpdated: null,
});

// 5. Create Actions
export const categoryActions = {
  // Set the entire array (including nested subs)
  setCategories: (categories: Category[]) => {
    categoryStore.setState((state) => ({
      ...state,
      categories,
      lastUpdated: Date.now(),
    }));
  },

  // Add a single category with its subs
  addCategory: (newCategory: Category) => {
    categoryStore.setState((state) => {
      const exists = state.categories.some(
        (c) => c.categoryId === newCategory.categoryId,
      );
      if (exists) return state;

      return {
        ...state,
        categories: [...state.categories, newCategory],
      };
    });
  },

  // Update a specific category or its subs array
  updateCategory: (categoryId: string, updates: Partial<Category>) => {
    categoryStore.setState((state) => ({
      ...state,
      categories: state.categories.map((c) =>
        c.categoryId === categoryId ? { ...c, ...updates } : c,
      ),
    }));
  },

  // Clear all data
  resetStore: () => {
    categoryStore.setState(() => ({
      categories: [],
      isLoading: false,
      lastUpdated: null,
    }));
  },

  // Toggle loading state
  setLoading: (isLoading: boolean) => {
    categoryStore.setState((state) => ({ ...state, isLoading }));
  },
};
