import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
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
  Zap,
  Database,
  Lock,
  LogOut,
  Sun,
  Moon,
  LayoutGrid,
  Table as TableIcon,
  SlidersHorizontal,
  Users,
  Tag,
  Settings,
  Cloud,
  FileText,
  PlusCircle,
  Upload,
} from "lucide-react";
import { formatInr } from "@/lib/format";
import logoImg from "@/assets/mile-infinity-logo.png";
import type { ProductDto } from "@/lib/store.functions";
import { ProductCardsRazorpayDashboard } from "@/components/admin/product-cards-razorpay-dashboard";
import { AdminLoginPortal } from "@/components/admin/admin-login-portal";
import { DynamicProductModal } from "@/components/admin/dynamic-product-modal";
import { AddProductPanel } from "@/components/admin/add-product-panel";
import { OrderDetailsDrawer } from "@/components/admin/order-details-drawer";
import { CustomersManager } from "@/components/admin/customers-manager";
import { CouponsManager } from "@/components/admin/coupons-manager";
import { SettingsIntegrations } from "@/components/admin/settings-integrations";
import { HostingDeploymentGuide } from "@/components/admin/hosting-deployment-guide";
import {
  getAdminSession,
  clearAdminSession,
  type AdminSession,
} from "@/lib/security";
import {
  getDatabaseProducts,
  deleteDatabaseProduct,
  updateDatabaseProduct,
  DEFAULT_SQL_PRODUCTS,
} from "@/lib/database-service";

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

export interface AdminOrderItem {
  name: string;
  quantity: number;
  price: number;
  size: string;
}

export interface AdminOrder {
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
  items: AdminOrderItem[];
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
  // Authentication & Session Gate
  const [session, setSession] = useState<AdminSession | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Theme: Executive White Theme (Default) or Dark Botanical Theme
  const [theme, setTheme] = useState<"white" | "dark">("white");

  // Navigation
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "products"
    | "add-product"
    | "orders"
    | "customers"
    | "coupons"
    | "product-cards"
    | "settings"
    | "hosting"
  >("overview");

  // Products state (PostgreSQL SQL source)
  const [products, setProducts] = useState<ProductDto[]>(DEFAULT_SQL_PRODUCTS);
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [selectedOrderForDrawer, setSelectedOrderForDrawer] = useState<AdminOrder | null>(null);

  // Products UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Dynamic Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const tabContainerRef = useRef<HTMLElement>(null);

  // GSAP Smooth Tab Switch Transition
  useEffect(() => {
    if (!tabContainerRef.current || typeof window === "undefined") return;
    gsap.fromTo(
      tabContainerRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" }
    );
  }, [activeTab]);

  // Initialize session & load products from SQL
  useEffect(() => {
    const activeSession = getAdminSession();
    setSession(activeSession);
    setAuthChecked(true);

    // Load products from PostgreSQL / local SQL store
    const loadProducts = async () => {
      const data = await getDatabaseProducts();
      setProducts(data);
    };
    loadProducts();

    // Sync real-time orders from localStorage and live payment triggers
    const loadStoredOrders = () => {
      try {
        const raw = localStorage.getItem("mile-infinity-orders");
        if (raw) {
          const stored: AdminOrder[] = JSON.parse(raw);
          const seen = new Set<string>();
          const merged: AdminOrder[] = [];
          for (const ord of [...stored, ...INITIAL_ORDERS]) {
            if (!seen.has(ord.id) && !seen.has(ord.orderNumber)) {
              seen.add(ord.id);
              if (ord.orderNumber) seen.add(ord.orderNumber);
              merged.push(ord);
            }
          }
          setOrders(merged);
        }
      } catch (e) {
        console.error("Failed to load stored orders", e);
      }
    };
    loadStoredOrders();

    const handleNewOrder = () => loadStoredOrders();
    const handleProductsUpdated = (e: any) => {
      if (e.detail) setProducts(e.detail);
      else loadProducts();
    };

    window.addEventListener("mile-infinity-order-created", handleNewOrder);
    window.addEventListener("mile-infinity-products-updated", handleProductsUpdated);
    window.addEventListener("storage", handleNewOrder);

    return () => {
      window.removeEventListener("mile-infinity-order-created", handleNewOrder);
      window.removeEventListener("mile-infinity-products-updated", handleProductsUpdated);
      window.removeEventListener("storage", handleNewOrder);
    };
  }, []);

