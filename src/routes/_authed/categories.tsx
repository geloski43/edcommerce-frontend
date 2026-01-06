import { useEffect, useState } from "react";
import { categories, subcategories } from "@/lib/strapiClient";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { categoryActions, categoryStore } from "@/lib/category-store";
import { subCategoryActions } from "@/lib/sub-category-store";
import { useStore } from "@tanstack/react-store";
import { uiStore, uiActions } from "@/lib/ui-store";
import { Folder, LayoutGrid, List } from "lucide-react";
import GlobalLoader from "@/components/GlobalLoader";
import EmptyState from "@/components/EmptyState";
import { SubCategoryDropdown } from "@/components/SubCategoryDropdown";

export const Route = createFileRoute("/_authed/categories")({
  component: RouteComponent,

  loader: async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        categories.find(),

        subcategories.find({
          populate: ["category"],
        }),
      ]);

      return {
        strapiCategories: catRes.data,

        strapiSubCategories: subRes.data,
      };
    } catch (err) {
      throw new Error("Strapi connection failed. Check your API Token.");
    }
  },

  pendingComponent: () => <GlobalLoader />,

  pendingMs: 200,
});

function RouteComponent() {
  const { strapiCategories, strapiSubCategories } = Route.useLoaderData();

  const viewMode = useStore(uiStore, (s) => s.categoryViewMode);
  const navigate = useNavigate();
  const categoriesInStore = useStore(categoryStore, (s) => s.categories);

  useEffect(() => {
    if (strapiCategories && strapiSubCategories) {
      // 1. Sync SubCategory Store (Global)

      const formattedSubs = strapiSubCategories.map((sub: any) => ({
        name: sub.name,

        description: sub.description || "",

        subCategoryId: sub.subCategoryId,
      }));

      subCategoryActions.setSubCategories(formattedSubs);

      // 2. Sync Category Store (Nested for the UI)

      const formattedCategories = strapiCategories.map((item: any) => ({
        name: item.name,

        description: item.description || "Premium Digital Asset",

        categoryId: item.categoryId,

        subs: strapiSubCategories

          .filter((sub: any) => sub.category?.categoryId === item.categoryId)

          .map((sub: any) => ({
            subCategoryId: sub.subCategoryId,

            name: sub.name,
          })),
      }));

      categoryActions.setCategories(formattedCategories);
    }
  }, [strapiCategories, strapiSubCategories]);

  const handleSelect = (id: string | null) => {
    if (id) {
      navigate({
        to: "/cart",

        search: { subCategoryId: id },
      });
    }
  };

  if (categoriesInStore.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <EmptyState
          title="No Categories"
          message="Published categories are currently empty."
        />
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            <span className="text-primary">Categories</span>
          </h1>

          <p className="text-muted-foreground text-sm font-medium">
            Explore {categoriesInStore.length} categories
          </p>
        </div>

        <div className="flex bg-card border border-border p-1 rounded-xl shadow-sm">
          <button
            type="button"
            onClick={() => uiActions.setCategoryViewMode("grid")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "grid"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> GRID
          </button>

          <button
            type="button"
            onClick={() => uiActions.setCategoryViewMode("list")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="w-4 h-4" /> LIST
          </button>
        </div>
      </header>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-3"
        }
      >
        {categoriesInStore.map((cat) => (
          <div
            key={cat.categoryId}
            className={`group bg-card border border-border transition-all hover:border-primary/30 flex flex-col ${
              viewMode === "grid" ? "p-6 rounded-3xl" : "p-4 rounded-2xl"
            }`}
          >
            <div
              className={`flex items-center gap-4 ${viewMode === "grid" ? "mb-6" : "mb-2"}`}
            >
              <div className="shrink-0 rounded-xl bg-primary/10 w-10 h-10 flex items-center justify-center">
                <Folder className="text-primary w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate text-lg uppercase tracking-tight">
                  {cat.name}
                </h3>

                <p className="text-muted-foreground text-[10px] uppercase font-bold opacity-60">
                  {cat.subs.length} Sub-Collections
                </p>
              </div>
            </div>

            <div className="mt-auto">
              <SubCategoryDropdown
                subCategories={cat.subs}
                selectedSubCatId={null}
                onSelect={handleSelect}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
