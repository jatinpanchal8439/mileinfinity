import { useState, useEffect } from "react";
import {
  X,
  User,
  ShoppingBag,
  MapPin,
  Sparkles,
  LogOut,
  Truck,
  ExternalLink,
  CheckCircle2,
  Package,
  Calendar,
  Save,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import { useCustomerAuth } from "@/lib/customer-auth";
import type { AdminOrder } from "@/routes/admin";

export function CustomerProfileDrawer() {
  const {
    user,
    isProfileDrawerOpen,
    closeProfileDrawer,
    logout,
    updateProfile,
  } = useCustomerAuth();

  const [activeTab, setActiveTab] = useState<"orders" | "address" | "perks">("orders");
  const [customerOrders, setCustomerOrders] = useState<AdminOrder[]>([]);

  // Address edit fields
  const [addressLine, setAddressLine] = useState(user?.savedAddress?.addressLine || "");
  const [city, setCity] = useState(user?.savedAddress?.city || "");
  const [pincode, setPincode] = useState(user?.savedAddress?.pincode || "");
  const [addressSaved, setAddressSaved] = useState(false);

  // Sync user address
  useEffect(() => {
    if (user?.savedAddress) {
      setAddressLine(user.savedAddress.addressLine || "");
      setCity(user.savedAddress.city || "");
      setPincode(user.savedAddress.pincode || "");
    }
  }, [user]);

  // Load orders belonging to this customer
  useEffect(() => {
    if (!isProfileDrawerOpen || !user) return;
    try {
      const raw = localStorage.getItem("mile-infinity-orders");
      const list: AdminOrder[] = raw ? JSON.parse(raw) : [];

      const cleanUserEmail = user.email.toLowerCase().trim();
      const cleanUserPhone = (user.phone || "").replace(/\D/g, "");

      const matched = list.filter((o) => {
        const orderEmail = (o.customerEmail || "").toLowerCase().trim();
        const orderPhone = (o.customerPhone || "").replace(/\D/g, "");
        return (
          (cleanUserEmail && orderEmail === cleanUserEmail) ||
          (cleanUserPhone && orderPhone === cleanUserPhone)
        );
      });

      setCustomerOrders(matched);
    } catch {
      setCustomerOrders([]);
    }
  }, [isProfileDrawerOpen, user]);

  if (!isProfileDrawerOpen || !user) return null;

  function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({
      savedAddress: {
        addressLine,
        city,
        pincode,
      },
    });
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 2500);
  }

  // Generate initials
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "MI";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Card */}
        <div className="bg-gradient-to-br from-[#163729] via-[#0f291c] to-[#091b12] text-white p-6 relative">
          <button
            onClick={closeProfileDrawer}
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border-2 border-white/20 flex items-center justify-center text-xl font-bold font-serif text-emerald-200 shadow-inner">
              {initials}
            </div>

            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white truncate font-serif">{user.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VIP Club
                </span>
              </div>
              <p className="text-xs text-white/70 truncate mt-0.5">{user.email}</p>
              {user.phone && <p className="text-[11px] text-white/50 font-mono">+91 {user.phone}</p>}
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl mt-5 border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "orders" ? "bg-white text-[#163729] shadow-xs" : "text-white/70 hover:text-white"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders</span>
              {customerOrders.length > 0 && (
                <span className="text-[10px] px-1.5 rounded-full bg-[#163729] text-white font-mono">
                  {customerOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("address")}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "address" ? "bg-white text-[#163729] shadow-xs" : "text-white/70 hover:text-white"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Address</span>
            </button>

            <button
              onClick={() => setActiveTab("perks")}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "perks" ? "bg-white text-[#163729] shadow-xs" : "text-white/70 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Perks</span>
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100">
                <span className="font-semibold uppercase tracking-wider">Purchase History</span>
                <span>{customerOrders.length} Order(s)</span>
              </div>

              {customerOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <h4 className="text-sm font-bold text-slate-800">No orders found yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    When you purchase skincare rituals with this account, your live shipment updates and invoices will appear here.
                  </p>
                  <button
                    onClick={closeProfileDrawer}
                    className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-[#163729] text-white hover:bg-[#0f261c] transition-colors shadow-xs cursor-pointer"
                  >
                    Explore Skincare Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {customerOrders.map((ord) => {
                    const hasAwb = !!ord.shipment?.awbCode;
                    const trackingUrl = `https://shiprocket.co/tracking/${ord.shipment?.awbCode || ""}`;

                    return (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {ord.orderNumber}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#163729] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                            ₹{ord.subtotalInr.toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="text-xs text-slate-600 space-y-1">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="truncate max-w-[220px]">
                                <strong className="text-slate-800">{item.quantity}x</strong> {item.name}
                              </span>
                              <span className="font-mono text-slate-500">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Shipment Info */}
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                          {hasAwb ? (
                            <div className="flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5 text-purple-700" />
                              <span className="font-mono font-semibold text-purple-800">
                                {ord.shipment?.courierName || "Express Courier"}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-amber-700">
                              <Clock className="w-3 h-3" />
                              <span>Processing for Dispatch</span>
                            </div>
                          )}

                          {hasAwb && (
                            <a
                              href={trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-0.5 hover:underline"
                            >
                              Track AWB
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "address" && (
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="text-xs text-slate-500 pb-1 border-b border-slate-100 font-semibold uppercase tracking-wider">
                Default Delivery Address
              </div>

              {addressSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Address saved successfully for express checkout!
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address & House / Flat #
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Flat 402, Green Meadows, MG Road"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#163729] bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#163729] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 400001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#163729] bg-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#163729] hover:bg-[#0f261c] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Delivery Details</span>
              </button>
            </form>
          )}

          {activeTab === "perks" && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 pb-1 border-b border-slate-100 font-semibold uppercase tracking-wider">
                Member Benefits & Coupons
              </div>

              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">Welcome 10% Discount</span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-amber-200/80 text-amber-900 rounded">
                    WELCOME10
                  </span>
                </div>
                <p className="text-xs text-amber-800/80 leading-relaxed">
                  Apply at checkout for an instant 10% discount on your entire botanical order.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  Free Express Delivery
                </span>
                <p className="text-xs text-slate-600">
                  All member orders qualify for complimentary courier delivery across 27,000+ Indian pincodes.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  Early Batch Drops
                </span>
                <p className="text-xs text-slate-600">
                  Get notified 24 hours before limited-edition serums and face potions restock.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Logout Button */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <span className="text-[11px] text-slate-400">Mile Infinity Skincare</span>
        </div>
      </div>
    </div>
  );
}