  function showToast(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }

  function handleLogout() {
    clearAdminSession();
    setSession(null);
  }

  async function handleDeleteProduct(id: string, name: string) {
    if (confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
      const ok = await deleteDatabaseProduct(id);
      if (ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast(`Product "${name}" deleted from catalog.`);
      }
    }
  }

  async function handleQuickStockAdjust(product: ProductDto, delta: number) {
    const newStock = Math.max(0, product.stock + delta);
    const updated = await updateDatabaseProduct(product.id, { stock: newStock });
    if (updated) {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
      showToast(`Updated stock for "${product.name}" to ${newStock}`);
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
    showToast(`Shiprocket AWB generated (${awb}) via ${courier}!`);
  }

  function handleUpdateOrderStatus(orderId: string, newStatus: AdminOrder["status"]) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order status updated to "${newStatus}"`);
  }

  // If not authenticated or during initial SSR, show the secure White Theme Admin Login Portal
  if (!session) {
    return (
      <AdminLoginPortal
        onLoginSuccess={(newSession) => {
          setSession(newSession);
          setAuthChecked(true);
        }}
      />
    );
  }

  // Calculate High-level metrics
  const totalRevenue = orders
    .filter((o) => o.payment.status === "paid")
    .reduce((sum, o) => sum + o.subtotalInr, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const shippedOrders = orders.filter((o) => o.status === "shipped").length;
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  // Filter products for catalog view
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;

    let matchesStock = true;
    if (stockFilter === "low") matchesStock = p.stock > 0 && p.stock <= 10;
    if (stockFilter === "out") matchesStock = p.stock <= 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const isWhite = theme === "white";

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isWhite ? "bg-slate-50 text-slate-800" : "bg-[#0d2218] text-[#f7f5f0]"
      }`}
    >
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header
        className={`border-b sticky top-0 z-40 backdrop-blur transition-colors ${
          isWhite
            ? "border-slate-200 bg-white/95"
            : "border-[#1b3d2c] bg-[#091a12]/95"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logoImg}
                alt="Mile Infinity"
                className={`h-9 w-auto object-contain ${!isWhite ? "brightness-0 invert" : ""}`}
              />
              <span
                className={`border-l pl-3 text-xs tracking-[0.2em] font-semibold uppercase ${
                  isWhite
                    ? "border-slate-200 text-[#0f3d24]"
                    : "border-white/20 text-[#c49838]"
                }`}
              >
                Executive Console
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Switcher Toggle (White / Dark) */}
            <button
              onClick={() => setTheme(isWhite ? "dark" : "white")}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isWhite
                  ? "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                  : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
              }`}
              title={isWhite ? "Switch to Dark Botanical Theme" : "Switch to White Theme"}
            >
              {isWhite ? <Moon className="h-4 w-4 text-slate-600" /> : <Sun className="h-4 w-4 text-amber-400" />}
              <span className="hidden md:inline">{isWhite ? "Dark Theme" : "White Theme"}</span>
            </button>

