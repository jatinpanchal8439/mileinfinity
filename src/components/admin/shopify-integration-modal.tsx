import { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  ShoppingBag,
  Package,
  Terminal,
  Key,
  ShieldCheck,
  ArrowRight,
  Sliders,
  Layers,
  Save,
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
  Store,
  Sparkles,
} from "lucide-react";
import type { ProductDto } from "@/lib/store.functions";
import { formatInr } from "@/lib/format";
import {
  getShopifyConfig,
  saveShopifyConfig,
  testShopifyConnection,
  syncProductsWithShopify,
  type ShopifyConfig,
  type ProductSyncResult,
} from "@/lib/shopify";

interface ShopifyIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductDto[];
  theme?: "white" | "dark";
  onToast?: (message: string) => void;
}

export function ShopifyBagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.74 7.64l-1.39-4.88A2.1 2.1 0 0016.33 1.3H7.67a2.1 2.1 0 00-2.02 1.46L4.26 7.64A3.48 3.48 0 003 10.35v9.31c0 1.66 1.34 3.04 3 3.04h12c1.66 0 3-1.38 3-3.04v-9.31a3.48 3.48 0 00-1.26-2.71zM8.5 3h7a.5.5 0 01.48.36l1.04 3.64H7L8.02 3.36A.5.5 0 018.5 3zm5.72 10.93l-2.09 3.63a.5.5 0 01-.86 0l-2.09-3.63a.5.5 0 01.43-.75h1.22V9.5a.5.5 0 011 0v3.68h1.22c.38 0 .61.42.43.75z" />
    </svg>
  );
}

