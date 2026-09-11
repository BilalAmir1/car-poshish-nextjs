export interface CartItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  quantity: number;
}

export type FulfillmentMethod = "pickup" | "delivery";

export interface OrderPayload {
  items: { id: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  fulfillmentMethod: FulfillmentMethod;
  deliveryZone?: string;
  deliveryFee: number;
  total: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  notes?: string;
}

export interface OrderResult {
  orderNumber: string;
}

export const CART_STORAGE_KEY = "car-poshish-cart";
