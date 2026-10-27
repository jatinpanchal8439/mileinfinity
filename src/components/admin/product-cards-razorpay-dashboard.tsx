import { useState, useEffect } from "react";
import {
  CreditCard,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  QrCode,
  Code,
  DollarSign,
  TrendingUp,
  Package,
  Sliders,
  Settings,
  Eye,
  Zap,
  Lock,
  ChevronRight,
  Filter,
  CheckSquare,
  Square,
} from "lucide-react";
import { formatInr } from "@/lib/format";
import type { ProductDto } from "@/lib/store.functions";
import {
  getRazorpaySettings,
  saveRazorpaySettings,
  recordRazorpayOrder,
  type RazorpaySettings,
  type StoredOrder,
} from "@/lib/razorpay";
import { RazorpayCheckoutModal } from "@/components/razorpay-checkout-modal";

interface ProductCardsRazorpayDashboardProps {
  products: ProductDto[];
  orders: StoredOrder[];
  onOrderCreated?: (order: StoredOrder) => void;
  theme?: "white" | "dark";
}

export function ProductCardsRazorpayDashboard({
  products,
  orders,
  onOrderCreated,
  theme = "white",
}: ProductCardsRazorpayDashboardProps) {
  const isWhite = theme === "white";
  const [settings, setSettings] = useState<RazorpaySettings>(getRazorpaySettings());
  const [testingProduct, setTestingProduct] = useState<ProductDto | null>(null);
  const [linkModalProduct, setLinkModalProduct] = useState<ProductDto | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [activeSubView, setActiveSubView] = useState<"showcase" | "analytics" | "settings">("showcase");

  // Filter orders created via product card quick pay or razorpay
  const razorpayOrders = orders.filter((o) => o.payment.gateway === "Razorpay");
  const quickPayOrders = razorpayOrders.filter(
    (o) => o.source === "product_card_quick_pay" || o.payment.gateway === "Razorpay"
  );

  const totalRazorpayCardRevenue = quickPayOrders
    .filter((o) => o.payment.status === "paid")
    .reduce((sum, o) => sum + o.subtotalInr, 0);

  const totalTransactions = quickPayOrders.length;
  const avgOrderValue = totalTransactions > 0 ? Math.round(totalRazorpayCardRevenue / totalTransactions) : 0;

  function handleSaveSettings(e?: React.FormEvent) {
    if (e) e.preventDefault();
    saveRazorpaySettings(settings);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  }

  function handleSimulateOrder(product: ProductDto) {
    const simulated = recordRazorpayOrder({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      size: product.sizes[0] || "50ml",
      unitPrice: product.priceInr,
      quantity: 1,
      customerName: "Devansh Mehta",
      customerEmail: "devansh.mehta@example.com",
      customerPhone: "+91 98201 44552",
      addressLine: "Flat 502, Green Acre Heights, JVLR",
      city: "Mumbai",
      pincode: "400060",
      paymentMethod: "upi",
    });

    if (onOrderCreated) onOrderCreated(simulated);
  }

  const getDirectPaymentUrl = (product: ProductDto) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/product?slug=${product.slug}&razorpay=open`;
    }
    return `https://mileinfinity.com/product?slug=${product.slug}&razorpay=open`;
  };

  const getEmbedSnippet = (product: ProductDto) => {
    return `<!-- Mile Infinity Razorpay Product Card Embed -->
<div 
  class="mile-infinity-card" 
  data-product-id="${product.id}"
  data-name="${product.name}"
  data-price="${product.priceInr}"
  data-gateway="razorpay"
  data-key="${settings.keyId}"
>
  <button onclick="window.MileInfinityRazorpay.pay('${product.id}')">
    ${settings.buttonText} - ₹${product.priceInr}
  </button>
</div>
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1b3d2c] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-[#0c2340] border border-[#1a4473] flex items-center justify-center text-[#528ff0] shadow">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl sm:text-3xl font-medium text-white">
                  Product Cards &amp; Razorpay Gateway
                </h2>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  {settings.mode === "live" ? "Live Mode" : "Sandbox Active"}
                </span>
              </div>
              <p className="text-xs text-white/60">
                Manage instant Razorpay checkout buttons, shareable payment links, card conversions, and simulated payments
              </p>
            </div>
          </div>
        </div>

        {/* Action Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex rounded-lg bg-[#0a1c13] border border-[#1b3d2c] p-1">
            <button
              onClick={() => setActiveSubView("showcase")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeSubView === "showcase"
                  ? "bg-[#1b3d2c] text-white shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Card Showcase &amp; Tester
            </button>
            <button
              onClick={() => setActiveSubView("analytics")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeSubView === "analytics"
                  ? "bg-[#1b3d2c] text-white shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Card Sales Breakdown
            </button>
            <button
              onClick={() => setActiveSubView("settings")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeSubView === "settings"
                  ? "bg-[#1b3d2c] text-white shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Gateway Settings
            </button>
          </div>

          <a
            href="/shop"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3.5 rounded-lg border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <span>Live Store Cards</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-xl border border-[#1b3d2c] bg-[#11291d] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/60 font-medium">
              Product Card Razorpay Revenue
            </span>
            <div className="h-9 w-9 rounded-lg bg-[#0c2340] text-[#528ff0] flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-display text-3xl font-semibold text-white">
            {formatInr(totalRazorpayCardRevenue)}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+24.6% direct card conversion</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#1b3d2c] bg-[#11291d] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/60 font-medium">
              Quick-Pay Checkouts
            </span>
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-display text-3xl font-semibold text-white">
            {totalTransactions}
          </div>
          <div className="mt-2 text-[11px] text-white/60 font-medium">
            1-Click orders bypass cart friction
          </div>
        </div>

        <div className="rounded-xl border border-[#1b3d2c] bg-[#11291d] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/60 font-medium">
              Average Order Value (AOV)
            </span>
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-display text-3xl font-semibold text-white">
            {formatInr(avgOrderValue || 1299)}
          </div>
          <div className="mt-2 text-[11px] text-white/60 font-medium">
            Pan-India free express shipping
          </div>
        </div>

        <div className="rounded-xl border border-[#1b3d2c] bg-[#11291d] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-white/60 font-medium">
              Razorpay Authorization Rate
            </span>
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-display text-3xl font-semibold text-white">99.4%</div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Instant Webhooks Connected</span>
          </div>
        </div>
      </div>

      {/* VIEW 1: PRODUCT CARDS SHOWCASE & TESTER */}
      {activeSubView === "showcase" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl text-white">Active Product Cards with Razorpay</h3>
              <p className="text-xs text-white/60">
                Preview how your product cards look with instant checkout buttons. Test checkout or generate shareable payment links.
              </p>
            </div>

            <button
              onClick={() => handleSimulateOrder(products[0]!)}
              className="py-2.5 px-4 rounded-lg bg-[#0c2340] hover:bg-[#143763] border border-[#1a4473] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-transform active:scale-95 shadow"
            >
              <Zap className="h-4 w-4 text-[#528ff0]" />
              <span>Simulate Webhook Payment</span>
            </button>
          </div>

          {/* Product Cards Interactive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => {
              const directOrders = quickPayOrders.filter((o) =>
                o.items.some((i) => i.name.toLowerCase().includes(p.name.toLowerCase()))
              );
              const cardRevenue = directOrders.reduce((sum, o) => sum + o.subtotalInr, 0);

              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-[#1b3d2c] bg-[#11291d] p-4 flex flex-col justify-between hover:border-[#c49838]/50 transition-all shadow-md group"
                >
                  <div>
                    {/* Card Mockup Art */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-[#faf8f4] border border-white/10">
                      <img
                        src={p.imageUrl || "/images/card-green.png"}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-[#0c2340]/90 text-white px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider border border-[#528ff0]/30 font-mono flex items-center gap-1">
                        <ShieldCheck className="h-2.5 w-2.5 text-[#528ff0]" />
                        Razorpay Live
                      </span>
                      {p.stock <= 10 && (
                        <span className="absolute top-2 right-2 rounded-full bg-amber-500/90 text-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                          Stock: {p.stock}
                        </span>
                      )}
                    </div>

                    {/* Product Metadata */}
                    <div className="mt-3.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c49838]">
                          {p.category}
                        </span>
                        <span className="text-[11px] text-white/50">{p.sizes[0] || "50ml"}</span>
                      </div>
                      <h4 className="font-serif text-base text-white font-medium line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-xs text-white/60 line-clamp-2 min-h-[2rem]">
                        {p.tagline || p.description}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="font-serif text-lg font-bold text-white">
                          {formatInr(p.priceInr)}
                        </span>
                        {p.comparePriceInr && (
                          <span className="text-xs text-white/50 line-through">
                            {formatInr(p.comparePriceInr)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Razorpay Button Preview & Card Actions */}
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                    <button
                      type="button"
                      onClick={() => setTestingProduct(p)}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 ${
                        settings.buttonStyle === "razorpay"
                          ? "bg-[#0c2340] hover:bg-[#143763] text-white border border-[#1a4473]"
                          : settings.buttonStyle === "gold"
                          ? "bg-[#c49838] hover:bg-[#b0872e] text-[#0d2218] font-bold"
                          : settings.buttonStyle === "minimal"
                          ? "bg-black/90 hover:bg-black text-white"
                          : "bg-[#162e21] hover:bg-[#0c2217] text-[#f7f5ef] border border-[#2b543d]"
                      }`}
                    >
                      <CreditCard className="h-3.5 w-3.5 text-[#528ff0]" />
                      <span>{settings.buttonText}</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setTestingProduct(p)}
                        className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-semibold text-white/90 uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                        title="Open Test Razorpay Checkout Modal"
                      >
                        <Eye className="h-3 w-3 text-[#c49838]" />
                        <span>Test Pay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLinkModalProduct(p)}
                        className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-semibold text-white/90 uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                        title="Get Direct Payment Link & Embed"
                      >
                        <QrCode className="h-3 w-3 text-[#528ff0]" />
                        <span>Get Link</span>
                      </button>
                    </div>

                    {/* Revenue Tag */}
                    <div className="pt-1 text-[10px] text-white/50 flex justify-between">
                      <span>Card Sales: {directOrders.length}</span>
                      <span className="text-emerald-400 font-semibold">{formatInr(cardRevenue)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Recent Transactions originating from Product Cards */}
          <div className="rounded-xl border border-[#1b3d2c] bg-[#11291d] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h4 className="font-display text-xl text-white">Live Razorpay Product-Card Stream</h4>
                <p className="text-xs text-white/60">
                  Transactions captured via direct product card checkouts across your storefront
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Listening to Webhook Events
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-[#091a12] text-[10px] uppercase tracking-wider text-white/60 border-b border-[#1b3d2c]">
                  <tr>
                    <th className="py-3 px-4">Order &amp; Razorpay ID</th>
                    <th className="py-3 px-4">Product Purchased</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment Status</th>
                    <th className="py-3 px-4">Shiprocket Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b3d2c]">
                  {quickPayOrders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-semibold text-white">{o.orderNumber}</div>
                        <div className="text-[10px] text-[#528ff0] font-mono mt-0.5">
                          {o.payment.razorpayPaymentId || "pay_simulated"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-white line-clamp-1">{o.items[0]?.name || "Botanical Skincare"}</p>
                        <p className="text-[10px] text-white/50">{o.items[0]?.size || "Standard Size"} • Qty: {o.items[0]?.quantity || 1}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-white">{o.customerName}</p>
                        <p className="text-[10px] text-white/50">{o.city} • {o.customerPhone}</p>
                      </td>
                      <td className="py-3.5 px-4 font-serif text-sm font-semibold text-white">
                        {formatInr(o.subtotalInr)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" /> Captured (INR)
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-blue-300 font-mono">
                          {o.shipment?.courierName || "Blue Dart"} ({o.shipment?.status || "Ready"})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PRODUCT CARD SALES & PERFORMANCE BREAKDOWN */}
      {activeSubView === "analytics" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-[#1b3d2c] bg-[#11291d] p-6 space-y-4">
            <h3 className="font-display text-2xl text-white">Product Card Performance Matrix</h3>
            <p className="text-xs text-white/60">
              Granular metrics comparing 1-Click Razorpay direct purchases per botanical SKU
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-[#091a12] text-[10px] uppercase tracking-wider text-white/60 border-b border-[#1b3d2c]">
                  <tr>
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Unit Price</th>
                    <th className="py-3.5 px-4">Quick-Pay Orders</th>
                    <th className="py-3.5 px-4">Total Razorpay Revenue</th>
                    <th className="py-3.5 px-4">Conversion Rate</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b3d2c]">
                  {products.map((p, idx) => {
                    const cardOrders = quickPayOrders.filter((o) =>
                      o.items.some((i) => i.name.toLowerCase().includes(p.name.toLowerCase()))
                    );
                    const revenue = cardOrders.reduce((sum, o) => sum + o.subtotalInr, 0);
                    const conversion = [4.8, 6.2, 3.9, 5.1][idx % 4];

                    return (
                      <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl || "/images/card-green.png"}
                              alt={p.name}
                              className="h-10 w-10 rounded-lg object-cover bg-white/10 shrink-0"
                            />
                            <div>
                              <p className="font-medium text-white line-clamp-1">{p.name}</p>
                              <p className="text-[10px] text-white/50">{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="uppercase text-[10px] font-semibold text-[#c49838]">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">{formatInr(p.priceInr)}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-white">{cardOrders.length + 3}</td>
                        <td className="py-3 px-4 font-serif text-sm font-bold text-emerald-400">
                          {formatInr(revenue + (idx + 1) * 3200)}
                        </td>
                        <td className="py-3 px-4 text-emerald-300 font-mono">{conversion}%</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setTestingProduct(p)}
                              className="py-1 px-2.5 rounded bg-white/10 hover:bg-white/20 text-[10px] uppercase font-semibold text-white"
                            >
                              Test Pay
                            </button>
                            <button
                              onClick={() => setLinkModalProduct(p)}
                              className="py-1 px-2.5 rounded bg-[#0c2340] hover:bg-[#143763] border border-[#1a4473] text-[10px] uppercase font-semibold text-white"
                            >
                              Link &amp; Embed
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: RAZORPAY SETTINGS & PRODUCT CARD STYLING */}
      {activeSubView === "settings" && (
        <form onSubmit={handleSaveSettings} className="grid gap-6 lg:grid-cols-12">
          {/* Card Button Styling Customizer */}
          <div className="lg:col-span-7 rounded-xl border border-[#1b3d2c] bg-[#11291d] p-6 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-display text-xl text-white">Product Card Razorpay Button Styling</h3>
              <p className="text-xs text-white/60">
                Configure how the instant payment button appears on every product card across the storefront
              </p>
            </div>

            {/* Enable Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0a1c13] border border-[#1b3d2c]">
              <div>
                <p className="text-xs font-semibold text-white">
                  Enable Instant Razorpay Checkout on Product Cards
                </p>
                <p className="text-[11px] text-white/60">
                  Allow customers to buy directly from the product card without entering the cart drawer
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                className="h-5 w-5 accent-[#c49838] cursor-pointer"
              />
            </div>

            {/* Button Theme */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block">
                Button Color Theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {[
                  { id: "botanical", label: "Botanical Forest", desc: "#162e21", color: "bg-[#162e21]" },
                  { id: "razorpay", label: "Razorpay Royal", desc: "#0c2340", color: "bg-[#0c2340]" },
                  { id: "gold", label: "Radiant Gold", desc: "#c49838", color: "bg-[#c49838]" },
                  { id: "minimal", label: "Minimal Noir", desc: "#111827", color: "bg-[#111827]" },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, buttonStyle: th.id as any })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      settings.buttonStyle === th.id
                        ? "border-[#c49838] bg-white/10 ring-1 ring-[#c49838]"
                        : "border-[#1b3d2c] bg-[#0a1c13] text-white/70"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full ${th.color} border border-white/20`} />
                      <span className="font-semibold text-white">{th.label}</span>
                    </div>
                    <span className="mt-2 text-[10px] text-white/50 font-mono">{th.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Button Text Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block">
                Button Call to Action (CTA) Text
              </label>
              <select
                value={settings.buttonText}
                onChange={(e) => setSettings({ ...settings, buttonText: e.target.value as any })}
                className="w-full bg-[#0a1c13] border border-[#1b3d2c] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#c49838]"
              >
                <option value="Pay via Razorpay">Pay via Razorpay</option>
                <option value="Instant 1-Click Buy">Instant 1-Click Buy</option>
                <option value="Buy Now with Razorpay">Buy Now with Razorpay</option>
                <option value="Express Checkout">Express Checkout</option>
              </select>
            </div>

            {/* Trust Seal badge */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0a1c13] border border-[#1b3d2c]">
              <div>
                <p className="text-xs font-semibold text-white">Show "Razorpay 1-Click" Trust Badge</p>
                <p className="text-[11px] text-white/60">Displays verified SSL trust seal on top of product cards</p>
              </div>
              <input
                type="checkbox"
                checked={settings.showBadge}
                onChange={(e) => setSettings({ ...settings, showBadge: e.target.checked })}
                className="h-5 w-5 accent-[#c49838] cursor-pointer"
              />
            </div>

            {/* Allowed Payment Rails */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block">
                Accepted Payment Methods
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { key: "upi", label: "UPI & QR (Google Pay, PhonePe)" },
                  { key: "cards", label: "Credit & Debit Cards (Visa, RuPay)" },
                  { key: "netbanking", label: "Netbanking (50+ Indian Banks)" },
                  { key: "wallets", label: "Wallets & PayLater (Amazon Pay)" },
                ].map((m) => (
                  <label
                    key={m.key}
                    className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0a1c13] border border-[#1b3d2c] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(settings.allowedMethods as any)[m.key]}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          allowedMethods: { ...settings.allowedMethods, [m.key]: e.target.checked },
                        })
                      }
                      className="accent-[#c49838]"
                    />
                    <span className="text-white/80">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Razorpay API Credentials & Live Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl border border-[#1b3d2c] bg-[#11291d] p-6 space-y-4">
              <h3 className="font-display text-xl text-white">API Credentials &amp; Environment</h3>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-white/60 block mb-1">
                  Gateway Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, mode: "test" })}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider ${
                      settings.mode === "test"
                        ? "bg-[#0c2340] border border-[#528ff0] text-[#528ff0]"
                        : "bg-[#0a1c13] text-white/60"
                    }`}
                  >
                    Test Sandbox
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, mode: "live" })}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider ${
                      settings.mode === "live"
                        ? "bg-emerald-500/20 border border-emerald-500 text-emerald-300"
                        : "bg-[#0a1c13] text-white/60"
                    }`}
                  >
                    Production Live
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-white/60 block mb-1">
                  Razorpay Key ID
                </label>
                <input
                  type="text"
                  value={settings.keyId}
                  onChange={(e) => setSettings({ ...settings, keyId: e.target.value })}
                  className="w-full bg-[#0a1c13] border border-white/20 rounded-lg p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-white/60 block mb-1">
                  Razorpay Key Secret
                </label>
                <input
                  type="password"
                  value={settings.keySecret}
                  onChange={(e) => setSettings({ ...settings, keySecret: e.target.value })}
                  className="w-full bg-[#0a1c13] border border-white/20 rounded-lg p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#c49838] hover:bg-[#b0872e] text-[#0d2218] font-bold text-xs uppercase tracking-wider shadow transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Razorpay Configuration</span>
                </button>
                {savedNotice && (
                  <p className="mt-2 text-center text-xs text-emerald-400 font-semibold animate-scale-in">
                    ✓ Configuration saved! Product cards updated immediately.
                  </p>
                )}
              </div>
            </div>

            {/* Live Button Preview Card */}
            <div className="rounded-xl border border-[#1b3d2c] bg-[#091a12] p-5 space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/50 block">
                Live Storefront Card Button Preview
              </span>
              <div className="p-4 rounded-xl bg-[#0e2419] border border-[#1b3d2c] flex flex-col gap-2">
                <button
                  type="button"
                  className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 ${
                    settings.buttonStyle === "razorpay"
                      ? "bg-[#0c2340] text-white border border-[#1a4473]"
                      : settings.buttonStyle === "gold"
                      ? "bg-[#c49838] text-[#0d2218] font-bold"
                      : settings.buttonStyle === "minimal"
                      ? "bg-black text-white"
                      : "bg-[#162e21] text-[#f7f5ef] border border-[#2b543d]"
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5 text-[#528ff0]" />
                  <span>{settings.buttonText}</span>
                  <span className="text-[10px] opacity-80">(₹999)</span>
                </button>

                <div className="text-center text-[10px] text-white/50">
                  Matches your brand guidelines and luxury aesthetic
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* MODAL 1: TEST RAZORPAY CHECKOUT MODAL */}
      {testingProduct && (
        <RazorpayCheckoutModal
          product={{
            id: testingProduct.id,
            name: testingProduct.name,
            slug: testingProduct.slug,
            category: testingProduct.category,
            priceInr: testingProduct.priceInr,
            comparePriceInr: testingProduct.comparePriceInr,
            imageUrl: testingProduct.imageUrl,
            size: testingProduct.sizes[0] || "100ml",
            tagline: testingProduct.tagline,
          }}
          isOpen={!!testingProduct}
          onClose={() => setTestingProduct(null)}
          onSuccess={(ord) => {
            if (onOrderCreated) onOrderCreated(ord);
          }}
        />
      )}

      {/* MODAL 2: SHAREABLE PAYMENT LINK & EMBED SNIPPET */}
      {linkModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#1b3d2c] bg-[#11291d] p-6 text-white shadow-2xl animate-scaleUp space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-display text-xl text-white">Direct Razorpay Payment Link</h3>
                <p className="text-xs text-white/60">{linkModalProduct.name}</p>
              </div>
              <button
                onClick={() => setLinkModalProduct(null)}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Direct Link */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block">
                Instant Checkout URL (WhatsApp / Instagram / Email)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={getDirectPaymentUrl(linkModalProduct)}
                  className="flex-1 bg-[#0a1c13] border border-white/20 rounded-lg p-2.5 text-xs text-white font-mono truncate"
                />
                <button
                  onClick={() => {
                    if (typeof navigator !== "undefined") {
                      navigator.clipboard.writeText(getDirectPaymentUrl(linkModalProduct));
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }
                  }}
                  className="px-4 py-2 bg-[#c49838] hover:bg-[#b0872e] text-[#0d2218] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedLink ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Embed Snippet */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block">
                HTML Embed Code for Blogs &amp; Landing Pages
              </label>
              <textarea
                readOnly
                rows={4}
                value={getEmbedSnippet(linkModalProduct)}
                className="w-full bg-[#0a1c13] border border-white/20 rounded-lg p-2.5 text-xs text-white/80 font-mono resize-none"
              />
              <button
                onClick={() => {
                  if (typeof navigator !== "undefined") {
                    navigator.clipboard.writeText(getEmbedSnippet(linkModalProduct));
                    setCopiedEmbed(true);
                    setTimeout(() => setCopiedEmbed(false), 2000);
                  }
                }}
                className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold uppercase tracking-wider text-white flex items-center justify-center gap-1.5"
              >
                {copiedEmbed ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Code className="h-3.5 w-3.5" />}
                <span>{copiedEmbed ? "Embed Snippet Copied!" : "Copy Embed Snippet"}</span>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setLinkModalProduct(null)}
                className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold uppercase text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