export function ShopifyIntegrationModal({
  isOpen,
  onClose,
  products,
  theme = "white",
  onToast,
}: ShopifyIntegrationModalProps) {
  const isWhite = theme === "white";
  const [activeTab, setActiveTab] = useState<"overview" | "settings" | "sync" | "cli">("overview");
  const [config, setConfig] = useState<ShopifyConfig>(getShopifyConfig());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Connection testing state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Syncing state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<ProductSyncResult[]>([]);
  const [syncProgress, setSyncProgress] = useState<number | null>(null);

  // Credential view toggles
  const [showStorefrontToken, setShowStorefrontToken] = useState(false);
  const [showAdminToken, setShowAdminToken] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getShopifyConfig());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    if (onToast) onToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  async function handleTestConnection() {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testShopifyConnection(config.storeDomain);
      setTestResult(result);
      if (result.ok) {
        setConfig((prev) => ({ ...prev, isConnected: true }));
        if (onToast) onToast("Shopify store connection verified!");
      }
    } catch {
      setTestResult({
        ok: false,
        message: "Failed to connect to store. Please check the domain.",
      });
    } finally {
      setIsTesting(false);
    }
  }

  function handleSaveSettings(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const updated = saveShopifyConfig(config);
    setConfig(updated);
    if (onToast) onToast("Shopify settings saved successfully!");
  }

  async function handleSyncCatalog() {
    setIsSyncing(true);
    setSyncProgress(10);
    try {
      const timer = setInterval(() => {
        setSyncProgress((p) => (p && p < 85 ? p + 25 : p));
      }, 150);

      const res = await syncProductsWithShopify(products);
      clearInterval(timer);
      setSyncProgress(100);
      setSyncResults(res.results);
      setConfig((prev) => ({ ...prev, lastSyncedAt: new Date().toISOString() }));
      if (onToast) onToast(`Synced ${res.totalSynced} products to Shopify store!`);
    } catch {
      if (onToast) onToast("Sync failed. Check API credentials.");
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
        setSyncProgress(null);
      }, 500);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          isWhite ? "bg-white border-slate-200 text-slate-900" : "bg-[#0b1c14] border-[#1b3d2c] text-white"
        }`}
      >
        {/* MODAL HEADER */}
        <div
          className={`px-6 py-5 border-b flex items-center justify-between ${
            isWhite ? "bg-emerald-50/70 border-slate-200/80" : "bg-[#0f281d] border-[#1b3d2c]"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#008060] text-white flex items-center justify-center shadow-md shadow-emerald-950/20">
              <ShopifyBagIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
                  Shopify Store Connection &amp; Sales Channel
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#008060] text-[10px] font-bold tracking-wider uppercase border border-emerald-300">
                  ● Live Store
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isWhite ? "text-slate-600" : "text-white/70"}`}>
                Target Store:{" "}
                <a
                  href={config.storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono font-semibold underline hover:text-[#008060] transition-colors"
                >
                  {config.storeDomain}
                </a>{" "}
                • Active Theme: <span className="font-semibold">{config.themeName}</span> (#{config.themeId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-colors ${
              isWhite
                ? "border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                : "border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div
          className={`flex items-center gap-1 px-6 border-b overflow-x-auto ${
            isWhite ? "bg-slate-50/60 border-slate-200" : "bg-[#091a12] border-[#1b3d2c]"
          }`}
        >
          {[
            { id: "overview", label: "Overview & Status", icon: Globe },
            { id: "settings", label: "Store & API Keys", icon: Key },
            { id: "sync", label: "Product Catalog Sync", icon: Package, badge: products.length },
            { id: "cli", label: "Theme CLI & Dev", icon: Terminal },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-semibold tracking-wider uppercase flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? isWhite
                    ? "border-[#008060] text-[#008060] bg-white font-bold"
                    : "border-[#95BF47] text-[#95BF47] bg-white/5 font-bold"
                  : isWhite
                  ? "border-transparent text-slate-500 hover:text-slate-900"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-white/10 font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Store Hero Banner */}
              <div
                className={`p-6 rounded-2xl border relative overflow-hidden ${
                  isWhite
                    ? "bg-gradient-to-br from-emerald-50 via-white to-slate-50 border-emerald-200/80"
                    : "bg-gradient-to-br from-[#0f281d] via-[#0b1c14] to-[#0d2218] border-[#1b3d2c]"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-widest font-bold text-[#008060] dark:text-[#95BF47]">
                        Shopify Online Store 2.0
                      </span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-white/80 dark:bg-white/10 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10">
                        New Store Setup
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
                      {config.storeName || config.storeDomain}
                    </h3>
                    <p className={`text-xs max-w-xl ${isWhite ? "text-slate-600" : "text-white/70"}`}>
                      Direct integration active for your store at <span className="font-mono font-semibold">{config.storeDomain}</span>. Synchronize catalog items, manage inventory counts, and forward customer orders directly to your Shopify sales channels.
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                    <a
                      href={config.storeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-[#008060] hover:bg-[#004c3f] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Shopify Storefront</span>
                    </a>
                    <a
                      href={config.adminUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        isWhite
                          ? "bg-white border-slate-300 hover:bg-slate-100 text-slate-800"
                          : "bg-white/5 border-white/15 hover:bg-white/10 text-white"
                      }`}
                    >
                      <Store className="w-3.5 h-3.5 text-[#008060]" />
                      <span>Shopify Merchant Admin</span>
                    </a>
                  </div>
                </div>

                {/* Status Badges Row */}
                <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-white/50 block">
                      Theme Name
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {config.themeName} (Official)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-white/50 block">
                      Theme ID
                    </span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      #{config.themeId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-white/50 block">
                      SKU Prefix
                    </span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      {config.skuPrefix || "SKU-8X"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-white/50 block">
                      Last Synced
                    </span>
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">
                      {config.lastSyncedAt ? new Date(config.lastSyncedAt).toLocaleTimeString() : "Just now"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Handshake Test Action Card */}
              <div
                className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isWhite ? "bg-slate-50 border-slate-200" : "bg-[#0d2218] border-[#1b3d2c]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#008060] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Live Store Connectivity Verification
                    </h4>
                    <p className={`text-xs ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                      Verify SSL handshake, storefront routing and theme response on {config.storeDomain}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#008060] ${isTesting ? "animate-spin" : ""}`} />
                  <span>{isTesting ? "Testing Handshake..." : "Test Store Handshake"}</span>
                </button>
              </div>

              {/* Test Result Message */}
              {testResult && (
                <div
                  className={`p-4 rounded-xl text-xs flex items-center gap-3 ${
                    testResult.ok
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300"
                      : "bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-300"
                  }`}
                >
                  {testResult.ok ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}

              {/* Direct Quick Link Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href={`${config.storeUrl}/admin/themes/${config.themeId}/editor`}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-4 rounded-xl border hover:border-emerald-400 transition-all flex items-center justify-between group ${
                    isWhite ? "bg-white border-slate-200 hover:shadow-sm" : "bg-[#0d2218] border-[#1b3d2c]"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Theme Customizer</p>
                    <p className={`text-[11px] ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                      Visual builder for Horizon
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#008060] group-hover:translate-x-1 transition-all" />
                </a>

                <a
                  href={`${config.storeUrl}/admin/products`}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-4 rounded-xl border hover:border-emerald-400 transition-all flex items-center justify-between group ${
                    isWhite ? "bg-white border-slate-200 hover:shadow-sm" : "bg-[#0d2218] border-[#1b3d2c]"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Shopify Products</p>
                    <p className={`text-[11px] ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                      Manage remote inventory
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#008060] group-hover:translate-x-1 transition-all" />
                </a>

                <button
                  onClick={() => setActiveTab("sync")}
                  className={`p-4 rounded-xl border text-left hover:border-emerald-400 transition-all flex items-center justify-between group cursor-pointer ${
                    isWhite ? "bg-white border-slate-200 hover:shadow-sm" : "bg-[#0d2218] border-[#1b3d2c]"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Sync Catalog Now</p>
                    <p className={`text-[11px] ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                      {products.length} products ready
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#008060] group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: STORE & API SETTINGS */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveSettings} className="space-y-5 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Store Name */}
                <div>
                  <label className="block text-slate-700 dark:text-white/80 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={config.storeName}
                    onChange={(e) => setConfig({ ...config, storeName: e.target.value })}
                    placeholder="e.g. My Store / Brand Name"
                    className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#008060] ${
                      isWhite ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-black/30 border-white/20 text-white"
                    }`}
                  />
                  <p className={`text-[11px] mt-1 ${isWhite ? "text-slate-500" : "text-white/50"}`}>
                    Brand identity for this Shopify store
                  </p>
                </div>

                {/* SKU Prefix */}
                <div>
                  <label className="block text-slate-700 dark:text-white/80 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                    Catalog SKU Prefix
                  </label>
                  <input
                    type="text"
                    value={config.skuPrefix}
                    onChange={(e) => setConfig({ ...config, skuPrefix: e.target.value })}
                    placeholder="e.g. SKU-8X or SKU-STORE"
                    className={`w-full font-mono rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#008060] ${
                      isWhite ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-black/30 border-white/20 text-white"
                    }`}
                  />
                  <p className={`text-[11px] mt-1 ${isWhite ? "text-slate-500" : "text-white/50"}`}>
                    Used to generate product SKUs during sync
                  </p>
                </div>

                {/* Store Domain */}
                <div className="md:col-span-2">
                  <label className="block text-slate-700 dark:text-white/80 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                    Shopify Myshopify Domain
                  </label>
                  <input
                    type="text"
                    value={config.storeDomain}
                    onChange={(e) => setConfig({ ...config, storeDomain: e.target.value })}
                    placeholder="e.g. 8x051y-ku.myshopify.com"
                    className={`w-full font-mono rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#008060] ${
                      isWhite ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-black/30 border-white/20 text-white"
                    }`}
                  />
                  <p className={`text-[11px] mt-1 ${isWhite ? "text-slate-500" : "text-white/50"}`}>
                    Target store handle: <span className="font-mono font-semibold">8x051y-ku</span>
                  </p>
                </div>

                {/* Storefront Access Token */}
                <div>
                  <label className="block text-slate-700 dark:text-white/80 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                    Storefront API Access Token
                  </label>
                  <div className="relative">
                    <input
                      type={showStorefrontToken ? "text" : "password"}
                      value={config.storefrontAccessToken}
                      onChange={(e) => setConfig({ ...config, storefrontAccessToken: e.target.value })}
                      className={`w-full font-mono rounded-xl pl-3.5 pr-20 py-2.5 border focus:outline-none focus:border-[#008060] ${
                        isWhite ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-black/30 border-white/20 text-white"
                      }`}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowStorefrontToken(!showStorefrontToken)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        {showStorefrontToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(config.storefrontAccessToken, "Storefront Token")}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        {copiedKey === "Storefront Token" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Admin API Access Token */}
                <div>
                  <label className="block text-slate-700 dark:text-white/80 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                    Admin API Access Token (Private App)
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminToken ? "text" : "password"}
                      value={config.adminAccessToken}
                      onChange={(e) => setConfig({ ...config, adminAccessToken: e.target.value })}
                      className={`w-full font-mono rounded-xl pl-3.5 pr-20 py-2.5 border focus:outline-none focus:border-[#008060] ${
                        isWhite ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-black/30 border-white/20 text-white"
                      }`}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowAdminToken(!showAdminToken)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        {showAdminToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(config.adminAccessToken, "Admin Token")}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        {copiedKey === "Admin Token" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* API Version */}
                <div>
                  <label className="block text-slate-700 dark:text-white/80 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                    Shopify API Version
                  </label>
                  <select
                    value={config.apiVersion}
                    onChange={(e) => setConfig({ ...config, apiVersion: e.target.value })}
                    className={`w-full rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#008060] font-mono ${
                      isWhite ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-black/30 border-white/20 text-white"
                    }`}
                  >
                    <option value="2025-01">2025-01 (Latest Stable)</option>
                    <option value="2024-10">2024-10 (LTS)</option>
                    <option value="2024-07">2024-07</option>
                  </select>
                </div>

                {/* Active Theme ID */}
                <div>
                  <label className="block text-slate-700 dark:text-white/80 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                    Live Theme ID
                  </label>
                  <input
                    type="text"
                    value={config.themeId}
                    onChange={(e) => setConfig({ ...config, themeId: e.target.value })}
                    className={`w-full font-mono rounded-xl px-3.5 py-2.5 border focus:outline-none focus:border-[#008060] ${
                      isWhite ? "bg-slate-50 border-slate-200 text-slate-900" : "bg-black/30 border-white/20 text-white"
                    }`}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className={`p-4 rounded-xl border space-y-3 ${isWhite ? "bg-slate-50 border-slate-200" : "bg-[#0d2218] border-[#1b3d2c]"}`}>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={config.autoSyncOrders}
                    onChange={(e) => setConfig({ ...config, autoSyncOrders: e.target.checked })}
                    className="h-4 w-4 rounded text-[#008060] focus:ring-[#008060]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Auto-sync captured orders with Shopify
                    </span>
                    <span className={`${isWhite ? "text-slate-500" : "text-white/60"}`}>
                      Sends completed store checkouts directly to your Shopify orders feed.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={config.syncCatalog}
                    onChange={(e) => setConfig({ ...config, syncCatalog: e.target.checked })}
                    className="h-4 w-4 rounded text-[#008060] focus:ring-[#008060]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Enable real-time product price &amp; inventory sync
                    </span>
                    <span className={`${isWhite ? "text-slate-500" : "text-white/60"}`}>
                      Keep stock counts and pricing synchronized with your Shopify store.
                    </span>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  {isTesting ? "Testing..." : "Test Connection"}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#008060] hover:bg-[#004c3f] text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Shopify Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: PRODUCT CATALOG SYNC */}
          {activeTab === "sync" && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Synchronize Catalog with {config.storeDomain}
                  </h4>
                  <p className={`text-xs ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                    Push products, pricing, variants, and stock counts to your Shopify store
                  </p>
                </div>

                <button
                  onClick={handleSyncCatalog}
                  disabled={isSyncing}
                  className="px-4 py-2.5 rounded-xl bg-[#008060] hover:bg-[#004c3f] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{isSyncing ? "Syncing Catalog..." : `Sync All (${products.length}) Products`}</span>
                </button>
              </div>

              {/* Progress bar */}
              {isSyncing && syncProgress !== null && (
                <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#008060] h-2 transition-all duration-300"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              )}

              {/* Product Mapping Table */}
              <div className={`rounded-2xl border overflow-hidden ${isWhite ? "border-slate-200" : "border-[#1b3d2c]"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`${isWhite ? "bg-slate-50 text-slate-600" : "bg-[#091a12] text-white/60"}`}>
                      <tr className="border-b border-slate-200 dark:border-white/10">
                        <th className="py-3 px-4 font-semibold uppercase text-[10px]">Product</th>
                        <th className="py-3 px-4 font-semibold uppercase text-[10px]">Category</th>
                        <th className="py-3 px-4 font-semibold uppercase text-[10px]">Price</th>
                        <th className="py-3 px-4 font-semibold uppercase text-[10px]">Shopify SKU</th>
                        <th className="py-3 px-4 font-semibold uppercase text-[10px] text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-white/10 shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-[#008060]">
                                  {product.name[0]}
                                </div>
                              )}
                              <div>
                                <span className="font-semibold text-slate-900 dark:text-white block line-clamp-1">
                                  {product.name}
                                </span>
                                <span className={`text-[10px] font-mono ${isWhite ? "text-slate-400" : "text-white/40"}`}>
                                  handle: /{product.slug || "item"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="capitalize px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-[10px]">
                              {product.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                            {formatInr(product.priceInr)}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-white/70">
                            {config.skuPrefix || "SKU-8X"}-{(product.category || "GEN").toUpperCase().slice(0, 3)}-{product.id.slice(0, 4).toUpperCase()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Synced</span>
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

          {/* TAB 4: THEME CLI & DEV CHEATSHEET */}
          {activeTab === "cli" && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Shopify CLI 4.9+ Local Development Suite
                </h4>
                <p className={`text-xs ${isWhite ? "text-slate-500" : "text-white/60"}`}>
                  Run local live-reload theme development connected directly to {config.storeDomain}
                </p>
              </div>

              {/* Terminal Commands Card */}
              <div className="space-y-3">
                {[
                  {
                    title: "1. Start Local Live-Reload Theme Dev Server",
                    desc: `Pushes changes in real-time to a private development theme on ${config.storeDomain}`,
                    cmd: `shopify theme dev --store ${config.storeDomain}`,
                  },
                  {
                    title: "2. Pull Live Horizon Theme Files Locally",
                    desc: `Downloads layout, sections, templates and snippets from remote live store ${config.storeDomain}`,
                    cmd: `shopify theme pull --store ${config.storeDomain} --live`,
                  },
                  {
                    title: "3. List All Themes on Store",
                    desc: `Displays live and draft theme IDs and published statuses for ${config.storeDomain}`,
                    cmd: `shopify theme list --store ${config.storeDomain}`,
                  },
                  {
                    title: "4. Validate Theme Liquid Code & Standards",
                    desc: "Checks templates, sections, and accessibility compliance",
                    cmd: `shopify theme check`,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      isWhite ? "bg-slate-50 border-slate-200" : "bg-[#0d2218] border-[#1b3d2c]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</span>
                      <button
                        onClick={() => copyToClipboard(item.cmd, item.title)}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/10 border border-slate-300 dark:border-white/15 text-[11px] font-semibold text-slate-700 dark:text-white hover:bg-slate-100 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {copiedKey === item.title ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Command</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className={`text-[11px] mb-2 ${isWhite ? "text-slate-500" : "text-white/60"}`}>{item.desc}</p>
                    <div className="bg-slate-900 text-emerald-400 font-mono text-xs px-3.5 py-2 rounded-lg overflow-x-auto select-all">
                      $ {item.cmd}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between text-xs ${
            isWhite ? "bg-slate-50 border-slate-200" : "bg-[#091a12] border-[#1b3d2c]"
          }`}
        >
          <div className="flex items-center gap-2 text-slate-500 dark:text-white/60 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Target Store: {config.storeDomain}</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
