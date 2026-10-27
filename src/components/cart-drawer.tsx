import { useState } from "react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatInr } from "@/lib/format";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/razorpay.functions";
import { placeOrder } from "@/lib/store.functions";

type CheckoutStep = "cart" | "address" | "processing" | "success";

interface PlacedOrder {
  orderNumber: string;
  paymentId: string | null;
  method: "razorpay" | "cod";
  email: string;
  city: string;
  pincode: string;
  total: number;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CartDrawer() {
  const { items, count, subtotal, isOpen, closeCart, updateQuantity, remove, clear } = useCart();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [payError, setPayError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  if (!isOpen) return null;

  const freeShippingThreshold = 1999;
  const freeShippingDiff = freeShippingThreshold - subtotal;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  const addressComplete =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    formData.address.trim() &&
    formData.city.trim() &&
    formData.state.trim() &&
    formData.pincode.trim();

  function resetCheckout() {
    setStep("cart");
    setPayError(null);
  }

  async function handlePay() {
    if (!addressComplete) {
      setPayError("Please fill in all address fields.");
      return;
    }
    setPayError(null);
    setStep("processing");

    const customer = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      addressLine: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
    };
    const cartItems = items.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity }));

    try {
      if (paymentMethod === "cod") {
        const res = await placeOrder({
          data: { customer, items: cartItems, shippingFeeInr: shippingFee, paymentMethod: "cod" },
        });
        setPlacedOrder({
          orderNumber: res.orderNumber,
          paymentId: null,
          method: "cod",
          email: customer.email,
          city: customer.city,
          pincode: customer.pincode,
          total: grandTotal,
        });
        clear();
        setStep("success");
        return;
      }

      const rzpOrder = await createRazorpayOrder({ data: { amountInr: grandTotal } });
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Could not load the payment gateway. Check your connection and try again.");

      const rzp = new window.Razorpay!({
        key: rzpOrder.keyId,
        order_id: rzpOrder.orderId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Mile Infinity",
        description: "Botanical skincare order",
        image: "/images/mile-infinity-logo.png",
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: { color: "#162e21" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verified = await verifyRazorpayPayment({
              data: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                customer,
                items: cartItems,
                shippingFeeInr: shippingFee,
              },
            });
            setPlacedOrder({
              orderNumber: verified.orderNumber,
              paymentId: response.razorpay_payment_id,
              method: "razorpay",
              email: customer.email,
              city: customer.city,
              pincode: customer.pincode,
              total: grandTotal,
            });
            clear();
            setStep("success");
          } catch (err) {
            setPayError(err instanceof Error ? err.message : "Payment could not be verified.");
            setStep("address");
          }
        },
        modal: {
          ondismiss: () => {
            setPayError("Payment cancelled. Your bag is saved — try again whenever you're ready.");
            setStep("address");
          },
        },
      });
      rzp.open();
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStep("address");
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10 z-50">
        <div className="w-screen max-w-md bg-[#faf8f4] text-[#162e21] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e5dfd5] px-6 py-5 bg-[#f5f1ea]">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-[#162e21]" />
              <h2 className="font-display text-xl font-medium tracking-tight text-[#162e21]">
                Your Skincare Bag ({count})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-full text-[#162e21]/70 hover:text-[#162e21] hover:bg-black/5 transition-colors"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free Shipping Bar */}
          {items.length > 0 && step === "cart" && (
            <div className="bg-[#162e21] px-6 py-3 text-white">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-emerald-400" />
                  {freeShippingDiff <= 0 ? (
                    <span className="text-emerald-300 font-semibold">You've unlocked free express delivery!</span>
                  ) : (
                    <span>
                      Add <strong>{formatInr(freeShippingDiff)}</strong> more for free shipping
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-white/70">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {step === "cart" && (
              <>
                {items.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#162e21]/10 text-[#162e21]">
                      <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-medium text-[#162e21]">Your bag is empty</h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#2c3d33]/70 max-w-xs mx-auto">
                      Explore our botanical formulas to begin your daily skincare ritual.
                    </p>
                    <button
                      onClick={closeCart}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#162e21] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-[#0f2117]"
                    >
                      <span>Shop The Formulas</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#e5dfd5]">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.size}`} className="flex gap-4 py-4">
                        {item.imageUrl ? (
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white border border-[#e5dfd5] p-1 flex items-center justify-center">
                            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-contain" />
                          </div>
                        ) : (
                          <div className="h-20 w-20 shrink-0 rounded-xl bg-[#162e21]/10 flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-[#162e21]/50" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-medium text-[#162e21] leading-snug line-clamp-2">
                                {item.name}
                              </h4>
                              <button
                                onClick={() => remove(item.productId, item.size)}
                                className="text-[#2c3d33]/50 hover:text-rose-600 transition-colors p-0.5"
                                title="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <span className="mt-1 inline-block text-[11px] font-medium text-[#2c3d33]/70 bg-black/5 px-2 py-0.5 rounded">
                              {item.size}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="inline-flex items-center rounded-full border border-[#162e21]/20 bg-white shadow-sm">
                              <button
                                onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                                className="p-1.5 text-[#162e21]/80 hover:text-[#162e21]"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-2 text-xs font-semibold text-[#162e21]">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                                className="p-1.5 text-[#162e21]/80 hover:text-[#162e21]"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <span className="font-display text-base font-semibold text-[#162e21]">
                              {formatInr(item.priceInr * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Address Step */}
            {step === "address" && (
              <div className="py-2 space-y-4">
                <div className="pb-2 border-b border-[#e5dfd5]">
                  <h3 className="font-display text-xl font-medium text-[#162e21]">Delivery Details</h3>
                  <p className="text-xs text-[#2c3d33]/70">Where should we send your ritual?</p>
                </div>

                {payError && (
                  <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{payError}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#2c3d33]/80">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-[#e5dfd5] bg-white px-3.5 py-2 text-xs text-[#162e21] focus:border-[#162e21] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#2c3d33]/80">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-[#e5dfd5] bg-white px-3.5 py-2 text-xs text-[#162e21] focus:border-[#162e21] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#2c3d33]/80">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-[#e5dfd5] bg-white px-3.5 py-2 text-xs text-[#162e21] focus:border-[#162e21] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#2c3d33]/80">
                      Address (Flat / Building / Street) *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-[#e5dfd5] bg-white px-3.5 py-2 text-xs text-[#162e21] focus:border-[#162e21] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#2c3d33]/80">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-[#e5dfd5] bg-white px-3 py-2 text-xs text-[#162e21] focus:border-[#162e21] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#2c3d33]/80">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-[#e5dfd5] bg-white px-3 py-2 text-xs text-[#162e21] focus:border-[#162e21] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#2c3d33]/80">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-[#e5dfd5] bg-white px-3 py-2 text-xs text-[#162e21] focus:border-[#162e21] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-3">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#2c3d33]/80 block mb-2">
                      Payment Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("razorpay")}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                          paymentMethod === "razorpay"
                            ? "border-[#162e21] bg-[#162e21]/5 text-[#162e21]"
                            : "border-[#e5dfd5] bg-white text-[#2c3d33]/70"
                        }`}
                      >
                        <CreditCard className="h-4 w-4 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">Razorpay</p>
                          <p className="text-[10px] text-[#2c3d33]/60">UPI, Cards, NetBanking</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                          paymentMethod === "cod"
                            ? "border-[#162e21] bg-[#162e21]/5 text-[#162e21]"
                            : "border-[#e5dfd5] bg-white text-[#2c3d33]/70"
                        }`}
                      >
                        <Truck className="h-4 w-4 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold">Cash On Delivery</p>
                          <p className="text-[10px] text-[#2c3d33]/60">Pay at Doorstep</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Processing state */}
            {step === "processing" && (
              <div className="py-24 text-center">
                <Loader2 className="mx-auto h-10 w-10 text-[#162e21] animate-spin" />
                <h3 className="mt-6 font-display text-2xl font-medium text-[#162e21]">
                  {paymentMethod === "razorpay" ? "Connecting to Razorpay..." : "Placing your order..."}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#2c3d33]/70 max-w-xs mx-auto">
                  Complete the payment in the secure Razorpay window to confirm your order.
                </p>
              </div>
            )}

            {/* Success state */}
            {step === "success" && placedOrder && (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#162e21]">Order Confirmed!</h3>
                  <p className="text-xs text-emerald-800 font-semibold tracking-wider uppercase mt-1">
                    {placedOrder.method === "razorpay"
                      ? `Razorpay Payment ID: ${placedOrder.paymentId}`
                      : "Cash on Delivery — pay when it arrives"}
                  </p>
                  <p className="text-xs text-[#2c3d33]/70 mt-2">
                    Order Ref: <strong>{placedOrder.orderNumber}</strong>.{" "}
                    {placedOrder.method === "razorpay"
                      ? `Confirmation sent to ${placedOrder.email}.`
                      : `We'll reach out on your phone before delivery.`}
                  </p>
                </div>

                <div className="rounded-xl bg-white border border-[#e5dfd5] p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between text-[#2c3d33]/70">
                    <span>Amount Paid / Payable</span>
                    <span className="font-semibold text-[#162e21]">{formatInr(placedOrder.total)}</span>
                  </div>
                  <div className="flex justify-between text-[#2c3d33]/70">
                    <span>Payment Method</span>
                    <span className="font-semibold text-[#162e21]">
                      {placedOrder.method === "razorpay" ? "Razorpay (UPI / Card / NetBanking)" : "Cash on Delivery"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#2c3d33]/70">
                    <span>Delivering To</span>
                    <span className="text-[#162e21]">
                      {placedOrder.city}, {placedOrder.pincode}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      resetCheckout();
                      closeCart();
                    }}
                    className="w-full py-3 rounded-full bg-[#162e21] hover:bg-[#0f2117] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <p className="text-[11px] text-[#2c3d33]/60 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" /> Secured by Razorpay · 256-bit encryption
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer totals + CTA */}
          {step !== "success" && (
            <div className="border-t border-[#e5dfd5] bg-[#f5f1ea] px-6 py-5 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#2c3d33]/80">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#162e21]">{formatInr(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#2c3d33]/80">
                  <span>Shipping</span>
                  <span className="font-medium text-[#162e21]">{shippingFee === 0 ? "Free" : formatInr(shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#e5dfd5]">
                  <span className="font-display text-base font-medium text-[#162e21]">Total</span>
                  <span className="font-display text-lg font-semibold text-[#162e21]">{formatInr(grandTotal)}</span>
                </div>
              </div>

              {step === "cart" ? (
                <button
                  onClick={() => {
                    setPayError(null);
                    setStep("address");
                  }}
                  disabled={items.length === 0}
                  className="w-full py-3.5 rounded-full bg-[#162e21] hover:bg-[#0f2117] disabled:opacity-40 text-white text-xs font-semibold uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : step === "address" ? (
                <button
                  onClick={handlePay}
                  disabled={!addressComplete}
                  className="w-full py-3.5 rounded-full bg-[#162e21] hover:bg-[#0f2117] disabled:opacity-40 text-white text-xs font-semibold uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2"
                >
                  {paymentMethod === "razorpay" ? <ShieldCheck className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
                  <span>
                    {paymentMethod === "razorpay" ? `Pay ${formatInr(grandTotal)} with Razorpay` : "Place COD Order"}
                  </span>
                </button>
              ) : null}

              {step === "address" && (
                <button
                  onClick={resetCheckout}
                  className="w-full text-center text-[11px] font-medium text-[#2c3d33]/70 hover:text-[#162e21] transition-colors"
                >
                  ← Back to bag
                </button>
              )}

              {step === "cart" && (
                <p className="text-[11px] text-[#2c3d33]/60 flex items-center justify-center gap-1.5">
                  <RefreshCw className="h-3 w-3" /> Free shipping over {formatInr(freeShippingThreshold)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
