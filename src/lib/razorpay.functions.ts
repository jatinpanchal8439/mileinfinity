import { createServerFn } from "@tanstack/react-start";

const RAZORPAY_API = "https://api.razorpay.com/v1";

function getCredentials() {
  const keyId = process.env["RAZORPAY_KEY_ID"];
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay is not configured yet. Add your Razorpay Key ID and Key Secret to enable online payments.",
    );
  }
  return { keyId, keySecret };
}

export interface RazorpayOrderResult {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
}

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator((input: { amountInr: number }) => input)
  .handler(async ({ data }): Promise<RazorpayOrderResult> => {
    if (!Number.isFinite(data.amountInr) || data.amountInr <= 0) {
      throw new Error("Invalid order amount");
    }
    const { keyId, keySecret } = getCredentials();
    const auth = btoa(`${keyId}:${keySecret}`);
    const res = await fetch(`${RAZORPAY_API}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(data.amountInr * 100),
        currency: "INR",
        receipt: `mi-${Date.now().toString(36)}`,
        payment_capture: 1,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Razorpay order creation failed:", res.status, detail);
      throw new Error("Could not start the payment. Please try again.");
    }
    const order = (await res.json()) as { id: string; amount: number; currency: string };
    return { keyId, orderId: order.id, amount: order.amount, currency: order.currency };
  });

export interface VerifyRazorpayInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: { productId: string; size: string; quantity: number }[];
  shippingFeeInr: number;
}

async function verifySignature(orderId: string, paymentId: string, signature: string, keySecret: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(keySecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(`${orderId}|${paymentId}`));
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return expected === signature;
}

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator((input: VerifyRazorpayInput) => input)
  .handler(async ({ data }): Promise<{ orderNumber: string }> => {
    const { keySecret } = getCredentials();
    const valid = await verifySignature(
      data.razorpayOrderId,
      data.razorpayPaymentId,
      data.razorpaySignature,
      keySecret,
    );
    if (!valid) throw new Error("Payment verification failed. Please contact support.");

    // Signature is verified against the Key Secret — safe to use the privileged client now.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ids = [...new Set(data.items.map((i) => i.productId))];
    if (ids.length === 0) throw new Error("Your bag is empty");
    const { data: products, error: pErr } = await supabaseAdmin
      .from("products")
      .select("id, name, price_inr, is_active")
      .in("id", ids);
    if (pErr || !products) throw new Error("Could not verify products");
    const byId = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const lines = data.items.map((item) => {
      const p = byId.get(item.productId);
      if (!p || !p.is_active) throw new Error("A product in your bag is no longer available");
      const lineTotal = p.price_inr * item.quantity;
      subtotal += lineTotal;
      return {
        product_id: p.id,
        product_name: p.name,
        size: item.size,
        quantity: item.quantity,
        unit_price_inr: p.price_inr,
      };
    });

    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    const stamp = Date.now().toString(36).slice(-4).toUpperCase();
    const orderNumber = `MI-${stamp}${rand}`;

    const { data: order, error: oErr } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: data.customer.name,
        customer_email: data.customer.email,
        customer_phone: data.customer.phone,
        address_line: data.customer.state
          ? `${data.customer.addressLine}, ${data.customer.state}`
          : data.customer.addressLine,
        city: data.customer.city,
        pincode: data.customer.pincode,
        subtotal_inr: subtotal + data.shippingFeeInr,
        status: "processing",
      })
      .select("id")
      .single();
    if (oErr || !order) throw new Error("Could not save the order");

    const { error: iErr } = await supabaseAdmin
      .from("order_items")
      .insert(lines.map((l) => ({ ...l, order_id: order.id })));
    if (iErr) throw new Error("Could not save the order items");

    return { orderNumber };
  });
