import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Truck,
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Eye,
  Check,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { formatInr } from "@/lib/format";
import logoImg from "@/assets/mile-infinity-logo.png";
import type { ProductDto } from "@/lib/store.functions";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
  head: () => ({
    title: "Mile Infinity — Commerce & Logistics Admin Panel",
    meta: [
      {
        name: "description",
        content: "Admin dashboard for Mile Infinity products, orders, Razorpay payments, and Shiprocket logistics.",
      },
    ],
  }),
});

interface AdminOrder {
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
  items: { name: string; quantity: number; price: number; size: string }[];
  payment: {
    gateway: "Razorpay" | "COD";
    status: "paid" | "pending" | "failed";
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
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

const INITIAL_PRODUCTS: ProductDto[] = [
  {
    id: "prod-1",
    name: "Mile Infinity Crimson Beauty Beetroot Facewash",
    slug: "crimson-beauty-beetroot-facewash",
    tagline: "With AHA, BHA & Mulberry for gentle daily cleansing",
    description: "Formulated with pure beetroot extract, AHAs and mulberries to purify and revitalize.",
    category: "cleanse",
    priceInr: 999,
    comparePriceInr: 1199,
    imageUrl: "/images/card-beetroot.png",
    sizes: ["100ml"],
    isNew: true,
    stock: 45,
  },
  {
    id: "prod-2",
    name: "Mile Infinity Ceremonial Green Fusion Serum",
    slug: "ceremonial-green-fusion-serum",
    tagline: "With White Tea, Green Tea & Avocado for barrier repair",
    description: "An antioxidant-rich ceremonial green serum that soothes redness and restores natural moisture.",
    category: "serum",
    priceInr: 1599,
    comparePriceInr: 1899,
    imageUrl: "/images/card-green.png",
    sizes: ["30ml"],
    isNew: true,
    stock: 32,
  },
  {
    id: "prod-3",
    name: "Mile Infinity Blue Berry & Lavender Bliss Moisturiser",
    slug: "blueberry-lavender-bliss-moisturiser",
    tagline: "Whipped barrier cream with antioxidant blueberry & soothing wild lavender",
    description: "Deeply seals in hydration, calming sensitive skin with a velvet satin finish.",
    category: "moisturizer",
    priceInr: 1099,
    comparePriceInr: 1399,
    imageUrl: "/images/product-blueberry.png",
    sizes: ["50ml"],
    isNew: false,
    stock: 28,
  },
  {
    id: "prod-4",
    name: "Mile Infinity Sunnykiss Radiance SPF 50 Sunscreen",
    slug: "sunnykiss-radiance-spf-sunscreen",
    tagline: "Broad spectrum UVA/UVB protection with no white cast finish",
    description: "A lightweight daily mineral-hybrid sunscreen giving natural dewy radiance.",
    category: "sunscreen",
    priceInr: 1299,
    comparePriceInr: 1599,
    imageUrl: "/images/product-sunscreen.png",
    sizes: ["100ml"],
    isNew: false,
    stock: 50,
  },
];

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "ord-101",
    orderNumber: "MI-9482A1",
    customerName: "Aarav Sharma",
    customerEmail: "aarav.sharma@example.com",
    customerPhone: "+91 98765 43210",
    addressLine: "Flat 402, Lotus Towers, Indiranagar",
    city: "Bengaluru",
    pincode: "560038",
    subtotalInr: 2598,
    status: "shipped",
    createdAt: "2026-10-23T09:30:00Z",
    items: [
      { name: "Mile Infinity Crimson Beauty Beetroot Facewash", quantity: 1, price: 999, size: "100ml" },
      { name: "Mile Infinity Ceremonial Green Fusion Serum", quantity: 1, price: 1599, size: "30ml" },
    ],
    payment: {
      gateway: "Razorpay",
      status: "paid",
      razorpayPaymentId: "pay_Qk92Lz8P1m0sKa",
      razorpayOrderId: "order_Qk91Ks72Pn19",
    },
    shipment: {
      shiprocketOrderId: "SR-849102",
      shipmentId: "SHP-910283",
      awbCode: "BLUEDART-849201948",
      courierName: "Blue Dart Express",
      status: "in_transit",
      labelUrl: "#",
    },
  },
  {
    id: "ord-102",
    orderNumber: "MI-8812B7",
    customerName: "Priya Nair",
    customerEmail: "priya.nair@example.com",
    customerPhone: "+91 98112 33445",
    addressLine: "12B, Marine Drive Villa",
    city: "Mumbai",
    pincode: "400020",
    subtotalInr: 1599,
    status: "processing",
    createdAt: "2026-10-23T10:15:00Z",
    items: [
      { name: "Mile Infinity Ceremonial Green Fusion Serum", quantity: 1, price: 1599, size: "30ml" },
    ],
    payment: {
      gateway: "Razorpay",
      status: "paid",
      razorpayPaymentId: "pay_Pl94Ms01Qv73Nm",
      razorpayOrderId: "order_Pl93Kz81Mm20",
    },
    shipment: {
      shiprocketOrderId: "SR-849103",
      status: "pickup_scheduled",
      courierName: "Delhivery Air",
    },
  },
  {
    id: "ord-103",
    orderNumber: "MI-7721C3",
    customerName: "Rohan Varma",
    customerEmail: "rohan.varma@example.com",
    customerPhone: "+91 97234 55667",
    addressLine: "74, Defense Colony",
    city: "New Delhi",
    pincode: "110024",
    subtotalInr: 2398,
    status: "pending",
    createdAt: "2026-10-23T11:05:00Z",
    items: [
      { name: "Mile Infinity Blue Berry & Lavender Bliss Moisturiser", quantity: 1, price: 1099, size: "50ml" },
      { name: "Mile Infinity Sunnykiss Radiance SPF 50 Sunscreen", quantity: 1, price: 1299, size: "100ml" },
    ],
    payment: {
      gateway: "Razorpay",
      status: "paid",
      razorpayPaymentId: "pay_Om72Nk93Px41Lv",
      razorpayOrderId: "order_Om71Jm92Nx10",
    },
  },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "shiprocket" | "razorpay">("overview");
  const [products, setProducts] = useState<ProductDto[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // New product form state
  const [newProd, setNewProd] = useState({
    name: "",
    slug: "",
    tagline: "",
    category: "serum",
    priceInr: 999,
    comparePriceInr: 1299,
    stock: 50,
    sizes: "30ml, 50ml",
    imageUrl: "/images/card-green.png",
    description: "",
  });

  // Calculate high level metrics
  const totalRevenue = orders
    .filter((o) => o.payment.status === "paid")
    .reduce((sum, o) => sum + o.subtotalInr, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const shippedOrders = orders.filter((o) => o.status === "shipped").length;
  const totalProducts = products.length;

  function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!newProd.name) return;
    const slug = newProd.slug || newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const created: ProductDto = {
      id: "prod-" + Date.now(),
      name: newProd.name,
      slug,
      tagline: newProd.tagline,
      description: newProd.description,
      category: newProd.category,
      priceInr: Number(newProd.priceInr),
      comparePriceInr: newProd.comparePriceInr ? Number(newProd.comparePriceInr) : null,
      imageUrl: newProd.imageUrl || "/images/card-beetroot.png",
      sizes: newProd.sizes.split(",").map((s) => s.trim()),
      isNew: true,
      stock: Number(newProd.stock),
    };
    setProducts([created, ...products]);
    setShowAddModal(false);
    setNewProd({
      name: "",
      slug: "",
      tagline: "",
      category: "serum",
      priceInr: 999,
      comparePriceInr: 1299,
      stock: 50,
      sizes: "30ml, 50ml",
      imageUrl: "/images/card-green.png",
      description: "",
    });
  }

