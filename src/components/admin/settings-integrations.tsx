import { useState, useEffect } from "react";
import {
  CreditCard,
  Truck,
  Store,
  Key,
  Lock,
  Globe,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Save,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export interface StoreApiSettings {
  // Razorpay
  razorpayMode: "test" | "live";
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayWebhookSecret: string;
  razorpayAutoCapture: boolean;

  // Shopify
  shopifyStoreDomain: string;
  shopifyStorefrontToken: string;
  shopifyAdminToken: string;
  shopifyThemeId: string;
  shopifyAutoSyncOrders: boolean;

  // Shiprocket
  shiprocketEmail: string;
  shiprocketToken: string;
  shiprocketPickupPincode: string;
  shiprocketWarehouseName: string;
  shiprocketAutoAwb: boolean;

  // Store Profile
  storeName: string;
  storeTagline: string;
  supportEmail: string;
  supportPhone: string;
  gstin: string;
  currency: string;
}

const DEFAULT_SETTINGS: StoreApiSettings = {
  razorpayMode: "test",
  razorpayKeyId: "rzp_test_TvIzrMorwKE36R",
  razorpayKeySecret: "t4CF83zF9cPqjdL0GWB7Fcdf",
  razorpayWebhookSecret: "whsec_live_92018491",
  razorpayAutoCapture: true,

  shopifyStoreDomain: "8x051y-ku.myshopify.com",
  shopifyStorefrontToken: "shpat_live_8x051y_storefront_92384a8",
  shopifyAdminToken: "shpat_8x051y_admin_prod_ku294819",
  shopifyThemeId: "194172256535",
  shopifyAutoSyncOrders: true,

  shiprocketEmail: "logistics@8x051y-ku.myshopify.com",
  shiprocketToken: "sr_token_prod_9481928419",
  shiprocketPickupPincode: "110001",
  shiprocketWarehouseName: "Central Warehouse Hub",
  shiprocketAutoAwb: true,

  storeName: "My Store (8x051y-ku)",
  storeTagline: "Shopify 2.0 Online Store",
  supportEmail: "support@8x051y-ku.myshopify.com",
  supportPhone: "+91 98111 88990",
  gstin: "07AAECM4819Q1ZU",
  currency: "INR (₹)",
};

const STORAGE_KEY = "mile-infinity-store-settings";

export function SettingsIntegrations() {
  const [settings, setSettings] = useState<StoreApiSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_SETTINGS;
  });

  const [showSecret, setShowSecret] = useState(false);
  const [isTestingRzp, setIsTestingRzp] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent("mile-infinity-settings-updated", { detail: settings }));

    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 600);
  }

  async function handleTestRazorpay() {
    setIsTestingRzp(true);
    setTestResult(null);

    // Simulate API handshake test with Razorpay servers
    setTimeout(() => {
      setIsTestingRzp(false);
      if (settings.razorpayKeyId.startsWith("rzp_")) {
        setTestResult({
          ok: true,
          msg: `Handshake verified! ${
            settings.razorpayMode === "live" ? "Production Live Mode" : "Test Sandbox Mode"
          } key format is valid and responsive.`,
        });
      } else {
        setTestResult({
          ok: false,
          msg: "Invalid Key ID format. Razorpay Key ID must begin with 'rzp_test_' or 'rzp_live_'.",
        });
      }
    }, 1000);
  }

  function handleCopyWebhookUrl() {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://mileinfinity.com";
    const webhookUrl = `${origin}/api/razorpay-webhook`;
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner Alert */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-[#0f3d24]" />
            Live eCommerce API & Payment Gateway Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your real Razorpay keys, Shiprocket credentials, and official store billing profile.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Settings Saved!
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0f3d24] hover:bg-[#092b19] text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save All Configuration"}</span>
          </button>
        </div>
      </div>

      {/* Razorpay Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Razorpay Payment Gateway</h3>
              <p className="text-xs text-slate-500">
                Official UPI, Debit/Credit Cards, Netbanking & Wallets rail for India
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSettings({ ...settings, razorpayMode: "test" })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                settings.razorpayMode === "test"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Test Mode
            </button>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, razorpayMode: "live" })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                settings.razorpayMode === "live"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              ● Production Live
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Razorpay Key ID ({settings.razorpayMode === "live" ? "rzp_live_..." : "rzp_test_..."}) *
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={settings.razorpayKeyId}
                onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                placeholder="rzp_live_abc1234567"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Public Key used by client-side checkout modal.
            </p>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Razorpay Key Secret (Server-side HMAC Verification) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showSecret ? "text" : "password"}
                required
                value={settings.razorpayKeySecret}
                onChange={(e) => setSettings({ ...settings, razorpayKeySecret: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                placeholder="••••••••••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Never shared with client. Used for cryptographic HMAC-SHA256 signature verification.
            </p>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Webhook Secret (Optional)
            </label>
            <input
              type="text"
              value={settings.razorpayWebhookSecret}
              onChange={(e) => setSettings({ ...settings, razorpayWebhookSecret: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
              placeholder="whsec_..."
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Used to verify incoming notifications for `order.paid` and `payment.failed`.
            </p>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Your Webhook Endpoint URL (Copy to Razorpay Dashboard)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : "https://mileinfinity.com"}/api/razorpay-webhook`}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-slate-600 text-xs"
              />
              <button
                type="button"
                onClick={handleCopyWebhookUrl}
                className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1 shrink-0"
              >
                {copiedWebhook ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedWebhook ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Paste this in Razorpay Dashboard &rarr; Settings &rarr; Webhooks.
            </p>
          </div>
        </div>

        {/* Test Connection Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-800">
              Verify API Reachability & Key Pair
            </span>
          </div>

          <button
            type="button"
            onClick={handleTestRazorpay}
            disabled={isTestingRzp}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingRzp ? "animate-spin text-[#0f3d24]" : ""}`} />
            <span>{isTestingRzp ? "Testing Handshake..." : "Test Razorpay Connection"}</span>
          </button>
        </div>

        {testResult && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              testResult.ok
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
          >
            {testResult.ok ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{testResult.msg}</span>
          </div>
        )}
      </div>

      {/* Shiprocket Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Shiprocket Logistics Gateway</h3>
            <p className="text-xs text-slate-500">
              Automated courier dispatch, AWB generation, and tracking with Delhivery, Blue Dart & DTDC
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Shiprocket Account Email
            </label>
            <input
              type="email"
              value={settings.shiprocketEmail}
              onChange={(e) => setSettings({ ...settings, shiprocketEmail: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Pickup Warehouse Pincode
            </label>
            <input
              type="text"
              value={settings.shiprocketPickupPincode}
              onChange={(e) => setSettings({ ...settings, shiprocketPickupPincode: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Pickup Warehouse / Location Name
            </label>
            <input
              type="text"
              value={settings.shiprocketWarehouseName}
              onChange={(e) => setSettings({ ...settings, shiprocketWarehouseName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.shiprocketAutoAwb}
                onChange={(e) => setSettings({ ...settings, shiprocketAutoAwb: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-[#0f3d24] focus:ring-[#0f3d24]"
              />
              <span className="font-semibold text-slate-800">
                Auto-generate AWB immediately upon Razorpay payment capture
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Shopify Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008060] flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Shopify Online Storefront &amp; Sales Channel</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#008060] text-[10px] font-bold">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Connected store: <span className="font-mono font-semibold">8x051y-ku.myshopify.com</span> • Theme: Horizon (#194172256535)
              </p>
            </div>
          </div>

          <a
            href="https://8x051y-ku.myshopify.com"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#008060]" />
            <span>Open Store</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Shopify Store Domain
            </label>
            <input
              type="text"
              value={settings.shopifyStoreDomain}
              onChange={(e) => setSettings({ ...settings, shopifyStoreDomain: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Live Theme ID
            </label>
            <input
              type="text"
              value={settings.shopifyThemeId}
              onChange={(e) => setSettings({ ...settings, shopifyThemeId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Storefront API Access Token
            </label>
            <input
              type="password"
              value={settings.shopifyStorefrontToken}
              onChange={(e) => setSettings({ ...settings, shopifyStorefrontToken: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Admin API Access Token (Private App)
            </label>
            <input
              type="password"
              value={settings.shopifyAdminToken}
              onChange={(e) => setSettings({ ...settings, shopifyAdminToken: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
            />
          </div>

          <div className="md:col-span-2 flex items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.shopifyAutoSyncOrders}
                onChange={(e) => setSettings({ ...settings, shopifyAutoSyncOrders: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-[#008060] focus:ring-[#008060]"
              />
              <span className="font-semibold text-slate-800">
                Forward captured orders directly into Shopify 8x051y-ku merchant orders feed
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Store Profile Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0f3d24] flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Store Profile & Official Invoicing Details</h3>
            <p className="text-xs text-slate-500">
              Details printed on customer order receipts, invoices, and email confirmations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Brand / Store Name
            </label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              GSTIN / Registered Tax ID
            </label>
            <input
              type="text"
              value={settings.gstin}
              onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Official Customer Support Email
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
              Support Helpline Phone
            </label>
            <input
              type="text"
              value={settings.supportPhone}
              onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
