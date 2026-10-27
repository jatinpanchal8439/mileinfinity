import { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Percent,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Search,
  AlertCircle,
} from "lucide-react";

export interface CouponItem {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderValueInr: number;
  maxDiscountInr?: number | null;
  usageCount: number;
  usageLimit: number;
  isActive: boolean;
  expiresAt: string;
}

const DEFAULT_COUPONS: CouponItem[] = [];

const STORAGE_KEY = "mile-infinity-coupons";

export function CouponsManager() {
  const [coupons, setCoupons] = useState<CouponItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Clear out legacy dummy coupons
        if (Array.isArray(parsed) && parsed.some((c: any) => c.id && c.id.startsWith("cpn-"))) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
          return [];
        }
        return parsed;
      }
    } catch {}
    return DEFAULT_COUPONS;
  });

  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [minOrderValue, setMinOrderValue] = useState<number>(999);
  const [maxDiscount, setMaxDiscount] = useState<number>(500);
  const [usageLimit, setUsageLimit] = useState<number>(500);
  const [expiresAt, setExpiresAt] = useState<string>("2026-12-31");
  const [formError, setFormError] = useState<string | null>(null);

  function saveCoupons(items: CouponItem[]) {
    setCoupons(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("mile-infinity-coupons-updated", { detail: items }));
  }

  function handleToggleActive(id: string) {
    const updated = coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
    saveCoupons(updated);
  }

  function handleDelete(id: string, couponCode: string) {
    if (confirm(`Are you sure you want to delete coupon code "${couponCode}"?`)) {
      const updated = coupons.filter((c) => c.id !== id);
      saveCoupons(updated);
    }
  }

  function handleCopy(codeStr: string) {
    navigator.clipboard.writeText(codeStr);
    setCopiedCode(codeStr);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!cleanCode) {
      setFormError("Please enter a valid uppercase alphanumeric coupon code.");
      return;
    }

    if (coupons.some((c) => c.code === cleanCode)) {
      setFormError(`Coupon code "${cleanCode}" already exists.`);
      return;
    }

    if (discountValue <= 0) {
      setFormError("Discount value must be greater than zero.");
      return;
    }

    const newCoupon: CouponItem = {
      id: `cpn-${Date.now().toString(36)}`,
      code: cleanCode,
      description: description.trim() || `${cleanCode} special promotional discount`,
      discountType,
      discountValue: Number(discountValue),
      minOrderValueInr: Number(minOrderValue) || 0,
      maxDiscountInr: discountType === "percentage" ? Number(maxDiscount) || null : null,
      usageCount: 0,
      usageLimit: Number(usageLimit) || 1000,
      isActive: true,
      expiresAt: expiresAt || "2026-12-31",
    };

    saveCoupons([newCoupon, ...coupons]);
    setShowCreateModal(false);
    setCode("");
    setDescription("");
    setFormError(null);
  }

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = coupons.filter((c) => c.isActive).length;
  const totalRedemptions = coupons.reduce((acc, c) => acc + c.usageCount, 0);
  const maxIncentiveText =
    coupons.length > 0
      ? coupons.some((c) => c.discountType === "percentage")
        ? `${Math.max(...coupons.filter((c) => c.discountType === "percentage").map((c) => c.discountValue), 0)}%`
        : `₹${Math.max(...coupons.map((c) => c.discountValue), 0)}`
      : "None active";

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Promo Campaigns
            </span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{activeCount}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Available at storefront checkout
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-[#0f3d24]">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Redemptions
            </span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalRedemptions}</p>
            <p className="text-[11px] text-purple-600 font-medium mt-0.5">
              Orders placed with promo discount
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Max Incentive
            </span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{maxIncentiveText}</p>
            <p className="text-[11px] text-[#c49838] font-medium mt-0.5">
              {coupons.length > 0 ? "Top promo tier" : "No active campaigns"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coupon code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0f3d24] focus:bg-white transition-all"
          />
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0f3d24] hover:bg-[#092b19] text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCoupons.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
            <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-700">No active coupons created yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Create your first promotional discount coupon code for your customers to apply at checkout.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f3d24] text-white text-xs font-semibold hover:bg-[#092b19] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>
        ) : (
          filteredCoupons.map((cpn) => (
          <div
            key={cpn.id}
            className={`p-5 rounded-2xl border transition-all ${
              cpn.isActive
                ? "bg-white border-slate-200/80 shadow-sm hover:shadow-md"
                : "bg-slate-50/60 border-slate-200 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 tracking-wider">
                    {cpn.code}
                  </span>
                  <button
                    onClick={() => handleCopy(cpn.code)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    title="Copy code"
                  >
                    {copiedCode === cpn.code ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-600 mt-2 font-medium">{cpn.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(cpn.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                    cpn.isActive
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {cpn.isActive ? "Active" : "Disabled"}
                </button>
                <button
                  onClick={() => handleDelete(cpn.id, cpn.code)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Benefit</span>
                <span className="font-bold text-[#0f3d24] mt-0.5 block text-sm">
                  {cpn.discountType === "percentage"
                    ? `${cpn.discountValue}% OFF`
                    : `₹${cpn.discountValue} FLAT`}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">
                  Min Spend
                </span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  ₹{cpn.minOrderValueInr.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">
                  Usage
                </span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {cpn.usageCount} / {cpn.usageLimit}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Valid until {cpn.expiresAt}
              </span>
              {cpn.maxDiscountInr && <span>Capped at ₹{cpn.maxDiscountInr}</span>}
            </div>
          </div>
        )))}
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#0f3d24]" />
                <h3 className="text-base font-bold text-slate-900">Create Promotional Coupon</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER25, RITUAL100"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono uppercase text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 25% off on SPF & cleansers"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Max Usage Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0f3d24]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0f3d24] hover:bg-[#092b19] text-white font-semibold shadow-sm transition-all"
                >
                  Save & Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
