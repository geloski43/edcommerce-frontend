import { Store } from "@tanstack/react-store";

export interface Order {
  id: number;
  orderId: string;
  orderAmount: number;
  orderStatus: string;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  order_items: any[];
}

export const orderStore = new Store<{ orders: Order[] }>({
  orders: [],
});

export const orderActions = {
  setOrders: (orders: Order[]) => {
    orderStore.setState((state) => ({ ...state, orders }));
  },
};
