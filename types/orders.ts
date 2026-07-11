// types/orders.ts
// Production order types — structured for extensibility across payment providers

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'easypaisa' | 'jazzcash' | 'stripe' | 'bank_transfer';

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
}

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  subtotal: number;
  shipping_cost: number;
  discount_applied: number;
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// ------------------------------------
// Payment Provider Abstraction
// Allows plugging in Stripe, Easypaisa, JazzCash without changing the checkout form
// ------------------------------------
export interface PaymentProviderMeta {
  id: PaymentMethod;
  name: string;
  description: string;
  isAvailable: boolean;
  badge?: string;
  badgeColor?: 'green' | 'blue' | 'yellow' | 'red';
}

export const PAYMENT_PROVIDERS: PaymentProviderMeta[] = [
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay in cash when your order arrives at your doorstep.',
    isAvailable: true,
  },
  {
    id: 'easypaisa',
    name: 'Easypaisa',
    description: 'Transfer via Easypaisa mobile wallet.',
    isAvailable: false,
    badge: 'Coming Soon',
    badgeColor: 'yellow',
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    description: 'Transfer via JazzCash mobile wallet.',
    isAvailable: false,
    badge: 'Coming Soon',
    badgeColor: 'red',
  },
];

// Checkout form state
export interface CheckoutFormData {
  // Contact
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Address
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: string;
  // Order
  notes: string;
  paymentMethod: PaymentMethod;
  transactionId?: string; // for mobile money payments
}

export const SHIPPING_COST = 250;
export const FREE_SHIPPING_THRESHOLD = 5000;