            {/* Storefront Link */}
            <Link
              to="/shop"
              target="_blank"
              className={`text-xs uppercase tracking-[0.14em] px-3 py-2 rounded-xl border transition-colors inline-flex items-center gap-1.5 font-semibold ${
                isWhite
                  ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  : "border-white/20 hover:border-white/50 text-white/80"
              }`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>

            <div className={`h-8 w-[1px] ${isWhite ? "bg-slate-200" : "bg-white/10"}`} />

            {/* Admin Profile & Logout */}
            <div className="flex items-center gap-2">
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold border shadow-xs ${
                  isWhite
                    ? "bg-emerald-100 text-[#0f3d24] border-emerald-200"
                    : "bg-[#163526] text-[#c49838] border-[#c49838]/40"
                }`}
              >
                {session.user.avatarInitials || "AD"}
              </div>

              <div className="hidden lg:block text-left text-xs">
                <div className={`font-semibold ${isWhite ? "text-slate-900" : "text-white"}`}>
                  {session.user.name}
                </div>
                <div className="text-[10px] text-emerald-600 font-mono font-medium">
                  ● SuperAdmin • Store Live
                </div>
              </div>

              <button
                onClick={handleLogout}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                  isWhite
                    ? "border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                    : "border-white/20 text-white/70 hover:text-rose-400 hover:bg-rose-500/10"
                }`}
                title="Log Out of Admin Console"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div
          className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto border-t ${
            isWhite ? "border-slate-200/80 bg-white" : "border-[#163526]/50 bg-[#091a12]"
          }`}
        >
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "products", label: "Products Catalog", icon: Package, badge: products.length },
            { id: "add-product", label: "+ Add Product", icon: PlusCircle },
            { id: "orders", label: "Orders & Invoices", icon: ShoppingBag, badge: pendingOrders > 0 ? pendingOrders : undefined },
            { id: "customers", label: "Customers", icon: Users },
            { id: "coupons", label: "Coupons", icon: Tag },
            { id: "product-cards", label: "Cards & Pay Links", icon: Layers },
            { id: "settings", label: "Store & API Settings", icon: Settings },
            { id: "hosting", label: "Hosting Guide", icon: Cloud },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3.5 px-4 text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? isWhite
                    ? "border-[#0f3d24] text-[#0f3d24] bg-emerald-50/50"
                    : "border-[#c49838] text-[#c49838] bg-white/[0.03]"
                  : isWhite
                  ? "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  : "border-transparent text-white/60 hover:text-white hover:bg-white/[0.01]"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeTab === tab.id
                      ? "bg-[#0f3d24] text-white"
                      : isWhite
                      ? "bg-slate-200 text-slate-700"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main ref={tabContainerRef} className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================================= */}
        {/* 1. OVERVIEW TAB */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in">
            {/* Stat Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div
                className={`rounded-2xl border p-6 shadow-sm transition-all ${
                  isWhite ? "bg-white border-slate-200 shadow-slate-100" : "border-[#1b3d2c] bg-[#11291d]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs uppercase tracking-wider font-semibold ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                    Total Revenue
                  </span>
                  <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                </div>
                <div className={`mt-4 font-serif text-3xl font-bold ${isWhite ? "text-slate-900" : "text-white"}`}>
                  {formatInr(totalRevenue)}
                </div>
                <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span>+18.4%</span>
                  <span className={isWhite ? "text-slate-400 font-normal" : "text-white/50"}>via Razorpay Gateway</span>
                </div>
              </div>

              <div
                className={`rounded-2xl border p-6 shadow-sm transition-all ${
                  isWhite ? "bg-white border-slate-200 shadow-slate-100" : "border-[#1b3d2c] bg-[#11291d]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs uppercase tracking-wider font-semibold ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                    Orders Count
                  </span>
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                </div>
                <div className={`mt-4 font-serif text-3xl font-bold ${isWhite ? "text-slate-900" : "text-white"}`}>
                  {totalOrders}
                </div>
                <div className={`mt-2 text-[11px] font-medium ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                  {pendingOrders} awaiting fulfillment
                </div>
              </div>

              <div
                className={`rounded-2xl border p-6 shadow-sm transition-all ${
                  isWhite ? "bg-white border-slate-200 shadow-slate-100" : "border-[#1b3d2c] bg-[#11291d]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs uppercase tracking-wider font-semibold ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                    Shiprocket In-Transit
                  </span>
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Truck className="h-5 w-5" />
                  </div>
                </div>
                <div className={`mt-4 font-serif text-3xl font-bold ${isWhite ? "text-slate-900" : "text-white"}`}>
                  {shippedOrders}
                </div>
                <div className="mt-2 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                  <span>AWBs Generated</span>
                </div>
              </div>

              <div
                className={`rounded-2xl border p-6 shadow-sm transition-all ${
                  isWhite ? "bg-white border-slate-200 shadow-slate-100" : "border-[#1b3d2c] bg-[#11291d]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs uppercase tracking-wider font-semibold ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                    Active Store Products
                  </span>
                  <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Package className="h-5 w-5" />
                  </div>
                </div>
                <div className={`mt-4 font-serif text-3xl font-bold ${isWhite ? "text-slate-900" : "text-white"}`}>
                  {totalProducts}
                </div>
                <div className={`mt-2 text-[11px] font-medium ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                  {lowStockCount > 0 ? `${lowStockCount} low in stock` : "All stock healthy"}
                </div>
              </div>
            </div>

            {/* Quick Action & Highlights */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Recent Orders Preview */}
              <div
                className={`lg:col-span-8 rounded-2xl border p-6 ${
                  isWhite ? "bg-white border-slate-200 shadow-sm" : "border-[#1b3d2c] bg-[#11291d]"
                }`}
              >
                <div className={`flex items-center justify-between border-b pb-4 ${isWhite ? "border-slate-100" : "border-white/10"}`}>
                  <div>
                    <h3 className={`font-serif text-2xl font-normal ${isWhite ? "text-slate-900" : "text-white"}`}>
                      Recent Customer Orders
                    </h3>
                    <p className={`text-xs ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                      Orders captured via direct Razorpay checkout
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-[#0f3d24] uppercase tracking-wider font-bold hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className={`mt-4 divide-y ${isWhite ? "divide-slate-100" : "divide-white/5"}`}>
                  {orders.slice(0, 3).map((o) => (
                    <div key={o.id} className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-sm font-semibold ${isWhite ? "text-slate-900" : "text-white"}`}>
                            {o.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                              o.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : o.status === "processing"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {o.status}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${isWhite ? "text-slate-600" : "text-white/70"}`}>
                          {o.customerName} • {o.items.map((i) => i.name).join(", ")}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className={`font-serif text-lg font-bold ${isWhite ? "text-slate-900" : "text-white"}`}>
                          {formatInr(o.subtotalInr)}
                        </span>
                        <div className="text-[11px] text-emerald-600 font-medium flex items-center justify-end gap-1 mt-0.5">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Paid via Razorpay</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Integrations & Quick Add */}
              <div
                className={`lg:col-span-4 rounded-2xl border p-6 space-y-4 ${
                  isWhite ? "bg-white border-slate-200 shadow-sm" : "border-[#1b3d2c] bg-[#11291d]"
                }`}
              >
                <h3 className={`font-serif text-xl font-normal ${isWhite ? "text-slate-900" : "text-white"}`}>
                  Connected Infrastructure
                </h3>

                {/* Razorpay status */}
                <div className={`rounded-xl p-4 border ${isWhite ? "bg-slate-50 border-slate-200" : "bg-[#0d2218] border-[#1b3d2c]"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className={`text-xs font-semibold ${isWhite ? "text-slate-900" : "text-white"}`}>
                          Razorpay Gateway
                        </p>
                        <p className={`text-[10px] ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                          1-Click Product Cards Active
                        </p>
                      </div>
                    </div>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <button
                    onClick={() => setActiveTab("product-cards")}
                    className="mt-3 w-full py-1.5 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold flex items-center justify-between transition-colors"
                  >
                    <span>Product Cards Gateway Hub</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Photo Upload & Product Creator Card */}
                <div className={`rounded-xl p-4 border ${isWhite ? "bg-slate-50 border-slate-200" : "bg-[#0d2218] border-[#1b3d2c]"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0f3d24] flex items-center justify-center font-bold">
                        <Upload className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${isWhite ? "text-slate-900" : "text-white"}`}>
                          Photo Upload &amp; Creator
                        </p>
                        <p className={`text-[10px] ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                          Drag &amp; drop product packaging
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      New
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab("add-product")}
                    className="mt-3 w-full py-2 px-3 rounded-lg bg-[#0f3d24] hover:bg-[#092b19] text-white text-[11px] font-semibold flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>+ Add Product with Photo</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Direct Action Button */}
                <button
                  onClick={() => setActiveTab("add-product")}
                  className="w-full py-3.5 rounded-xl bg-[#0f3d24] hover:bg-[#092b19] active:scale-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-[#c49838]" />
                  <span>+ Create New Botanical Product</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. DYNAMIC PRODUCTS CATALOG & MANAGEMENT TAB */}
        {/* ========================================================= */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`font-serif text-3xl font-medium ${isWhite ? "text-slate-900" : "text-white"}`}>
                    Product Catalog &amp; Inventory
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-semibold">
                    {filteredProducts.length} items
                  </span>
                </div>
                <p className={`text-xs ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                  View live catalog, adjust inventory levels, edit product pricing and details
                </p>
              </div>

              <div className="flex items-center gap-2.5 self-start md:self-auto">
                <button
                  onClick={() => setActiveTab("add-product")}
                  className="py-2.5 px-5 rounded-xl bg-[#0f3d24] hover:bg-[#092b19] active:scale-95 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-[#c49838]" />
                  <span>+ Create Product</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div
              className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isWhite ? "bg-white border-slate-200 shadow-sm" : "bg-[#11291d] border-[#1b3d2c]"
              }`}
            >
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className={`h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isWhite ? "text-slate-400" : "text-white/40"}`} />
                <input
                  type="text"
                  placeholder="Search products by title, slug, or tagline..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none transition-all ${
                    isWhite
                      ? "bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-[#0f3d24]"
                      : "bg-[#0a1c13] border border-white/20 text-white focus:border-[#c49838]"
                  }`}
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Category select */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                    isWhite
                      ? "bg-slate-50 border-slate-200 text-slate-800"
                      : "bg-[#0a1c13] border-white/20 text-white"
                  }`}
                >
                  <option value="all">All Categories</option>
                  <option value="cleanse">Cleanse (Face Wash)</option>
                  <option value="serum">Serum (Treatment)</option>
                  <option value="moisturizer">Moisturizer</option>
                  <option value="sunscreen">Sunscreen SPF 50</option>
                  <option value="treatment">Treatment</option>
                  <option value="bundle">Bundles</option>
                </select>

                {/* Stock filter */}
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className={`px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                    isWhite
                      ? "bg-slate-50 border-slate-200 text-slate-800"
                      : "bg-[#0a1c13] border-white/20 text-white"
                  }`}
                >
                  <option value="all">Stock: All</option>
                  <option value="low">Low Stock (≤ 10)</option>
                  <option value="out">Sold Out (0)</option>
                </select>

                {/* View Mode Toggle */}
                <div className={`flex rounded-xl p-1 border ${isWhite ? "bg-slate-100 border-slate-200" : "bg-[#0a1c13] border-white/20"}`}>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? isWhite
                          ? "bg-white text-slate-900 shadow-xs"
                          : "bg-white/20 text-white"
                        : "text-slate-400"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === "table"
                        ? isWhite
                          ? "bg-white text-slate-900 shadow-xs"
                          : "bg-white/20 text-white"
                        : "text-slate-400"
                    }`}
                    title="Table View"
                  >
                    <TableIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* PRODUCT CATALOG: GRID VIEW */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((p) => {
                  const discount = p.comparePriceInr && p.comparePriceInr > p.priceInr ? p.comparePriceInr - p.priceInr : 0;
                  const isLow = p.stock > 0 && p.stock <= 10;
                  const isOut = p.stock <= 0;

                  return (
                    <div
                      key={p.id}
                      className={`rounded-2xl border p-4 flex flex-col justify-between transition-all group ${
                        isWhite
                          ? "bg-white border-slate-200 hover:shadow-lg hover:border-[#0f3d24]/40 shadow-sm"
                          : "bg-[#11291d] border-[#1b3d2c] hover:border-[#c49838]/40"
                      }`}
                    >
                      <div>
                        {/* Artwork */}
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                          <img
                            src={p.imageUrl || "/images/card-green.png"}
                            alt={p.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {p.isNew && (
                            <span className="absolute top-2.5 left-2.5 rounded-full bg-white/95 px-2.5 py-0.5 text-[9px] font-bold text-[#0f3d24] uppercase tracking-wider shadow-sm">
                              New Product
                            </span>
                          )}
                          {discount > 0 && (
                            <span className="absolute top-2.5 right-2.5 rounded-full bg-amber-500 text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-sm">
                              Save {formatInr(discount)}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="mt-3.5 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b48326]">
                              {p.category}
                            </span>
                            <span className={`text-[10px] font-mono ${isWhite ? "text-slate-400" : "text-white/50"}`}>
                              {p.sizes[0] || "Standard"}
                            </span>
                          </div>

                          <h4 className={`font-serif text-base font-semibold line-clamp-1 ${isWhite ? "text-slate-900" : "text-white"}`}>
                            {p.name}
                          </h4>

                          <p className={`text-xs line-clamp-2 min-h-[2rem] ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                            {p.tagline || p.description}
                          </p>

                          <div className="flex items-center gap-2 pt-1">
                            <span className={`font-serif text-lg font-bold ${isWhite ? "text-slate-900" : "text-white"}`}>
                              {formatInr(p.priceInr)}
                            </span>
                            {p.comparePriceInr && (
                              <span className={`text-xs line-through ${isWhite ? "text-slate-400" : "text-white/40"}`}>
                                {formatInr(p.comparePriceInr)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stock Adjustment & Actions */}
                      <div className={`mt-4 pt-3 border-t space-y-3 ${isWhite ? "border-slate-100" : "border-white/10"}`}>
                        {/* Stock Controls */}
                        <div className="flex items-center justify-between text-xs">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                              isOut
                                ? "bg-rose-100 text-rose-700"
                                : isLow
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {isOut ? "Out of Stock" : isLow ? `Low: ${p.stock}` : `Stock: ${p.stock}`}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleQuickStockAdjust(p, -1)}
                              disabled={p.stock <= 0}
                              className={`h-6 w-6 rounded flex items-center justify-center font-bold text-xs disabled:opacity-30 ${
                                isWhite ? "bg-slate-100 hover:bg-slate-200 text-slate-800" : "bg-white/10 hover:bg-white/20 text-white"
                              }`}
                              title="Decrease Stock (-1)"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs px-1">{p.stock}</span>
                            <button
                              type="button"
                              onClick={() => handleQuickStockAdjust(p, 5)}
                              className={`h-6 w-6 rounded flex items-center justify-center font-bold text-xs ${
                                isWhite ? "bg-slate-100 hover:bg-slate-200 text-slate-800" : "bg-white/10 hover:bg-white/20 text-white"
                              }`}
                              title="Add Stock (+5)"
                            >
                              +5
                            </button>
                          </div>
                        </div>

                        {/* Edit & Delete Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(p)}
                            className={`py-2 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                              isWhite
                                ? "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                                : "border-white/20 bg-white/5 hover:bg-white/10 text-white"
                            }`}
                          >
                            <Edit className="h-3.5 w-3.5 text-blue-500" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PRODUCT CATALOG: TABLE VIEW */}
            {viewMode === "table" && (
              <div className={`rounded-2xl border overflow-hidden ${isWhite ? "bg-white border-slate-200 shadow-sm" : "bg-[#11291d] border-[#1b3d2c]"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`text-[10px] uppercase tracking-wider border-b ${isWhite ? "bg-slate-50 text-slate-500 border-slate-200" : "bg-[#091a12] text-white/60 border-[#1b3d2c]"}`}>
                      <tr>
                        <th className="py-3.5 px-4">Product Name &amp; SKU</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Compare Price</th>
                        <th className="py-3.5 px-4">Stock Inventory</th>
                        <th className="py-3.5 px-4">Sizes</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isWhite ? "divide-slate-100 text-slate-700" : "divide-[#1b3d2c] text-white/80"}`}>
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.imageUrl || "/images/card-green.png"}
                                alt={p.name}
                                className="h-10 w-10 rounded-lg object-cover bg-slate-100 shrink-0"
                              />
                              <div>
                                <p className={`font-semibold line-clamp-1 ${isWhite ? "text-slate-900" : "text-white"}`}>{p.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{p.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="uppercase text-[10px] font-bold text-[#b48326]">
                              {p.category}
                            </span>
                          </td>
                          <td className={`py-3 px-4 font-semibold font-serif text-sm ${isWhite ? "text-slate-900" : "text-white"}`}>
                            {formatInr(p.priceInr)}
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {p.comparePriceInr ? formatInr(p.comparePriceInr) : "—"}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                                  p.stock <= 0
                                    ? "bg-rose-100 text-rose-700"
                                    : p.stock <= 10
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {p.stock}
                              </span>
                              <button
                                onClick={() => handleQuickStockAdjust(p, 5)}
                                className="text-[10px] text-slate-400 hover:text-slate-800 underline"
                              >
                                +5
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                            {p.sizes.join(", ")}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-blue-600"
                                title="Edit Product"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                                title="Delete Product"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. PRODUCT CARDS & RAZORPAY GATEWAY TAB */}
        {/* ========================================================= */}
        {activeTab === "product-cards" && (
          <ProductCardsRazorpayDashboard
            products={products}
            orders={orders as any}
            theme={theme}
            onOrderCreated={(newOrd) => {
              setOrders((prev) => [newOrd as any, ...prev]);
              showToast(`New Razorpay order created for ${newOrd.customerName}!`);
            }}
          />
        )}

        {/* ========================================================= */}
        {/* 4. ORDERS & INVOICES TAB */}
        {/* ========================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className={`font-serif text-3xl font-medium ${isWhite ? "text-slate-900" : "text-white"}`}>
                  Customer Orders &amp; Invoices
                </h2>
                <p className={`text-xs ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                  Inspect order line items, print tax invoices, and track Razorpay payments &amp; Shiprocket logistics
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  {orders.length} Total Orders
                </span>
              </div>
            </div>

            {/* Status Filter Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const).map(
                (st) => {
                  const count =
                    st === "all" ? orders.length : orders.filter((o) => o.status === st).length;
                  return (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        orderStatusFilter === st
                          ? "bg-[#0f3d24] text-white shadow-sm"
                          : isWhite
                          ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                          : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                      }`}
                    >
                      <span>{st === "all" ? "All Orders" : st}</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/10">
                        {count}
                      </span>
                    </button>
                  );
                }
              )}
            </div>

            <div className="space-y-4">
              {orders
                .filter((o) => (orderStatusFilter === "all" ? true : o.status === orderStatusFilter))
                .map((order) => (
                  <div
                    key={order.id}
                    className={`rounded-2xl border p-5 transition-all ${
                      isWhite ? "bg-white border-slate-200 shadow-sm hover:shadow-md" : "bg-[#11291d] border-[#1b3d2c]"
                    }`}
                  >
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${isWhite ? "border-slate-100" : "border-white/10"}`}>
                      <div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedOrderForDrawer(order)}
                            className="font-mono text-base font-bold text-slate-900 hover:text-emerald-700 underline flex items-center gap-1 cursor-pointer"
                            title="Click to view details & print tax invoice"
                          >
                            <span>#{order.orderNumber}</span>
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                              order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "processing"
                                ? "bg-amber-100 text-amber-800"
                                : order.status === "delivered"
                                ? "bg-emerald-100 text-emerald-800"
                                : order.status === "cancelled"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${isWhite ? "text-slate-600" : "text-white/70"}`}>
                          <span className="font-semibold text-slate-900">{order.customerName}</span> • {order.customerPhone} • {order.city}
                        </p>
                      </div>

                      <div className="text-right flex items-center sm:block justify-between">
                        <div>
                          <span className={`font-serif text-2xl font-bold ${isWhite ? "text-slate-900" : "text-white"}`}>
                            {formatInr(order.subtotalInr)}
                          </span>
                          <div className="text-[11px] text-emerald-600 font-semibold flex items-center justify-end gap-1 mt-0.5">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Razorpay: {order.payment.razorpayPaymentId || "Captured"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className={`text-[11px] font-semibold uppercase tracking-wider ${isWhite ? "text-slate-400" : "text-white/50"}`}>
                          Ordered Items ({order.items.length}):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((i, idx) => (
                            <span
                              key={idx}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                                isWhite ? "bg-slate-50 border-slate-200 text-slate-800" : "bg-white/5 border-white/10 text-white"
                              }`}
                            >
                              {i.name} ({i.size}) × {i.quantity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                        {/* Inspect & Print Invoice Drawer Button */}
                        <button
                          onClick={() => setSelectedOrderForDrawer(order)}
                          className="py-2 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5 text-[#0f3d24]" />
                          <span>Inspect &amp; Print Invoice</span>
                        </button>

                        {!order.shipment?.awbCode ? (
                          <button
                            onClick={() => handleCreateShipment(order.id, "Delhivery Air")}
                            className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                          >
                            <Truck className="h-3.5 w-3.5" />
                            <span>Shiprocket AWB</span>
                          </button>
                        ) : (
                          <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-mono font-medium">
                            AWB: {order.shipment.awbCode}
                          </div>
                        )}

                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                          className={`border rounded-xl text-xs py-2 px-2.5 focus:outline-none cursor-pointer ${
                            isWhite
                              ? "bg-slate-50 border-slate-200 text-slate-800"
                              : "bg-[#11291d] border-white/20 text-white"
                          }`}
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

        {/* ========================================================= */}
        {/* 5. CUSTOMERS DIRECTORY TAB */}
        {/* ========================================================= */}
        {activeTab === "customers" && (
          <CustomersManager
            orders={orders}
            onSelectCustomerOrders={(email) => {
              setActiveTab("orders");
            }}
          />
        )}

        {/* ========================================================= */}
        {/* 6. PROMOTIONAL COUPONS TAB */}
        {/* ========================================================= */}
        {activeTab === "coupons" && <CouponsManager />}

        {/* ========================================================= */}
        {/* 7. ADD NEW PRODUCT TAB */}
        {/* ========================================================= */}
        {activeTab === "add-product" && (
          <AddProductPanel
            onProductCreated={(newProduct) => {
              setProducts((prev) => [newProduct, ...prev]);
              showToast(`"${newProduct.name}" added to catalog!`);
            }}
            onViewCatalog={() => setActiveTab("products")}
          />
        )}

        {/* ========================================================= */}
        {/* 8. API & STORE SETTINGS TAB */}
        {/* ========================================================= */}
        {activeTab === "settings" && <SettingsIntegrations />}

        {/* ========================================================= */}
        {/* 9. HOSTING & PRODUCTION DEPLOYMENT GUIDE */}
        {/* ========================================================= */}
        {activeTab === "hosting" && <HostingDeploymentGuide />}
      </main>

      {/* ORDER DETAILS & PRINTABLE TAX INVOICE DRAWER */}
      <OrderDetailsDrawer
        order={selectedOrderForDrawer}
        onClose={() => setSelectedOrderForDrawer(null)}
        onUpdateStatus={handleUpdateOrderStatus}
        onCreateShipment={handleCreateShipment}
      />

      {/* DYNAMIC PRODUCT ADD / EDIT MODAL */}
      <DynamicProductModal
        isOpen={showAddModal || !!editingProduct}
        productToEdit={editingProduct}
        onClose={() => {
          setShowAddModal(false);
          setEditingProduct(null);
        }}
        onProductSaved={(savedProduct) => {
          setProducts((prev) => {
            const exists = prev.some((p) => p.id === savedProduct.id);
            if (exists) {
              return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
            }
            return [savedProduct, ...prev];
          });
          showToast(`Product "${savedProduct.name}" saved to store catalog!`);
        }}
      />
    </div>
  );
}
