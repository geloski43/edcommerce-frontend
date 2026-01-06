import { useState } from "react";
import {
  Plus,
  Check,
  ImageIcon,
  Tag,
  Download,
  ShoppingCart,
} from "lucide-react";
import { cartActions } from "@/lib/cart-store";
import { Product } from "@/lib/product-store";
import { useStore } from "@tanstack/react-store";
import { currencyStore } from "@/lib/currency-store";
import { Link } from "@tanstack/react-router";

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "list";
}

export function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const currency = useStore(currencyStore, (s) => s.current);

  const formatPrice = (priceInUSD: number) => {
    const convertedPrice = priceInUSD * currency.rate;
    return new Intl.NumberFormat(currency.code === "PHP" ? "en-PH" : "en-US", {
      style: "currency",
      currency: currency.code,
    }).format(convertedPrice);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    cartActions.addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${product.productId}`;
    window.open(downloadUrl, "_blank");
  };

  if (variant === "list") {
    return (
      <div
        className={`group bg-card border transition-all duration-300 p-4 rounded-2xl flex items-center gap-4 shadow-sm ${
          product.hasPurchased
            ? "border-green-500/30"
            : "border-border hover:border-primary/40"
        }`}
      >
        {/* Thumbnail (List) */}
        <Link
          to="/product/$productId"
          params={{ productId: product.productId }}
          className="w-20 h-20 shrink-0 rounded-xl bg-muted overflow-hidden relative border border-border/50"
        >
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-muted-foreground/20" />
            </div>
          )}
        </Link>

        {/* Info (List) */}
        <div className="flex-1 min-w-0">
          <Link
            to="/product/$productId"
            params={{ productId: product.productId }}
            className="font-bold text-base tracking-tight truncate block group-hover:text-primary transition-colors"
          >
            {product.name}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-black text-primary tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.hasPurchased && (
              <span className="text-[9px] font-black uppercase text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">
                Owned
              </span>
            )}
          </div>
        </div>

        {/* Actions (List) */}
        <div className="flex items-center gap-2">
          {product.hasPurchased ? (
            <button
              type="button"
              onClick={handleDownload}
              className="p-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all active:scale-95"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className={`p-3 rounded-xl transition-all active:scale-95 ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-primary text-primary-foreground hover:shadow-lg shadow-primary/10"
              }`}
            >
              {added ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- GRID VARIANT (Default) ---
  return (
    <div
      className={`group bg-card border transition-all duration-300 p-6 rounded-[2rem] flex flex-col shadow-sm ${
        product.hasPurchased
          ? "border-green-500/30"
          : "border-border hover:border-primary/40"
      }`}
    >
      <Link
        to="/product/$productId"
        params={{ productId: product.productId }}
        className="cursor-pointer"
      >
        <div className="w-full aspect-video mb-6 rounded-2xl bg-muted overflow-hidden relative border border-border/50">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
            </div>
          )}

          {product.hasPurchased && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white rounded-full flex items-center gap-1.5 shadow-lg z-10">
              <Check className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                Purchased
              </span>
            </div>
          )}

          <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Tag className="w-3 h-3 text-white" />
            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-xl tracking-tight mb-2 text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">
          {product.details || "No description available."}
        </p>

        <div className="pt-4 border-t border-border/50 mt-auto flex flex-col gap-4">
          {!product.hasPurchased && (
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                Price ({currency.code})
              </span>
              <span className="text-xl font-black text-primary tabular-nums">
                {formatPrice(product.price)}
              </span>
            </div>
          )}

          {product.hasPurchased ? (
            <button
              type="button"
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-500/20 active:scale-95"
            >
              <Download className="w-4 h-4" />
              DOWNLOAD ASSET
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-primary text-primary-foreground hover:shadow-lg active:scale-95 shadow-md shadow-primary/10"
              }`}
            >
              {added ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {added ? "ADDED TO LIST" : "ADD TO CART"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
