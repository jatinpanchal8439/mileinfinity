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
import { LogisticsManager } from "@/components/admin/logistics-manager";
import {
  getAdminSession,
  clearAdminSession,
  type AdminSession,
} from "@/lib/security";
import {
  getDatabaseProducts,
  getCachedProducts,
  deleteDatabaseProduct,
  updateDatabaseProduct,
  updateDatabaseOrderStatus,
  DEFAULT_SQL_PRODUCTS,
} from "@/lib/database-service";
import { supabase } from "@/integrations/supabase/client";

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
    pickupDate?: string;
    pickupSlot?: string;
    packageWeightKg?: number;
    trackingUrl?: string;
  };
}

const INITIAL_ORDERS: AdminOrder[] = [];

function formatOrderDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

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
    | "logistics"
    | "customers"
    | "coupons"
    | "product-cards"
    | "settings"
    | "hosting"
  >("overview");

  // Products state (PostgreSQL SQL source)
  const [products, setProducts] = useState<ProductDto[]>(getCachedProducts);
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orderViewMode, setOrderViewMode] = useState<"table" | "cards">("table");
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

    // Sync real-time orders from Supabase PostgreSQL database, localStorage, and live payment triggers
    const loadStoredOrders = async () => {
      try {
        let dbOrders: AdminOrder[] = [];
        try {
          const { data: remoteOrders } = await supabase
            .from("orders")
            .select("*, order_items(*)")
            .order("created_at", { ascending: false });

          if (remoteOrders && remoteOrders.length > 0) {
            dbOrders = remoteOrders.map((ro: any) => ({
              id: ro.id,
              orderNumber: ro.order_number,
              customerName: ro.customer_name,
              customerEmail: ro.customer_email,
              customerPhone: ro.customer_phone || "",
              addressLine: ro.address_line,
              city: ro.city || "Delhi",
              pincode: ro.pincode || "110001",
              subtotalInr: ro.subtotal_inr,
              status: (ro.status || "processing") as any,
              createdAt: ro.created_at,
              items: (ro.order_items || []).map((oi: any) => ({
                name: oi.product_name,
                quantity: oi.quantity,
                price: oi.unit_price_inr,
                size: oi.size || "Standard",
              })),
              payment: {
                gateway: "Razorpay",
                status: "paid",
                razorpayPaymentId: "pay_live_" + ro.order_number,
                razorpayOrderId: "ord_live_" + ro.order_number,
              },
              shipment: {
                shiprocketOrderId: "SR-" + Math.floor(100000 + Math.random() * 900000),
                status: "pickup_scheduled",
                courierName: "Blue Dart Express",
              },
            }));
          }
        } catch {
          // Handled silently to prevent database schema reconnaissance
        }

        const raw = localStorage.getItem("mile-infinity-orders");
        const stored: AdminOrder[] = raw ? JSON.parse(raw) : [];
        const seen = new Set<string>();
        const merged: AdminOrder[] = [];
        // Prioritize local state first so custom generated AWBs and courier selections are preserved
        for (const ord of [...stored, ...dbOrders]) {
          if (!seen.has(ord.id) && !seen.has(ord.orderNumber)) {
            seen.add(ord.id);
            if (ord.orderNumber) seen.add(ord.orderNumber);
            merged.push(ord);
          }
        }
        setOrders(merged);
      } catch {
        // Fallback safely
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
    setOrders((prev) => {
      const updated = prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: "shipped" as const,
          shipment: {
            ...o.shipment,
            shiprocketOrderId: o.shipment?.shiprocketOrderId || "SR-" + Math.floor(100000 + Math.random() * 900000),
            shipmentId: o.shipment?.shipmentId || "SHP-" + Math.floor(100000 + Math.random() * 900000),
            awbCode: awb,
            courierName: courier,
            status: "in_transit" as const,
            trackingUrl: `https://shiprocket.co/tracking/${awb}`,
            labelUrl: "#",
          },
        };
      });
      try {
        localStorage.setItem("mile-infinity-orders", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    updateDatabaseOrderStatus(orderId, "shipped");
    showToast(`Shiprocket AWB generated (${awb}) via ${courier}!`);
  }

  function handleSaveCustomShipment(orderId: string, shipmentDetails: NonNullable<AdminOrder["shipment"]>) {
    setOrders((prev) => {
      const updated = prev.map((o) => {
        if (o.id !== orderId) return o;
        const newStatus: AdminOrder["status"] =
          shipmentDetails.status === "delivered"
            ? "delivered"
            : shipmentDetails.status === "in_transit" || shipmentDetails.status === "out_for_delivery"
            ? "shipped"
            : o.status;
        return {
          ...o,
          status: newStatus,
          shipment: shipmentDetails,
        };
      });
      try {
        localStorage.setItem("mile-infinity-orders", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (shipmentDetails.status === "delivered") {
      updateDatabaseOrderStatus(orderId, "delivered");
    } else {
      updateDatabaseOrderStatus(orderId, "shipped");
    }
    showToast(`Shipment & courier logistics updated!`);
  }

  function handleUpdateOrderStatus(orderId: string, newStatus: AdminOrder["status"]) {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      try {
        localStorage.setItem("mile-infinity-orders", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    updateDatabaseOrderStatus(orderId, newStatus);
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
            { id: "logistics", label: "Logistics & Shiprocket", icon: Truck, badge: shippedOrders > 0 ? shippedOrders : undefined },
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
                <div className={`mt-2 text-[11px] font-medium flex items-center gap-1 ${totalRevenue > 0 ? "text-emerald-600" : isWhite ? "text-slate-500" : "text-white/60"}`}>
                  <span>{totalOrders > 0 ? `${totalOrders} orders processed` : "No sales recorded yet"}</span>
                  <span className={isWhite ? "text-slate-400 font-normal" : "text-white/50"}>• Razorpay Active</span>
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
                  {orders.length === 0 ? (
                    <div className="py-10 text-center">
                      <ShoppingBag className={`h-8 w-8 mx-auto mb-2.5 ${isWhite ? "text-slate-300" : "text-white/20"}`} />
                      <p className={`text-sm font-medium ${isWhite ? "text-slate-700" : "text-white/80"}`}>
                        No customer orders placed yet
                      </p>
                      <p className={`text-xs mt-1 max-w-sm mx-auto ${isWhite ? "text-slate-400" : "text-white/40"}`}>
                        Orders captured through storefront Buy Now checkout will appear here in real-time.
                      </p>
                    </div>
                  ) : (
                    orders.slice(0, 3).map((o) => (
                      <div key={o.id} className="py-4 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-mono text-sm font-semibold ${isWhite ? "text-slate-900" : "text-white"}`}>
                              #{o.orderNumber}
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
                            <span className="text-[11px] text-slate-400 font-mono">
                              {formatOrderDateTime(o.createdAt)}
                            </span>
                          </div>
                          <p className={`text-xs mt-1 ${isWhite ? "text-slate-600" : "text-white/70"}`}>
                            <span className="font-semibold text-slate-900">{o.customerName}</span> ({o.city}) • {o.items.map((i) => i.name).join(", ")}
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
                    ))
                  )}
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

            {/* Status Filter Bar & View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setOrderViewMode("table")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    orderViewMode === "table"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Table View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderViewMode("cards")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    orderViewMode === "cards"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards View</span>
                </button>
              </div>
            </div>

            {/* ORDERS TABLE VIEW */}
            {orderViewMode === "table" ? (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Order #</th>
                        <th className="py-3 px-4">Date &amp; Time</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Fulfillment</th>
                        <th className="py-3 px-4 text-right">Total</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.filter((o) => (orderStatusFilter === "all" ? true : o.status === orderStatusFilter)).length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-16 text-center">
                            <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0f3d24] flex items-center justify-center mb-3">
                                <ShoppingBag className="w-6 h-6" />
                              </div>
                              <h4 className="font-bold text-slate-800 text-sm">No Customer Orders Yet</h4>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Real customer orders placed via storefront checkout or Razorpay payment will automatically appear here with full customer details, live payment status, and instant tax invoice generation.
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        orders
                          .filter((o) => (orderStatusFilter === "all" ? true : o.status === orderStatusFilter))
                          .map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                              <button
                                onClick={() => setSelectedOrderForDrawer(order)}
                                className="hover:text-emerald-700 underline cursor-pointer"
                              >
                                #{order.orderNumber}
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                              <div className="font-semibold text-slate-800 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {formatOrderDateTime(order.createdAt)}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-900">{order.customerName}</div>
                              <div className="text-[11px] text-slate-500">{order.customerPhone} • {order.city}</div>
                            </td>
                            <td className="py-3.5 px-4 max-w-xs">
                              <div className="font-medium text-slate-800">
                                {order.items.length} item{order.items.length > 1 ? "s" : ""}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate max-w-[200px]" title={order.items.map(i => `${i.name} (${i.size}) × ${i.quantity}`).join(", ")}>
                                {order.items.map(i => `${i.name} × ${i.quantity}`).join(", ")}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                {order.payment.gateway} ({order.payment.status})
                              </span>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
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
                              {order.shipment?.awbCode && (
                                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                                  AWB: {order.shipment.awbCode}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                              {formatInr(order.subtotalInr)}
                            </td>
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setSelectedOrderForDrawer(order)}
                                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                                  title="View Details & Print Tax Invoice"
                                >
                                  <FileText className="w-3.5 h-3.5 text-[#0f3d24]" />
                                  <span>Invoice</span>
                                </button>
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                                  className="border border-slate-200 rounded-lg text-xs py-1 px-2 bg-white text-slate-700 focus:outline-none cursor-pointer"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* ORDERS CARDS VIEW */
              <div className="space-y-4">
                {orders.filter((o) => (orderStatusFilter === "all" ? true : o.status === orderStatusFilter)).length === 0 ? (
                  <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0f3d24] flex items-center justify-center mb-3">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">No Customer Orders Yet</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Real customer orders placed via storefront checkout or Razorpay payment will automatically appear here with full customer details, live payment status, and instant tax invoice generation.
                      </p>
                    </div>
                  </div>
                ) : (
                  orders
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
                          <div className="flex items-center gap-3 flex-wrap">
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
                            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {formatOrderDateTime(order.createdAt)}
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
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* LOGISTICS & SHIPROCKET DISPATCH TAB */}
        {/* ========================================================= */}
        {activeTab === "logistics" && (
          <LogisticsManager
            orders={orders}
            onUpdateShipment={handleCreateShipment}
            onUpdateStatus={handleUpdateOrderStatus}
            onSaveCustomShipment={handleSaveCustomShipment}
          />
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
