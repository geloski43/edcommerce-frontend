import { useState, useId, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { cartStore, cartActions } from "@/lib/cart-store";
import { currencyStore } from "@/lib/currency-store";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { userStore } from "@/lib/user-store"; // Import userStore

export const Route = createFileRoute("/_authed/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const {
    email: storeEmail,
    clerkId: storeClerkId,
    isLoaded: isUserStoreLoaded,
  } = useStore(userStore, (s) => s);

  const deliveryEmailId = useId();
  const navigate = useNavigate();

  const cart = useStore(cartStore, (s) => s.items);
  const currency = useStore(currencyStore, (s) => s.current);

  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [limitWarningId, setLimitWarningId] = useState<string | null>(null);

  // 2. Set the initial email state from the store data
  useEffect(() => {
    if (isUserStoreLoaded && storeEmail) {
      setEmail(storeEmail);
    }
  }, [isUserStoreLoaded, storeEmail]);

  useEffect(() => {
    if (limitWarningId) {
      const timer = setTimeout(() => setLimitWarningId(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [limitWarningId]);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const convertedSubtotal = subtotal * currency.rate;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(currency.code === "PHP" ? "en-PH" : "en-US", {
      style: "currency",
      currency: currency.code,
    }).format(amount);
  };

  const handleIncrement = (item: any) => {
    if (item.isDigital && item.quantity >= 1) {
      setLimitWarningId(item.productId);
      return;
    }
    cartActions.updateQuantity(item.productId, 1);
  };

  const handlePayment = async () => {
    if (!email) {
      alert("Please enter a delivery email.");
      return;
    }

    setIsProcessing(true);

    try {
      const orderItems = cart.map((item) => ({
        id: item.id,
        product_id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const orderPayload = {
        email,
        amount: convertedSubtotal,
        currency: currency.code,
        clerkId: storeClerkId,
        orderData: { order_items: orderItems },
      };

      // FETCH to the non-authed API route to avoid "Method Not Allowed"
      const response = await fetch("/api/payment/xendit-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      // SAFETY: Check if response is actually JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server Error: ${text.slice(0, 50)}...`);
      }

      const data = await response.json();

      if (response.ok && data.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        throw new Error(data.error || "Payment failed to initialize.");
      }
    } catch (err: any) {
      console.error("Payment Initialization Error:", err);
      alert(err.message);
      setIsProcessing(false);
    }
  };

  if (cart?.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">
          Your cart is empty
        </h2>
        <Link
          to="/cart"
          className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black text-sm uppercase"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  console.log(cart);
  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <button
              type="button"
              onClick={() => navigate({ to: "/cart" })}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 group font-bold text-xs uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Cart
            </button>
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              Review Order
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl border border-primary/20">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Secure Checkout
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="group relative flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[2rem] bg-card border border-border hover:border-primary/50 transition-all shadow-sm"
              >
                <div className="w-full sm:w-32 aspect-square rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    {item.isDigital && (
                      <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black uppercase">
                        Digital
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-1">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 mt-4">
                    <p className="font-black text-primary">
                      {formatPrice(item.price * currency.rate)}
                    </p>
                    <div className="flex items-center bg-background border rounded-xl p-1 relative">
                      {limitWarningId === item.productId && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[8px] font-black uppercase px-3 py-1.5 rounded-lg z-50 flex items-center gap-1.5 whitespace-nowrap">
                          <AlertCircle className="w-3 h-3" /> Digital items
                          limited to 1
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          cartActions.updateQuantity(item.productId, -1)
                        }
                        className="p-2 hover:bg-muted rounded-lg"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-black text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleIncrement(item)}
                        className="p-2 hover:bg-muted rounded-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => cartActions.removeItem(item.productId)}
                  className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-12 p-8 rounded-[2.5rem] bg-card border border-border shadow-xl">
              <h2 className="text-xl font-black uppercase tracking-tight mb-6">
                Summary
              </h2>
              <div className="mb-8 space-y-3">
                <label
                  htmlFor={deliveryEmailId}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" /> Delivery Email
                </label>
                <input
                  id={deliveryEmailId}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border px-4 py-3 rounded-xl font-bold text-sm outline-none focus:border-primary transition-all"
                  required
                />
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-bold uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="font-black">
                    {formatPrice(convertedSubtotal)}
                  </span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-baseline">
                  <span className="text-lg font-black uppercase tracking-tighter">
                    Total
                  </span>
                  <p className="text-3xl font-black text-primary">
                    {formatPrice(convertedSubtotal)}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                onClick={handlePayment}
                disabled={isProcessing || !email}
                className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CreditCard className="w-5 h-5" />
                )}
                {isProcessing ? "Processing..." : "Pay with Xendit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
