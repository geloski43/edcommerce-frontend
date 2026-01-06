import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { cartActions } from "@/lib/cart-store";
import { userStore, userActions } from "@/lib/user-store"; // Adjust paths
import { users } from "@/lib/strapiClient";
import {
  CheckCircle2,
  Download,
  ArrowRight,
  Mail,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/_authed/payment-success")({
  component: PaymentSuccessPage,
});

function PaymentSuccessPage() {
  // Use useStore to make the component reactive to store changes
  const email = useStore(userStore, (s) => s.email);
  const clerkId = useStore(userStore, (s) => s.clerkId);
  const purchasedIds = useStore(userStore, (s) => s.purchasedIds);

  const [isVerifying, setIsVerifying] = useState(true);
  // Track how many items the user had BEFORE this purchase
  const [initialCount] = useState(purchasedIds.length);

  // 1. Clear cart on mount
  useEffect(() => {
    cartActions.clearCart();
  }, []);

  // 2. Polling Logic
  useEffect(() => {
    if (!email) return;

    let interval: NodeJS.Timeout;
    let attempts = 0;

    const checkPurchases = async () => {
      try {
        const response = await users.find({
          filters: { email: { $eq: email } },
          populate: { purchased: true },
        });

        // Strapi users endpoint returns an array or data array
        const strapiUser = Array.isArray(response)
          ? response[0]
          : (response as any).data?.[0];

        if (strapiUser) {
          const latestIds =
            strapiUser.purchased?.map((p: any) => p.productId) || [];

          // Check if the webhook has finished (ID count increased)
          if (latestIds.length > initialCount) {
            userActions.setUser({
              email: strapiUser.email,
              clerkId: strapiUser.clerkId,
              blocked: false,
              purchasedIds: latestIds,
            });
            setIsVerifying(false);
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error("Polling sync error:", err);
      }

      attempts++;
      // Stop polling after 30 seconds to prevent infinite loops
      if (attempts >= 15) {
        setIsVerifying(false);
        clearInterval(interval);
      }
    };

    interval = setInterval(checkPurchases, 1000);
    return () => clearInterval(interval);
  }, [email, initialCount]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Progress Icon */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative bg-card border-2 border-primary/20 p-6 rounded-[2.5rem] shadow-2xl">
            {isVerifying ? (
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
            ) : (
              <CheckCircle2 className="w-16 h-16 text-primary" />
            )}
          </div>
        </div>

        <h1 className="text-4xl font-black tracking-tighter uppercase mb-4">
          {isVerifying ? "Securing Access" : "Order Confirmed"}
        </h1>

        <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
          {isVerifying
            ? "We're linking your new assets to your library. Just a moment..."
            : "Your library has been updated. You can now access your new downloads."}
        </p>

        {/* Status Cards */}
        <div className="bg-card border border-border rounded-[2rem] p-6 mb-8 text-left space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                Status
              </p>
              <p className="text-sm font-bold">
                Email with links is on its way.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 pt-4 border-t border-border">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Download className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                Library
              </p>
              <p className="text-sm font-bold">
                {isVerifying ? "Synchronizing..." : "Sync Complete."}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            to="/orders"
            disabled={isVerifying}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm uppercase transition-all ${
              isVerifying
                ? "bg-muted text-muted-foreground opacity-50 cursor-wait"
                : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95"
            }`}
          >
            {isVerifying ? "Please wait..." : "Go to Library"}
            {!isVerifying && <ArrowRight className="w-4 h-4" />}
          </Link>

          <Link
            to="/cart"
            className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mt-4"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
