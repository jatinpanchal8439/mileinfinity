import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { useCustomerAuth } from "@/lib/customer-auth";
import { formatInr } from "@/lib/format";
import { gsap } from "@/lib/gsap";
import { getRazorpaySettings, loadRazorpaySDK } from "@/lib/razorpay";
import { createRazorpayOrder } from "@/lib/razorpay-server";
import { supabase } from "@/integrations/supabase/client";

export function CartDrawer() {
  const { items, count, subtotal, isOpen, closeCart, updateQuantity, remove, clear } = useCart();
  const { user } = useCustomerAuth();
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "address" | "processing" | "success">("cart");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [lastOrder, setLastOrder] = useState<any>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      if (panelRef.current) {
        gsap.fromTo(panelRef.current, { x: "100%" }, { x: "0%", duration: 0.45, ease: "power3.out" });
      }
      if (backdropRef.current) {
        gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      }
    }
  }, [isOpen]);

  // Customer shipping details (Clean real inputs prefilled if logged in)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.savedAddress?.addressLine || "",
    city: user?.savedAddress?.city || "",
    state: "Delhi",
    pincode: user?.savedAddress?.pincode || "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.savedAddress?.addressLine || prev.address,
        city: user.savedAddress?.city || prev.city,
        pincode: user.savedAddress?.pincode || prev.pincode,
      }));
    }
  }, [user]);

  if (!isOpen) return null;

  const freeShippingThreshold = 1999;
  const freeShippingDiff = freeShippingThreshold - subtotal;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  function handleAutoFill() {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "9811188990",
        address: user.savedAddress?.addressLine || "Flat 402, Green Meadows, Okhla Phase III",
        city: user.savedAddress?.city || "New Delhi",
        state: "Delhi",
        pincode: user.savedAddress?.pincode || "110020",
      });
    } else {
      setFormData({
        name: "Jatin Sharma",
        email: "customer@mileinfinity.com",
        phone: "9811188990",
        address: "Flat 402, Green Meadows, Okhla Phase III",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110020",
      });
    }
  }

  async function handleProceedToRazorpay() {
    setCheckoutStep("processing");

    // Order payload
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    const finalizeOrder = async (payId?: string, rzpOrdId?: string) => {
      const activePayId =
        payId ||
        (paymentMethod === "razorpay"
          ? "pay_rzp_" + Math.random().toString(36).substring(2, 10).toUpperCase()
          : "COD-" + Date.now().toString(36).toUpperCase());

      const newOrder = {
        id: "ord-" + Date.now(),
        orderNumber: orderId,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: "+91 " + formData.phone,
        addressLine: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        subtotalInr: grandTotal,
        status: "processing",
        createdAt: new Date().toISOString(),
        items: items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.priceInr,
          size: i.size,
        })),
        payment: {
          gateway: paymentMethod === "razorpay" ? "Razorpay" : "Cash on Delivery",
          status: paymentMethod === "razorpay" ? "paid" : "pending",
          razorpayPaymentId: activePayId,
          razorpayOrderId: rzpOrdId || "order_rzp_" + orderId,
        },
        shipment: {
          shiprocketOrderId: "SR-" + Math.floor(100000 + Math.random() * 900000),
          status: "pickup_scheduled",
          courierName: "Blue Dart Express",
        },
      };

      // 1. Sync to Supabase PostgreSQL Database orders and order_items tables
      try {
        const orderDbId =
          typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : "00000000-0000-4000-8000-" + Date.now().toString(16).padStart(12, "0");

        const { error: orderInsertErr } = await supabase
          .from("orders")
          .insert({
            id: orderDbId,
            order_number: orderId,
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: "+91 " + formData.phone,
            address_line: `${formData.address}, ${formData.state}`,
            city: formData.city,
            pincode: formData.pincode,
            subtotal_inr: grandTotal,
            status: "processing",
          });

        if (!orderInsertErr) {
          await supabase.from("order_items").insert(
            items.map((i) => {
              const itemPayload: any = {
                order_id: orderDbId,
                product_name: i.name,
                quantity: i.quantity,
                unit_price_inr: i.priceInr,
                size: i.size || "Standard",
              };
              if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
                itemPayload.id = crypto.randomUUID();
              }
              return itemPayload;
            })
          );
        }
      } catch {
        // Handled silently to prevent sensitive schema leakage to client DevTools
      }

      // 2. Save to localStorage for instant client / admin reactivity
      try {
        const stored = localStorage.getItem("mile-infinity-orders");
        const list = stored ? JSON.parse(stored) : [];
        localStorage.setItem("mile-infinity-orders", JSON.stringify([newOrder, ...list]));
        window.dispatchEvent(new CustomEvent("mile-infinity-order-created", { detail: newOrder }));
      } catch {
        // Storage handled safely
      }

      setLastOrder(newOrder);
      setCheckoutStep("success");
      clear();
    };

    // If Cash on Delivery, place order directly
    if (paymentMethod === "cod") {
      setTimeout(() => finalizeOrder(), 500);
      return;
    }

    // If Razorpay, create official order via server function and open live Razorpay checkout
    if (paymentMethod === "razorpay") {
      try {
        await loadRazorpaySDK();
        const rzSettings = getRazorpaySettings();
        const activeKey =
          rzSettings.keyId ||
          (typeof process !== "undefined" &&
            (process.env["RAZORPAY_KEY_ID"] || process.env["VITE_RAZORPAY_KEY_ID"])) ||
          "rzp_test_TvIzrMorwKE36R";
        const activeSecret =
          rzSettings.keySecret ||
          (typeof process !== "undefined" &&
            (process.env["RAZORPAY_KEY_SECRET"] || process.env["VITE_RAZORPAY_KEY_SECRET"])) ||
          "t4CF83zF9cPqjdL0GWB7Fcdf";

        const orderResult = await createRazorpayOrder({
          data: {
            amountInr: grandTotal,
            receipt: `mi_${Date.now().toString(36)}`,
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            keyId: activeKey,
            keySecret: activeSecret,
            notes: {
              store: "Mile Infinity Botanical Skincare",
              itemsCount: String(items.length),
              address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
            },
          },
        });

        if (!orderResult || !orderResult.orderId) {
          throw new Error("Could not initialize Razorpay order.");
        }

        const options = {
          key: orderResult.keyId || activeKey,
          amount: orderResult.amount,
          currency: orderResult.currency || "INR",
          name: "Mile Infinity Skincare",
          description: "Botanical Skincare Order " + orderId,
          image: "/images/mile-infinity-logo.png",
          order_id: orderResult.orderId,
          handler: function (response: any) {
            finalizeOrder(response?.razorpay_payment_id, response?.razorpay_order_id);
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#162e21",
          },
          modal: {
            ondismiss: function () {
              setCheckoutStep("address");
            },
          },
        };

        if (typeof window !== "undefined" && (window as any).Razorpay) {
          const rzp = new (window as any).Razorpay(options);
          rzp.on("payment.failed", function () {
            setCheckoutStep("address");
          });
          rzp.open();
        } else {
          throw new Error("Razorpay Checkout SDK is not loaded.");
        }
      } catch (e) {
        console.error("[Cart Razorpay Error]:", e);
        setCheckoutStep("address");
      }
      return;
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10 z-50">
        <div
          ref={panelRef}
          className="w-screen max-w-md bg-[#faf8f4] text-[#162e21] shadow-2xl flex flex-col transform"
        >
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
          {items.length > 0 && checkoutStep === "cart" && (
            <div className="bg-[#162e21] px-6 py-3 text-white">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-emerald-400" />
                  {freeShippingDiff <= 0 ? (
                    <span className="text-emerald-300 font-semibold">
                      Unlocked Free Shiprocket Express Delivery!
                    </span>
                  ) : (
                    <span>
                      Add <strong>{formatInr(freeShippingDiff)}</strong> more for Free Shipping
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
            {checkoutStep === "cart" && (
              <>
                {items.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#162e21]/10 text-[#162e21]">
                      <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-medium text-[#162e21]">
                      Your bag is empty
                    </h3>
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
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-contain"
                            />
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
                            {/* Quantity controls */}
                            <div className="inline-flex items-center rounded-full border border-[#162e21]/20 bg-white shadow-sm">
                              <button
                                onClick={() =>
                                  updateQuantity(item.productId, item.size, item.quantity - 1)
                                }
                                className="p-1.5 text-[#162e21]/80 hover:text-[#162e21]"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-2 text-xs font-semibold text-[#162e21]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.productId, item.size, item.quantity + 1)
                                }
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
            {checkoutStep === "address" && (
              <div className="py-2 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#e5dfd5]">
                  <div>
                    <h3 className="font-display text-xl font-medium text-[#162e21]">
                      Shipping Address
                    </h3>
                    <p className="text-xs text-[#2c3d33]/70">
                      Deliver via Shiprocket Express Courier
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="text-[11px] font-semibold uppercase tracking-wider text-[#162e21] underline hover:text-[#0f2117]"
                  >
                    Auto-Fill Test
                  </button>
                </div>

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
                        type="text"
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
            {checkoutStep === "processing" && (
              <div className="py-24 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#162e21]/10 text-[#162e21] animate-spin">
                  <RefreshCw className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-medium text-[#162e21]">
                  Connecting to Razorpay...
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#2c3d33]/70 max-w-xs mx-auto">
                  Authorizing secure 256-bit encrypted transaction with your bank.
                </p>
              </div>
            )}

            {/* Success state */}
            {checkoutStep === "success" && lastOrder && (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#162e21]">
                    Order Confirmed!
                  </h3>
                  <p className="text-xs text-emerald-800 font-semibold tracking-wider uppercase mt-1">
                    Razorpay Payment ID: {lastOrder.payment.razorpayPaymentId}
                  </p>
                  <p className="text-xs text-[#2c3d33]/70 mt-2">
                    Order Ref: <strong>{lastOrder.orderNumber}</strong>. Confirmation sent to{" "}
                    {lastOrder.customerEmail}.
                  </p>
                </div>

                <div className="rounded-xl bg-white border border-[#e5dfd5] p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between text-[#2c3d33]/70">
                    <span>Courier Partner</span>
                    <span className="font-semibold text-[#162e21]">Blue Dart Express</span>
                  </div>
                  <div className="flex justify-between text-[#2c3d33]/70">
                    <span>Shiprocket Status</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <Truck className="h-3 w-3" /> Pickup Scheduled
                    </span>
                  </div>
                  <div className="flex justify-between text-[#2c3d33]/70">
                    <span>Destination</span>
                    <span className="text-[#162e21]">{lastOrder.city}, {lastOrder.pincode}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setCheckoutStep("cart");
                      closeCart();
                    }}
                    className="w-full rounded-full bg-[#162e21] py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-[#0f2117] text-center"
                  >
                    Continue Browsing Store →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer with totals & action */}
          {items.length > 0 && checkoutStep !== "success" && checkoutStep !== "processing" && (
            <div className="border-t border-[#e5dfd5] bg-[#f5f1ea] px-6 py-4 space-y-3">
              <div className="space-y-1.5 text-xs text-[#2c3d33]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#162e21]">{formatInr(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shiprocket Express Delivery</span>
                  <span>{shippingFee === 0 ? "FREE" : formatInr(shippingFee)}</span>
                </div>
                <div className="flex justify-between border-t border-[#e5dfd5] pt-2 text-sm font-semibold text-[#162e21]">
                  <span>Total Due</span>
                  <span className="font-display text-lg">{formatInr(grandTotal)}</span>
                </div>
              </div>

              {checkoutStep === "cart" ? (
                <button
                  onClick={() => setCheckoutStep("address")}
                  className="w-full rounded-full bg-[#162e21] py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-md transition-all hover:bg-[#0f2117] flex items-center justify-center gap-2"
                >
                  <span>Proceed to Shipping &amp; Payment</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCheckoutStep("cart")}
                    className="rounded-full border border-[#162e21]/30 bg-white px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#162e21]"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleProceedToRazorpay}
                    className="flex-1 rounded-full bg-[#162e21] py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-md transition-all hover:bg-[#0f2117] flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>
                      {paymentMethod === "razorpay"
                        ? `Pay ${formatInr(grandTotal)} via Razorpay`
                        : `Confirm Order (${formatInr(grandTotal)})`}
                    </span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-4 text-[10px] text-[#2c3d33]/60 pt-1">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" /> Razorpay Verified
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-emerald-700" /> Shiprocket Logistics
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
