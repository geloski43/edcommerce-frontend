import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { products } from "@/lib/strapiClient";
import { useStore } from "@tanstack/react-store";
import { currencyStore } from "@/lib/currency-store";
import { cartActions } from "@/lib/cart-store";
import { useState } from "react";
import { userStore } from "@/lib/user-store";

import {
  ArrowLeft,
  ShoppingCart,
  Check,
  ShieldCheck,
  Zap,
  Globe,
  Download, // Added Download icon
} from "lucide-react";
import GlobalLoader from "@/components/GlobalLoader";
import { CartBadge } from "@/components/CartBadge";

export const Route = createFileRoute("/_authed/product_/$productId")({
  loader: async ({ params }) => {
    try {
      const res = await products.find({
        filters: { productId: params.productId },
        populate: ["thumbnail", "sub_category"],
      });

      if (!res.data || res.data.length === 0) {
        throw new Error("Product not found");
      }

      return { product: res.data[0] };
    } catch (err) {
      throw new Error("Failed to fetch product details.");
    }
  },
  component: ProductDetailComponent,
  pendingComponent: () => <GlobalLoader />,
  pendingMs: 200,
});

function ProductDetailComponent() {
  const purchasedIds = useStore(userStore, (s) => s.purchasedIds);

  const { product: item } = Route.useLoaderData();
  const navigate = useNavigate();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  // Check if this specific item ID is in the user's purchased list
  const isPurchased = purchasedIds.includes(item.productId);

  // 1. Currency Logic
  const currency = useStore(currencyStore, (s) => s.current);

  const formatPrice = (priceInUSD: number) => {
    const convertedPrice = (priceInUSD || 0) * currency.rate;
    return new Intl.NumberFormat(currency.code === "PHP" ? "en-PH" : "en-US", {
      style: "currency",
      currency: currency.code,
    }).format(convertedPrice);
  };

  const STRAPI_BASE_URL =
    import.meta.env.VITE_STRAPI_URL?.replace("/api", "") ||
    "https://authentic-virtue-ebbd26e6cd.strapiapp.com";

  // local src
  const displayImage = item.thumbnail?.formats?.small?.url
    ? `${STRAPI_BASE_URL}${item.thumbnail.formats.small.url}`
    : item.thumbnail?.url
      ? `${STRAPI_BASE_URL}${item.thumbnail.url}`
      : "/placeholder-asset.jpg";

  const displayDetails = Array.isArray(item.details)
    ? item.details[0]?.children?.[0]?.text
    : item.details || "No detailed description provided for this asset.";

  // 3. Handlers
  const handleAddToCart = () => {
    cartActions.addItem({
      id: item.id,
      name: item.name,
      price: item.price || 0,
      productId: item.productId,
      sub_category: item.sub_category?.subCategoryId || item.sub_category,
      thumbnail: item.thumbnail.url,
      details: displayDetails,
      isDigital: item.isDigital,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleDownload = () => {
    // Uses the Google Drive File ID stored in item.productId
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${item.productId}`;
    window.open(downloadUrl, "_blank");
  };
  console.log(item);
  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <CartBadge />
      <div className="max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => router.history.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative group">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-border bg-card shadow-2xl">
              <img
                src={item.thumbnail.url}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 blur-3xl rounded-full -z-10" />
          </div>

          <div className="flex flex-col h-full">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                  {item.sub_category?.name || "Digital Asset"}
                </span>
                {isPurchased && (
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Check className="w-3 h-3" /> Purchased
                  </span>
                )}
              </div>

              <h1 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
                {item.name}
              </h1>

              {/* Only show price if not purchased */}
              {!isPurchased && (
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="text-4xl font-black text-primary">
                    {formatPrice(item.price)}
                  </span>
                  <span className="text-muted-foreground text-sm font-bold uppercase tracking-widest">
                    VAT Inclusive
                  </span>
                </div>
              )}

              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-lg">
                {displayDetails}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-tight">
                  Instant Delivery
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-sm">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-tight">
                  Lifetime Access
                </span>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-border flex flex-col sm:flex-row gap-4">
              {isPurchased ? (
                /* DOWNLOAD BUTTON */
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl text-sm font-black bg-white text-black hover:bg-white/90 transition-all active:scale-[0.98] shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  DOWNLOAD ASSET
                </button>
              ) : (
                /* ADD TO CART BUTTON */
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl text-sm font-black transition-all ${
                    added
                      ? "bg-green-600 text-white"
                      : "bg-primary text-primary-foreground hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.4)] active:scale-[0.98]"
                  }`}
                >
                  {added ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                  {added ? "ADDED TO LIST" : "ADD TO CART"}
                </button>
              )}

              <button
                type="button"
                className="px-8 py-5 rounded-2xl border border-border font-black text-sm uppercase hover:bg-card transition-colors"
              >
                <Globe className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