  function handleDeleteProduct(id: string) {
    if (confirm("Are you sure you want to remove this product from the store catalog?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  }

  function handleCreateShipment(orderId: string, courier = "Blue Dart Express") {
    const awb = "SR-AWB-" + Math.floor(100000000 + Math.random() * 900000000);
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: "shipped",
          shipment: {
            shiprocketOrderId: "SR-" + Math.floor(100000 + Math.random() * 900000),
            shipmentId: "SHP-" + Math.floor(100000 + Math.random() * 900000),
            awbCode: awb,
            courierName: courier,
            status: "in_transit",
            labelUrl: "#",
          },
        };
      })
    );
  }

  function handleUpdateOrderStatus(orderId: string, newStatus: AdminOrder["status"]) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  }

  return (
    <div className="min-h-screen bg-[#0d2218] text-[#f7f5f0] flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="border-b border-[#1b3d2c] bg-[#091a12]/95 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logoImg}
                alt="Mile Infinity"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
              <span className="border-l border-white/20 pl-3 text-xs tracking-[0.2em] font-semibold text-[#c49838] uppercase">
                Admin Console
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs uppercase tracking-[0.14em] text-white/70 hover:text-white px-3 py-1.5 rounded border border-white/20 hover:border-white/50 transition-colors inline-flex items-center gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Live Storefront</span>
            </Link>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#163526] border border-[#c49838]/40 flex items-center justify-center text-xs font-semibold text-[#c49838]">
                AD
              </div>
              <span className="text-xs font-medium text-white/90 hidden sm:inline">Administrator</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto border-t border-[#163526]/50">
          {[
            { id: "overview", label: "Overview & Analytics", icon: TrendingUp },
            { id: "products", label: "Products Catalog", icon: Package },
            { id: "orders", label: "Orders & Fulfillment", icon: ShoppingBag },
            { id: "shiprocket", label: "Shiprocket Logistics", icon: Truck },
            { id: "razorpay", label: "Razorpay Payments", icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-medium tracking-wide uppercase transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? "border-[#c49838] text-[#c49838] bg-white/[0.03]"
                  : "border-transparent text-white/60 hover:text-white hover:bg-white/[0.01]"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stat Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-[#1b3d2c] bg-[#11291d] p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-white/60 font-medium">Total Revenue</span>
                  <div className="h-9 w-9 rounded-lg bg-[#c49838]/10 text-[#c49838] flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 font-display text-3xl font-semibold text-white">
                  {formatInr(totalRevenue)}
                </div>
                <div className="mt-2 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span>+18.4%</span>
                  <span className="text-white/50">via Razorpay Gateway</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#1b3d2c] bg-[#11291d] p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-white/60 font-medium">Orders Count</span>
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 font-display text-3xl font-semibold text-white">{totalOrders}</div>
                <div className="mt-2 text-[11px] text-white/60 font-medium">
                  {pendingOrders} awaiting fulfillment
                </div>
              </div>

              <div className="rounded-xl border border-[#1b3d2c] bg-[#11291d] p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-white/60 font-medium">Shiprocket In-Transit</span>
                  <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Truck className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 font-display text-3xl font-semibold text-white">{shippedOrders}</div>
                <div className="mt-2 text-[11px] text-blue-300 font-medium flex items-center gap-1">
                  <span>AWBs Generated</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#1b3d2c] bg-[#11291d] p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-white/60 font-medium">Active Products</span>
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Package className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 font-display text-3xl font-semibold text-white">{totalProducts}</div>
                <div className="mt-2 text-[11px] text-white/60 font-medium">
                  All botanical formulas active
                </div>
              </div>
            </div>

            {/* Quick Action & Highlights */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Recent Orders Preview */}
              <div className="lg:col-span-8 rounded-xl border border-[#1b3d2c] bg-[#11291d] p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-display text-xl text-white">Recent Customer Orders</h3>
                    <p className="text-xs text-white/60">Live orders placed via Razorpay checkout</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-[#c49838] uppercase tracking-wider font-semibold hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="mt-4 divide-y divide-white/5">
                  {orders.slice(0, 3).map((o) => (
                    <div key={o.id} className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-white">{o.orderNumber}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                              o.status === "shipped"
                                ? "bg-blue-500/20 text-blue-300"
                                : o.status === "processing"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-emerald-500/20 text-emerald-300"
                            }`}
                          >
                            {o.status}
                          </span>
                        </div>
                        <p className="text-xs text-white/70 mt-1">{o.customerName} • {o.items.map((i) => i.name).join(", ")}</p>
                      </div>

                      <div className="text-right">
                        <span className="font-display text-lg font-medium text-white">{formatInr(o.subtotalInr)}</span>
                        <div className="text-[11px] text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Paid via Razorpay</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integrations Status Card */}
              <div className="lg:col-span-4 rounded-xl border border-[#1b3d2c] bg-[#11291d] p-6 space-y-5">
                <h3 className="font-display text-xl text-white">Connected Gateways</h3>

                {/* Razorpay status */}
                <div className="rounded-lg bg-[#0d2218] p-4 border border-[#1b3d2c]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">Razorpay Payments</p>
                        <p className="text-[10px] text-white/60">Live Mode / Test Sandbox Ready</p>
                      </div>
                    </div>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                  </div>
                  <p className="mt-3 text-[11px] text-white/70 leading-relaxed">
                    Credit/Debit Cards, UPI, Netbanking, and Wallets are verified and ready.
                  </p>
                </div>

                {/* Shiprocket status */}
                <div className="rounded-lg bg-[#0d2218] p-4 border border-[#1b3d2c]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Truck className="h-5 w-5 text-emerald-400" />
                      <div>
                        <p className="text-xs font-semibold text-white">Shiprocket Logistics</p>
                        <p className="text-[10px] text-white/60">AWB Generation &amp; Courier Sync</p>
                      </div>
                    </div>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                  </div>
                  <p className="mt-3 text-[11px] text-white/70 leading-relaxed">
                    Blue Dart, Delhivery, Shadowfax API dispatch enabled for pan-India pincodes.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full py-3 rounded-lg bg-[#c49838] hover:bg-[#b0872e] text-[#0d2218] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Product to Store</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS MANAGEMENT TAB */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-medium text-white">Product Catalog</h2>
                <p className="text-xs text-white/60">Manage botanical skincare inventory, prices, and stock levels</p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="py-3 px-5 rounded-lg bg-[#c49838] hover:bg-[#b0872e] text-[#0d2218] font-semibold text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition-colors shadow"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="rounded-xl border border-[#1b3d2c] bg-[#11291d] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-white/80">
                  <thead className="bg-[#091a12] text-[10px] uppercase tracking-wider text-white/60 border-b border-[#1b3d2c]">
                    <tr>
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Compare Price</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Sizes</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b3d2c]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl || "/images/card-green.png"}
                              alt={p.name}
                              className="h-11 w-11 rounded-lg object-cover bg-white/10 shrink-0"
                            />
                            <div>
                              <p className="font-medium text-white line-clamp-1">{p.name}</p>
                              <p className="text-[11px] text-white/50 line-clamp-1">{p.tagline}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] uppercase font-semibold text-white/80">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">{formatInr(p.priceInr)}</td>
                        <td className="py-3 px-4 text-white/50">
                          {p.comparePriceInr ? formatInr(p.comparePriceInr) : "—"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold ${
                              p.stock > 10 ? "text-emerald-400" : "text-amber-400"
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white/60">{p.sizes.join(", ")}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS & SHIPROCKET TAB */}
        {(activeTab === "orders" || activeTab === "shiprocket") && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-medium text-white">
                  {activeTab === "shiprocket" ? "Shiprocket Logistics & Fulfillment" : "Orders & Customer Deliveries"}
                </h2>
                <p className="text-xs text-white/60">
                  Manage Razorpay verified transactions and Shiprocket courier dispatch
                </p>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-[#1b3d2c] bg-[#11291d] p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-[#c49838]">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                          order.status === "shipped"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : order.status === "delivered"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-white/50">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-display text-xl font-bold text-white">
                        {formatInr(order.subtotalInr)}
                      </span>
                      <div className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-400 font-semibold border border-emerald-500/20">
                        <Check className="h-3 w-3" />
                        <span>Razorpay: {order.payment.razorpayPaymentId || "Paid"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer & Items breakdown */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                        Customer &amp; Shipping Address
                      </p>
                      <p className="text-sm font-medium text-white mt-1">{order.customerName}</p>
                      <p className="text-xs text-white/70">{order.customerEmail} • {order.customerPhone}</p>
                      <p className="text-xs text-white/60 mt-1">
                        {order.addressLine}, {order.city} — {order.pincode}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                        Items Ordered
                      </p>
                      <div className="mt-1 space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="text-xs text-white/80 flex justify-between">
                            <span>
                              {it.quantity}x {it.name} ({it.size})
                            </span>
                            <span className="text-white/60">{formatInr(it.price * it.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Shiprocket Section */}
                  <div className="rounded-lg bg-[#0a1c13] p-4 border border-[#1b3d2c]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {order.shipment ? (
                      <div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-emerald-400" />
                          <span className="text-xs font-semibold text-white">
                            Shiprocket AWB: {order.shipment.awbCode}
                          </span>
                          <span className="text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                            {order.shipment.courierName}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/60 mt-1">
                          Tracking status: <span className="text-white font-medium capitalize">{order.shipment.status?.replace("_", " ")}</span>
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-amber-300">
                        <Clock className="h-4 w-4" />
                        <span>Ready for Shiprocket parcel dispatch</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {!order.shipment ? (
                        <button
                          onClick={() => handleCreateShipment(order.id)}
                          className="py-2 px-4 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow"
                        >
                          <Truck className="h-3.5 w-3.5" />
                          <span>Generate Shiprocket AWB</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Printing Shipping Label for AWB: ${order.shipment?.awbCode}`)}
                          className="py-2 px-3 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download Shipping Label</span>
                        </button>
                      )}

                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                        className="bg-[#11291d] border border-white/20 text-white text-xs rounded py-2 px-2.5 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RAZORPAY PAYMENTS TAB */}
        {activeTab === "razorpay" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="font-display text-3xl font-medium text-white">Razorpay Payment Gateway</h2>
              <p className="text-xs text-white/60">Manage API keys, transaction settlements, and webhook events</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-[#1b3d2c] bg-[#11291d] p-6 space-y-4">
                <h3 className="font-display text-xl text-white">Razorpay API Credentials</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-white/60 block mb-1">
                      Key ID (Public)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="rzp_live_MileInfinity2026"
                      className="w-full bg-[#0a1c13] border border-white/20 rounded-lg p-2.5 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-white/60 block mb-1">
                      Key Secret
                    </label>
                    <input
                      type="password"
                      readOnly
                      value="••••••••••••••••••••••••"
                      className="w-full bg-[#0a1c13] border border-white/20 rounded-lg p-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-300">
                  ✓ Instant webhooks connected for automatic order status verification.
                </div>
              </div>

              <div className="rounded-xl border border-[#1b3d2c] bg-[#11291d] p-6 space-y-4">
                <h3 className="font-display text-xl text-white">Settlement Account Summary</h3>
                <div className="space-y-2 text-xs text-white/80">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/60">Settlement Currency:</span>
                    <span className="font-semibold text-white">INR (₹)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/60">Supported Modes:</span>
                    <span className="font-semibold text-white">UPI, Cards, Netbanking, Wallets</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/60">Auto Refund on Cancel:</span>
                    <span className="font-semibold text-emerald-400">Enabled</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-white/60">Settlement Frequency:</span>
                    <span className="font-semibold text-white">T+1 Business Day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl border border-[#1b3d2c] bg-[#11291d] p-6 text-white shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-display text-2xl text-white">Add New Botanical Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/50 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-5 space-y-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mile Infinity Rosehip Radiance Oil"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full bg-[#0a1c13] border border-white/20 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#c49838]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block mb-1">
                    Category *
                  </label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full bg-[#0a1c13] border border-white/20 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#c49838]"
                  >
                    <option value="cleanse">Cleanse (Facewash)</option>
                    <option value="serum">Serum (Treatment)</option>
                    <option value="moisturizer">Moisturizer (Hydrate)</option>
                    <option value="sunscreen">Sun Care (Protect)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProd.priceInr}
                    onChange={(e) => setNewProd({ ...newProd, priceInr: Number(e.target.value) })}
                    className="w-full bg-[#0a1c13] border border-white/20 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#c49838]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block mb-1">
                    Compare Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newProd.comparePriceInr}
                    onChange={(e) => setNewProd({ ...newProd, comparePriceInr: Number(e.target.value) })}
                    className="w-full bg-[#0a1c13] border border-white/20 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#c49838]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full bg-[#0a1c13] border border-white/20 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#c49838]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Infused with organic rosehip & cold-pressed jojoba"
                  value={newProd.tagline}
                  onChange={(e) => setNewProd({ ...newProd, tagline: e.target.value })}
                  className="w-full bg-[#0a1c13] border border-white/20 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#c49838]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block mb-1">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={newProd.imageUrl}
                  onChange={(e) => setNewProd({ ...newProd, imageUrl: e.target.value })}
                  className="w-full bg-[#0a1c13] border border-white/20 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#c49838]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-lg bg-[#c49838] hover:bg-[#b0872e] text-[#0d2218] text-xs font-bold uppercase tracking-wider shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
