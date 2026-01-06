import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { orderStore } from "@/lib/order-store";
import { currencyStore } from "@/lib/currency-store";
import {
  Package,
  ArrowLeft,
  Calendar,
  CreditCard,
  Hash,
  ExternalLink,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import EmptyState from "@/components/EmptyState";

export const Route = createFileRoute("/_authed/order_/$transactionId")({
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { transactionId } = Route.useParams();
  const router = useRouter();
  const orders = useStore(orderStore, (s) => s.orders);
  const currency = useStore(currencyStore, (s) => s.current);

  // Find the specific order from the store
  const order = orders.find((o) => String(o.transactionId) === transactionId);

  const formatPrice = (usdAmount: number) => {
    return new Intl.NumberFormat(currency.code === "PHP" ? "en-PH" : "en-US", {
      style: "currency",
      currency: currency.code,
    }).format(usdAmount * currency.rate);
  };

  if (!order) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <EmptyState title="No Order" message="Selected Order not found." />
      </div>
    );
  }

  const STRAPI_BASE_URL =
    import.meta.env.VITE_STRAPI_URL?.replace("/api", "") ||
    "http://localhost:1337";
  console.log(order);
  return (
    <div className="p-8 min-h-screen max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* --- HEADER NAVIGATION --- */}
      <nav className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => router.history.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <button
          type="button"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Download className="w-3.5 h-3.5" /> Get Invoice
        </button>
      </nav>

      {/* --- INVOICE HERO --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none">
              #{order.id}
            </h1>
            <StatusBadge status={order.orderStatus} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground font-bold flex items-center gap-2 uppercase text-[10px] tracking-[0.2em]">
              <Hash className="w-3.5 h-3.5 text-primary" />
              Transaction ID:{" "}
              <span className="text-foreground select-all">
                {order.transactionId || "INTERNAL_BYPASS"}
              </span>
            </p>
            <p className="text-muted-foreground font-bold flex items-center gap-2 uppercase text-[10px] tracking-[0.2em]">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Settled on:{" "}
              <span className="text-foreground">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-card border-2 border-primary/20 p-8 rounded-[2.5rem] flex flex-col items-end justify-center shadow-2xl shadow-primary/5">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">
            Total Amount
          </p>
          <p className="text-5xl font-black text-foreground tabular-nums">
            {formatPrice(order.orderAmount)}
          </p>
        </div>
      </div>

      <hr className="border-border/50" />

      {/* --- DETAILS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* LEFT: ITEM LIST */}
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
            <Package className="w-4 h-4" /> Manifest Details
          </h2>
          <div className="space-y-3">
            {order.order_items?.map((item: any, i: number) => (
              <div
                key={item.transactionId}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl group hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center font-black text-xs border border-border overflow-hidden">
                    {item.product?.thumbnail ? (
                      <img
                        src={`${STRAPI_BASE_URL}${item.product.thumbnail.url}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="opacity-20" />
                    )}
                  </div>
                  <div>
                    <Link
                      to="/product/$productId"
                      params={{ productId: item.product?.productId }}
                      className="text-sm font-black uppercase italic hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {item.product?.name}
                    </Link>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>
                </div>
                <p className="font-mono font-bold text-sm">
                  {formatPrice(item.priceAtPurchase || 0)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: SUMMARY & PAYMENT */}
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Payment Summary
          </h2>
          <div className="bg-muted/30 rounded-[2rem] p-8 space-y-4 border border-border/50">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-muted-foreground uppercase tracking-tighter">
                Gateway
              </span>
              <span className="font-black uppercase italic">
                {order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold text-muted-foreground uppercase tracking-tighter">
                Security Check
              </span>
              <span className="font-black uppercase italic text-green-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between items-end pt-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Net Total
              </span>
              <span className="text-3xl font-black tabular-nums">
                {formatPrice(order.orderAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-using your StatusBadge for consistency
function StatusBadge({ status }: { status: string }) {
  const isCompleted = status?.toLowerCase() === "completed";
  return (
    <span
      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 ${
        isCompleted ? "bg-green-500 text-white" : "bg-yellow-500 text-black"
      }`}
    >
      {isCompleted ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : (
        <AlertCircle className="w-3.5 h-3.5" />
      )}
      {status}
    </span>
  );
}
