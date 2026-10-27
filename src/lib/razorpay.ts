export interface RazorpaySettings {
  enabled: boolean;
  keyId: string;
  keySecret: string;
  mode: "test" | "live";
  buttonStyle: "botanical" | "razorpay" | "gold" | "minimal" | "white";
  buttonText: "Buy Now" | "Pay via Razorpay" | "Instant 1-Click Buy" | "Buy Now with Razorpay" | "Express Checkout";
  showBadge: boolean;
  allowedMethods: {
    upi: boolean;
    cards: boolean;
    netbanking: boolean;
    wallets: boolean;
  };
}

export const DEFAULT_RAZORPAY_SETTINGS: RazorpaySettings = {
  enabled: true,
  keyId: "rzp_test_TsreDTx2vLmBw1",
  keySecret: "rzp_sec_mileinfinity2026",
  mode: "test",
  buttonStyle: "white",
  buttonText: "Buy Now",
  showBadge: true,
  allowedMethods: {
    upi: true,
    cards: true,
    netbanking: true,
    wallets: true,
  },
};

const SETTINGS_KEY = "mile-infinity-razorpay-settings";
const ORDERS_KEY = "mile-infinity-orders";

export function getRazorpaySettings(): RazorpaySettings {
  if (typeof window === "undefined") return DEFAULT_RAZORPAY_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_RAZORPAY_SETTINGS;
    return { ...DEFAULT_RAZORPAY_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_RAZORPAY_SETTINGS;
  }
}

export function saveRazorpaySettings(settings: RazorpaySettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent("mile-infinity-razorpay-settings-updated", { detail: settings }));
  } catch {
    // Handled safely
  }
}

export interface RazorpayDirectOrderPayload {
  productId: string;
  productName: string;
  productSlug: string;
  size: string;
  unitPrice: number;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine: string;
  city: string;
  pincode: string;
  paymentMethod: "upi" | "card" | "netbanking" | "wallet";
}

export interface StoredOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine: string;
  city: string;
  pincode: string;
  subtotalInr: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  source?: "product_card_quick_pay" | "cart_checkout";
  items: {
    name: string;
    quantity: number;
    price: number;
    size: string;
    productId?: string;
  }[];
  payment: {
    gateway: "Razorpay" | "COD";
    status: "paid" | "pending" | "failed";
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    method?: string;
  };
  shipment?: {
    shiprocketOrderId?: string;
    shipmentId?: string;
    awbCode?: string;
    courierName?: string;
    status?: "pickup_scheduled" | "in_transit" | "out_for_delivery" | "delivered";
    labelUrl?: string;
  };
}

export function recordRazorpayOrder(payload: RazorpayDirectOrderPayload): StoredOrder {
  const orderNum = "MI-" + Math.floor(100000 + Math.random() * 900000);
  const paymentId = "pay_" + Math.random().toString(36).substring(2, 10).toUpperCase() + Date.now().toString(36).slice(-4);
  const orderId = "order_" + Math.random().toString(36).substring(2, 12).toLowerCase();
  const subtotal = payload.unitPrice * payload.quantity;

  const newOrder: StoredOrder = {
    id: "ord-" + Date.now(),
    orderNumber: orderNum,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    customerPhone: payload.customerPhone.startsWith("+91") ? payload.customerPhone : "+91 " + payload.customerPhone,
    addressLine: payload.addressLine,
    city: payload.city,
    pincode: payload.pincode,
    subtotalInr: subtotal,
    status: "processing",
    createdAt: new Date().toISOString(),
    source: "product_card_quick_pay",
    items: [
      {
        name: payload.productName,
        quantity: payload.quantity,
        price: payload.unitPrice,
        size: payload.size,
        productId: payload.productId,
      },
    ],
    payment: {
      gateway: "Razorpay",
      status: "paid",
      razorpayPaymentId: paymentId,
      razorpayOrderId: orderId,
      method: payload.paymentMethod.toUpperCase(),
    },
    shipment: {
      shiprocketOrderId: "SR-" + Math.floor(100000 + Math.random() * 900000),
      status: "pickup_scheduled",
      courierName: "Blue Dart Express",
    },
  };

  if (typeof window !== "undefined") {
    try {
      const existingRaw = localStorage.getItem(ORDERS_KEY);
      const orders = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem(ORDERS_KEY, JSON.stringify([newOrder, ...orders]));
      window.dispatchEvent(new CustomEvent("mile-infinity-order-created", { detail: newOrder }));
    } catch {
      // Handled safely
    }
  }

  return newOrder;
}

export function loadRazorpaySDK(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
