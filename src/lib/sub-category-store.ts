import { Store } from "@tanstack/react-store";

// 1. Define the Shape of a SubCategory
export interface SubCategory {
  name: string;
  description: string;
  subCategoryId: string;
}

// 2. Define the Store State
export interface SubCategoryState {
  subCategories: SubCategory[];
  isLoading: boolean;
  lastUpdated: number | null;
}

// 3. Initialize the Store
export const subCategoryStore = new Store<SubCategoryState>({
  subCategories: [],
  isLoading: false,
  lastUpdated: null,
});

// 4. Create Actions
export const subCategoryActions = {
  // Set the entire array (useful after a fresh fetch)
  setSubCategories: (subCategories: SubCategory[]) => {
    subCategoryStore.setState((state) => ({
      ...state,
      subCategories,
      lastUpdated: Date.now(),
    }));
  },

  // Add a single sub-category (preventing duplicates by subCategoryId)
  addCategory: (newSubCategory: SubCategory) => {
    subCategoryStore.setState((state) => {
      const exists = state.subCategories.some(
        (c) => c.subCategoryId === newSubCategory.subCategoryId,
      );
      if (exists) return state;

      return {
        ...state,
        subCategories: [...state.subCategories, newSubCategory],
      };
    });
  },

  // Update a specific sub-category by its ID
  updateCategory: (subCategoryId: string, updates: Partial<SubCategory>) => {
    subCategoryStore.setState((state) => ({
      ...state,
      subCategories: state.subCategories.map((c) =>
        c.subCategoryId === subCategoryId ? { ...c, ...updates } : c,
      ),
    }));
  },

  // Clear all data
  resetStore: () => {
    subCategoryStore.setState(() => ({
      subCategories: [],
      isLoading: false,
      lastUpdated: null,
    }));
  },

  // Toggle loading state
  setLoading: (isLoading: boolean) => {
    subCategoryStore.setState((state) => ({ ...state, isLoading }));
  },
};
