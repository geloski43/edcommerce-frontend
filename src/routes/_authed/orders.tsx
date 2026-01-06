import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { orderStore } from "@/lib/order-store";
import { currencyStore } from "@/lib/currency-store";
import {
  Package,
  LayoutGrid,
  List,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Hash,
  Search,
} from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { uiStore, uiActions } from "@/lib/ui-store";

export const Route = createFileRoute("/_authed/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const orders = useStore(orderStore, (s) => s.orders);
  const viewMode = useStore(uiStore, (s) => s.orderViewMode);
  const [orderSearch, setOrderSearch] = useState("");
  const currency = useStore(currencyStore, (s) => s.current);

  const formatPrice = (usdAmount: number) => {
    return new Intl.NumberFormat(currency.code === "PHP" ? "en-PH" : "en-US", {
      style: "currency",
      currency: currency.code,
    }).format(usdAmount * currency.rate);
  };

  // Filter logic for the search bar

  const displayedOrders = orders.filter((o) => {
    const searchLower = orderSearch.toLowerCase();

    return (
      o.id.toString().includes(searchLower) ||
      o.transactionId?.toLowerCase() === searchLower
    );
  });

  if (orders.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <EmptyState title="No Orders" message="Your order history is empty." />
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen max-w-7xl mx-auto space-y-10">
      {/* --- HEADER SECTION --- */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-10">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
            Order <span className="text-muted-foreground/50">History</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search Order ID or TXN..."
              className="w-full bg-card border border-border pl-11 pr-4 py-2.5 rounded-2xl text-xs font-bold outline-none focus:border-primary transition-all shadow-sm"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
            />
          </div>

          <div className="flex bg-card border border-border p-1 rounded-xl shadow-sm">
            {[
              { id: "grid", icon: LayoutGrid, label: "Grid" },
              { id: "list", icon: List, label: "List" },
            ].map((mode) => (
              <button
                type="button"
                key={mode.id}
                onClick={() => uiActions.setOrderViewMode(mode.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black transition-all tracking-widest ${
                  viewMode === mode.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <mode.icon className="w-3.5 h-3.5" /> {mode.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* --- ORDERS FEED --- */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            : "flex flex-col gap-4"
        }
      >
        {displayedOrders.map((order) => (
          <div
            key={order.id}
            className={`group relative bg-card border border-border transition-all duration-300 flex flex-col overflow-hidden ${
              viewMode === "grid"
                ? "p-8 rounded-[2.5rem]"
                : "p-5 rounded-2xl md:flex-row md:items-center justify-between"
            }`}
          >
            {/* ITEM INFO */}
            <div
              className={`flex items-start gap-5 ${viewMode === "list" ? "flex-[2]" : "mb-6"}`}
            >
              <div className="shrink-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 w-14 h-14 flex items-center justify-center border border-primary/10">
                <Package className="text-primary w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <h3 className="font-black truncate text-lg uppercase tracking-tight leading-none">
                    #{order.id}
                  </h3>
                  <StatusBadge status={order.orderStatus} />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest">
                  <span className="flex items-center gap-1.5 text-primary/80">
                    <Clock className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3 h-3" />
                    {order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* --- ORDER ITEMS SECTION --- */}
            <div
              className={`${
                viewMode === "list"
                  ? "flex-4 hidden lg:block px-10 border-l border-r border-border/40 mx-6"
                  : "mb-6"
              }`}
            >
              {viewMode === "grid" ? (
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-1">
                    Manifest ({order.order_items?.length})
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-1 px-1">
                    {order.order_items?.map((item: any) => (
                      <div
                        key={item.id}
                        className="shrink-0 w-[140px] bg-muted/30 p-3 rounded-2xl border border-border/50 flex flex-col gap-2"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">
                            x{item.quantity || 1}
                          </span>
                        </div>
                        <Link
                          to="/product/$productId"
                          params={{ productId: item.product.productId }}
                          className="hover:text-primary transition-colors cursor-pointer"
                        >
                          <p className="text-[11px] font-black truncate uppercase tracking-tight italic">
                            {item.product?.name}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full justify-center">
                  <div className="max-h-20 overflow-y-auto no-scrollbar space-y-1">
                    {order.order_items?.map((item: any, i: number) => (
                      <div
                        key={item.id || i}
                        className="flex items-center justify-between group/item"
                      >
                        <Link
                          to="/product/$productId"
                          params={{ productId: item.product.productId }}
                          className="text-[10px] font-black uppercase truncate italic text-muted-foreground hover:text-primary transition-colors"
                        >
                          {item.product?.name}
                        </Link>
                        <span className="text-[10px] font-bold font-mono text-primary/80">
                          x{item.quantity || 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order amount & Link Action */}
            <div
              className={`flex items-end justify-between ${
                viewMode === "list"
                  ? "md:min-w-[220px] md:justify-end gap-8 pt-4 md:pt-0 border-t md:border-none border-border/50"
                  : "mt-auto pt-6 border-t border-border/50"
              }`}
            >
              <div className={viewMode === "list" ? "text-right" : ""}>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-1">
                  Total
                </p>
                <p className="text-2xl font-black text-foreground leading-none tabular-nums">
                  {formatPrice(order.orderAmount)}
                </p>
              </div>

              {/* LINK MOVED HERE TO WRAP CHEVRON */}
              <Link
                to="/order/$transactionId"
                params={{ transactionId: order.transactionId }}
                className="p-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all shadow-sm group/link"
              >
                <ChevronRight className="w-5 h-5 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isCompleted = status?.toLowerCase() === "completed";
  return (
    <span
      className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-1 ${
        isCompleted
          ? "bg-green-500/10 text-green-500"
          : "bg-yellow-500/10 text-yellow-500"
      }`}
    >
      {isCompleted ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : (
        <AlertCircle className="w-3 h-3" />
      )}
      {status}
    </span>
  );
}
