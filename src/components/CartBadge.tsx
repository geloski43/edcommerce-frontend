import { useStore } from "@tanstack/react-store";
import { cartStore } from "@/lib/cart-store";
import { ShoppingCart } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CartBadge() {
  const items = useStore(cartStore, (s) => s.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <div className="fixed top-8 right-8 z-50">
      {/* Wrap the badge in a Link to the /checkout route */}
      <Link
        to="/checkout"
        className="relative block bg-primary text-primary-foreground p-4 rounded-2xl shadow-2xl shadow-primary/40
                   animate-in zoom-in duration-300 hover:scale-110 hover:shadow-primary/60 transition-all active:scale-95 group"
      >
        <ShoppingCart className="w-6 h-6 group-hover:rotate-[-10deg] transition-transform" />

        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-background">
          {totalItems}
        </span>

        {/* Optional: Add a small "Checkout" tooltip that appears on hover */}
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-foreground text-background text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest whitespace-nowrap">
          View Cart
        </span>
      </Link>
    </div>
  );
}
