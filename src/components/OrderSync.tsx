import { useEffect } from "react";
import { useStore } from "@tanstack/react-store";
import { userStore } from "@/lib/user-store";
import { orders as ordersClient } from "@/lib/strapiClient";
import { orderActions } from "@/lib/order-store";

export function OrderSync() {
  const email = useStore(userStore, (s) => s.email);

  useEffect(() => {
    // Prevent fetching if no email is present
    if (!email) return;

    const fetchOrders = async () => {
      try {
        const res = await ordersClient.find({
          filters: { user: { email: { $eq: email } } },
          populate: {
            order_items: {
              populate: { product: { populate: ["thumbnail"] } },
            },
          },
        });
        const strapiOrders = (res as any).data || (res as any)[0];
        orderActions.setOrders(strapiOrders || []);
      } catch (err) {
        console.error("OrderSync failed:", err);
      }
    };

    fetchOrders();

    // Poll every 1 hour (3,600,000 ms)
    const ONE_HOUR = 60 * 60 * 1000;
    const interval = setInterval(fetchOrders, ONE_HOUR);

    return () => clearInterval(interval);
  }, [email]);

  return null;
}
