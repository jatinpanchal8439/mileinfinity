import { useState } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  IndianRupee,
  Star,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import type { AdminOrder } from "@/routes/admin";

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpentInr: number;
  isVip: boolean;
  firstOrderDate: string;
  lastOrderDate: string;
}

const DEFAULT_CUSTOMERS: CustomerProfile[] = [];

interface CustomersManagerProps {
  orders: AdminOrder[];
  onSelectCustomerOrders?: (customerEmail: string) => void;
}

export function CustomersManager({ orders, onSelectCustomerOrders }: CustomersManagerProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "vip" | "repeat">("all");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  // Derive customers dynamically by combining defaults and any newly placed orders
  const customerMap = new Map<string, CustomerProfile>();
  DEFAULT_CUSTOMERS.forEach((c) => customerMap.set(c.email.toLowerCase(), { ...c }));

  // Aggregate any dynamic orders from localStorage
  orders.forEach((o) => {
    const emailKey = o.customerEmail.toLowerCase();
    const existing = customerMap.get(emailKey);
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpentInr += o.subtotalInr;
      if (existing.totalSpentInr > 5000) existing.isVip = true;
      if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = o.createdAt;
      }
    } else {
      customerMap.set(emailKey, {
        id: `cust-${Date.now().toString(36)}`,
        name: o.customerName,
        email: o.customerEmail,
        phone: o.customerPhone,
        city: o.city,
        totalOrders: 1,
        totalSpentInr: o.subtotalInr,
        isVip: o.subtotalInr > 5000,
        firstOrderDate: o.createdAt,
        lastOrderDate: o.createdAt,
      });
    }
  });

  const customerList = Array.from(customerMap.values());

  const filteredCustomers = customerList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === "vip") return c.isVip;
    if (filterType === "repeat") return c.totalOrders > 1;
    return true;
  });

  const totalCustomers = customerList.length;
  const totalVips = customerList.filter((c) => c.isVip).length;
  const totalLifetimeRevenue = customerList.reduce((acc, c) => acc + c.totalSpentInr, 0);
  const avgCustomerLtv = totalCustomers > 0 ? Math.round(totalLifetimeRevenue / totalCustomers) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Customers
            </span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalCustomers}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Active retail shoppers</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Users className="w-6 h-6 text-[#0f3d24]" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              VIP Patrons
            </span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalVips}</p>
            <p className="text-[11px] text-[#c49838] font-medium mt-0.5">&gt; ₹5,000 spend</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Average LTV
            </span>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">
              ₹{avgCustomerLtv.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Spend per customer</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <IndianRupee className="w-6 h-6 text-[#0f3d24]" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Repeat Rate
            </span>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {totalCustomers > 0 ? Math.round((customerList.filter((c) => c.totalOrders > 1).length / totalCustomers) * 100) : 0}%
            </p>
            <p className="text-[11px] text-purple-600 font-medium mt-0.5">Botanical ritual loyalty</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0f3d24] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(["all", "vip", "repeat"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterType(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                filterType === mode
                  ? "bg-[#0f3d24] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {mode === "all" ? "All Customers" : mode === "vip" ? "★ VIP Patrons" : "Repeat Buyers"}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-5">Customer Profile</th>
                <th className="py-3 px-4">Contact & Location</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Lifetime Spend</th>
                <th className="py-3 px-4">Last Order</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0f3d24] flex items-center justify-center mb-3">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        {search ? "No matching customers found" : "No Registered Customers Yet"}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {search
                          ? `No customer profiles match "${search}". Try searching by another name, email or city.`
                          : "Customer profiles will automatically be created and tracked here in real-time as customers place orders on your store."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900 text-sm">
                              {cust.name}
                            </span>
                            {cust.isVip && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 text-amber-800 font-bold uppercase tracking-wider flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-amber-500" /> VIP
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Member since{" "}
                            {new Date(cust.firstOrderDate).toLocaleDateString("en-IN", {
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{cust.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>
                          {cust.city} • {cust.phone}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-800">
                        {cust.totalOrders}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                      ₹{cust.totalSpentInr.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(cust.lastOrderDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                          cust.isVip
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        <UserCheck className="w-3 h-3" />
                        {cust.isVip ? "VIP Club" : "Active"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-all inline-flex items-center gap-1"
                      >
                        <span>Profile</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0f3d24] text-white flex items-center justify-center font-bold text-lg">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCustomer.name}</h3>
                  <p className="text-xs text-slate-500">{selectedCustomer.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Phone</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">
                  {selectedCustomer.phone}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Location
                </span>
                <span className="font-semibold text-slate-900 mt-0.5 block">
                  {selectedCustomer.city}, India
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Total Orders
                </span>
                <span className="font-semibold text-slate-900 mt-0.5 block text-sm">
                  {selectedCustomer.totalOrders} Completed
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Lifetime Value
                </span>
                <span className="font-bold text-[#0f3d24] mt-0.5 block text-sm font-mono">
                  ₹{selectedCustomer.totalSpentInr.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <a
                href={`mailto:${selectedCustomer.email}`}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" /> Send Direct Email
              </a>
              <button
                onClick={() => {
                  if (onSelectCustomerOrders) {
                    onSelectCustomerOrders(selectedCustomer.email);
                  }
                  setSelectedCustomer(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#0f3d24] hover:bg-[#092b19] text-white text-xs font-semibold shadow-sm transition-all inline-flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> View Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
