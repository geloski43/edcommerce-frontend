import { useEffect, useState } from "react";
import { subcategories, products, currencies } from "@/lib/strapiClient";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { subCategoryActions, subCategoryStore } from "@/lib/sub-category-store";
import { productActions, productStore } from "@/lib/product-store";
import { currencyActions, currencyStore } from "@/lib/currency-store";
import { userStore } from "@/lib/user-store";
import { uiStore, uiActions } from "@/lib/ui-store"; // Import UI Store
import { useStore } from "@tanstack/react-store";
import {
  ShoppingBag,
  Coins,
  Search,
  Loader2,
  LayoutGrid,
  List,
} from "lucide-react"; // Import Icons
import { CartBadge } from "@/components/CartBadge";
import GlobalLoader from "@/components/GlobalLoader";
import EmptyState from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { SubCategoryDropdown } from "@/components/SubCategoryDropdown";
import { z } from "zod";

const cartSearchSchema = z.object({
  subCategoryId: z.string().optional(),
});

export const Route = createFileRoute("/_authed/cart")({
  validateSearch: (search) => cartSearchSchema.parse(search),
  component: CartComponent,
  loader: async () => {
    try {
      const [catRes, prodRes, curRes] = await Promise.all([
        subcategories.find(),
        products.find({
          populate: ["thumbnail", "sub_category"],
        }),
        currencies.find(),
      ]);
      return {
        strapiSubcategories: catRes.data || [],
        strapiProducts: prodRes.data || [],
        strapiCurrencies: curRes.data || [],
      };
    } catch (err) {
      throw new Error("Marketplace connection failed.");
    }
  },
  pendingComponent: () => <GlobalLoader />,
  pendingMs: 200,
});

function CartComponent() {
  const { strapiSubcategories, strapiProducts, strapiCurrencies } =
    Route.useLoaderData();
  const { subCategoryId } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [productSearch, setProductSearch] = useState("");

  // Subscribe to Stores
  const subCategoriesInStore = useStore(
    subCategoryStore,
    (s) => s.subCategories,
  );
  const productsInStore = useStore(productStore, (s) => s.products);
  const purchasedIds = useStore(userStore, (s) => s.purchasedIds);

  // Persisted View Mode from UI Store
  const viewMode = useStore(uiStore, (s) => s.cartViewMode);

  const {
    current: currentCurrency,
    available,
    isLoading: isCurLoading,
  } = useStore(currencyStore, (s) => s);

  // Sync Strapi Data to Stores
  useEffect(() => {
    const STRAPI_BASE_URL =
      import.meta.env.VITE_STRAPI_URL?.replace("/api", "") ||
      "https://authentic-virtue-ebbd26e6cd.strapiapp.com";

    if (strapiCurrencies?.length > 0) {
      currencyActions.setAvailableCurrencies(
        strapiCurrencies.map((item: any) => ({
          code: item.code,
          symbol: item.symbol,
          label: item.label,
          rate: Number(item.rate),
          isDefault: item.isDefault,
          precision: item.precision || 2,
        })),
      );
    }

    if (strapiSubcategories) {
      subCategoryActions.setSubCategories(
        strapiSubcategories.map((item: any) => ({
          name: item.name,
          description: item.description || "Premium Digital Asset",
          subCategoryId: item.subCategoryId,
        })),
      );
    }

    if (strapiProducts) {
      productActions.setProducts(
        strapiProducts.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price || 0,
          sub_category: item.sub_category?.subCategoryId || item.sub_category,
          productId: item.productId,
          hasPurchased: purchasedIds.includes(item.productId),
          thumbnail: item.thumbnail?.formats?.small?.url
            ? `${STRAPI_BASE_URL}${item.thumbnail.formats.small.url}`
            : item.thumbnail?.url
              ? `${STRAPI_BASE_URL}${item.thumbnail.url}`
              : "",
          details: Array.isArray(item.details)
            ? item.details[0]?.children?.[0]?.text
            : item.details,
          isDigital: item.isDigital,
        })),
      );
    }
  }, [strapiSubcategories, strapiProducts, strapiCurrencies, purchasedIds]);

  const handleCategoryChange = (id: string | null) => {
    navigate({
      search: (prev) => ({ ...prev, subCategoryId: id || undefined }),
    });
  };

  const selectedSubCategoryName = subCategoriesInStore.find(
    (c) => c.subCategoryId === subCategoryId,
  )?.name;

  const displayedProducts = productsInStore.filter((p) => {
    const matchesCategory = subCategoryId
      ? p.sub_category === subCategoryId
      : true;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(productSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (subCategoriesInStore.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center">
        <EmptyState title="Store Empty" message="No categories found." />
      </div>
    );
  }

  const showCurrencySelector =
    !isCurLoading && Object.keys(available).length > 1;

  return (
    <div className="p-8 min-h-screen max-w-7xl mx-auto">
      <CartBadge />

      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
            <ShoppingBag className="w-10 h-10 text-primary" />
            <span>
              {selectedSubCategoryName || "Asset"}{" "}
              <span className="text-primary">
                {selectedSubCategoryName ? "" : "Cart"}
              </span>
            </span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            {displayedProducts.length} assets available
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto items-center">
          {/* VIEW SWITCHER */}
          <div className="flex bg-card border border-border p-1 rounded-2xl shadow-sm">
            <button
              type="button"
              onClick={() => uiActions.setCartViewMode("grid")}
              className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => uiActions.setCartViewMode("list")}
              className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Find assets..."
              className="w-full bg-card border border-border pl-11 pr-4 py-2.5 rounded-2xl text-xs font-bold outline-none focus:border-primary transition-all shadow-sm"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
          </div>

          <SubCategoryDropdown
            subCategories={subCategoriesInStore}
            selectedSubCatId={subCategoryId || null}
            onSelect={handleCategoryChange}
          />

          {showCurrencySelector && (
            <div className="flex bg-card border border-border p-1 rounded-2xl shadow-sm min-h-[46px]">
              <div className="px-3 flex items-center gap-2 border-r border-border mr-1">
                <Coins className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              {Object.values(available).map((currency) => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => currencyActions.setCurrency(currency.code)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                    currentCurrency.code === currency.code
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {currency.code}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {displayedProducts.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              : "flex flex-col gap-4"
          }
        >
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              // You might want to pass viewMode to ProductCard if it has a specific list-style design
              variant={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="py-20">
          <EmptyState
            title="No matches"
            message={
              productSearch
                ? `No results for "${productSearch}"`
                : "Category is empty."
            }
          />
        </div>
      )}
    </div>
  );
}
