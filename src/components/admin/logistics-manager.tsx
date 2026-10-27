import { useState } from "react";
import {
  Truck,
  Package,
  Clock,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Copy,
  Printer,
  Calendar,
  Building2,
  Search,
  ShieldCheck,
  RotateCw,
  X,
  Phone,
  Barcode,
  Navigation,
} from "lucide-react";
import type { AdminOrder } from "@/routes/admin";

interface LogisticsManagerProps {
  orders: AdminOrder[];
  onUpdateShipment: (orderId: string, courierName?: string) => void;
  onUpdateStatus: (orderId: string, newStatus: AdminOrder["status"]) => void;
  onSaveCustomShipment?: (orderId: string, shipmentDetails: NonNullable<AdminOrder["shipment"]>) => void;
}

const COURIER_PARTNERS = [
  { id: "Blue Dart Express", name: "Blue Dart Express", type: "Air Express", sla: "1-2 Days", rating: 4.8 },
  { id: "Delhivery Air", name: "Delhivery Air", type: "Priority Air", sla: "2-3 Days", rating: 4.7 },
  { id: "Xpressbees Surface", name: "Xpressbees Surface", type: "Ground Fleet", sla: "3-4 Days", rating: 4.6 },
  { id: "Shadowfax Local", name: "Shadowfax Local", type: "Hyperlocal / Metro", sla: "Same / 1 Day", rating: 4.5 },
  { id: "DTDC Priority", name: "DTDC Priority", type: "Pan-India Air", sla: "2-4 Days", rating: 4.6 },
];

export function LogisticsManager({
  orders,
  onUpdateShipment,
  onUpdateStatus,
  onSaveCustomShipment,
}: LogisticsManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "in_transit" | "out_for_delivery" | "delivered">("all");
  const [copiedAwb, setCopiedAwb] = useState<string | null>(null);

  // Modal States
  const [pickupModalOrder, setPickupModalOrder] = useState<AdminOrder | null>(null);
  const [pickupDate, setPickupDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [pickupSlot, setPickupSlot] = useState("10:00 AM - 01:00 PM (Morning Slot)");
  const [pickupWeight, setPickupWeight] = useState("0.45");

  const [labelModalOrder, setLabelModalOrder] = useState<AdminOrder | null>(null);

  // Rate calculator tool
  const [calcPincode, setCalcPincode] = useState("400001");
  const [calcResult, setCalcResult] = useState<{ zone: string; estDays: string; cost: number } | null>({
    zone: "Zone B (West Metro)",
    estDays: "2 Business Days",
    cost: 49,
  });

  function handleCalculatePincode(pin: string) {
    setCalcPincode(pin);
    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      setCalcResult(null);
      return;
    }
    const firstDigit = pin[0];
    if (firstDigit === "1") {
      setCalcResult({ zone: "Zone A (North Intra-state)", estDays: "Next Day (24 hrs)", cost: 38 });
    } else if (firstDigit === "4" || firstDigit === "5") {
      setCalcResult({ zone: "Zone B (West / South Metro)", estDays: "2 Business Days", cost: 49 });
    } else if (firstDigit === "7" || firstDigit === "8") {
      setCalcResult({ zone: "Zone C (East / Central)", estDays: "3 Business Days", cost: 58 });
    } else {
      setCalcResult({ zone: "Zone D (Pan-India Air)", estDays: "3-4 Business Days", cost: 65 });
    }
  }

  // Copy AWB code
  function handleCopyAwb(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedAwb(code);
    setTimeout(() => setCopiedAwb(null), 2000);
  }

  // Metrics
  const totalShipments = orders.filter((o) => !!o.shipment?.awbCode).length;
  const inTransitCount = orders.filter(
    (o) => o.shipment?.status === "in_transit" || (o.status === "shipped" && o.shipment?.status !== "delivered")
  ).length;
  const outForDeliveryCount = orders.filter((o) => o.shipment?.status === "out_for_delivery").length;
  const deliveredCount = orders.filter(
    (o) => o.status === "delivered" || o.shipment?.status === "delivered"
  ).length;
  const pendingDispatchCount = orders.filter((o) => !o.shipment?.awbCode && o.status !== "cancelled").length;

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (o.status === "cancelled") return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchCity = o.city.toLowerCase().includes(q);
      const matchOrderNum = o.orderNumber.toLowerCase().includes(q);
      const matchAwb = o.shipment?.awbCode?.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      if (!matchName && !matchCity && !matchOrderNum && !matchAwb && !matchPhone) {
        return false;
      }
    }

    if (filterStatus === "all") return true;
    if (filterStatus === "pending") return !o.shipment?.awbCode;
    if (filterStatus === "in_transit") {
      return o.shipment?.status === "in_transit" || (o.status === "shipped" && o.shipment?.status !== "delivered");
    }
    if (filterStatus === "out_for_delivery") return o.shipment?.status === "out_for_delivery";
    if (filterStatus === "delivered") return o.status === "delivered" || o.shipment?.status === "delivered";
    return true;
  });

  // Handle Schedule Pickup Confirmation
  function handleConfirmPickup() {
    if (!pickupModalOrder) return;
    const currentShipment = pickupModalOrder.shipment || {
      shiprocketOrderId: "SR-" + Math.floor(100000 + Math.random() * 900000),
      shipmentId: "SHP-" + Math.floor(100000 + Math.random() * 900000),
      awbCode: "SR-AWB-" + Math.floor(100000000 + Math.random() * 900000000),
      courierName: "Blue Dart Express",
    };

    const updatedShipment = {
      ...currentShipment,
      status: "in_transit" as const,
      pickupDate,
      pickupSlot,
      packageWeightKg: parseFloat(pickupWeight) || 0.45,
    };

    if (onSaveCustomShipment) {
      onSaveCustomShipment(pickupModalOrder.id, updatedShipment);
    } else {
      onUpdateShipment(pickupModalOrder.id, updatedShipment.courierName);
    }

    setPickupModalOrder(null);
  }

  // Handle Step Status
  function handleStepStatus(order: AdminOrder) {
    const current = order.shipment?.status;
    let next: AdminOrder["shipment"]["status"] = "in_transit";
    let nextOrderStatus: AdminOrder["status"] = "shipped";

    if (!order.shipment?.awbCode) {
      onUpdateShipment(order.id, "Blue Dart Express");
      return;
    }

    if (current === "pickup_scheduled" || !current) {
      next = "in_transit";
      nextOrderStatus = "shipped";
    } else if (current === "in_transit") {
      next = "out_for_delivery";
      nextOrderStatus = "shipped";
    } else if (current === "out_for_delivery") {
      next = "delivered";
      nextOrderStatus = "delivered";
    }

    if (onSaveCustomShipment && order.shipment) {
      onSaveCustomShipment(order.id, {
        ...order.shipment,
        status: next,
      });
      onUpdateStatus(order.id, nextOrderStatus);
    } else {
      onUpdateStatus(order.id, nextOrderStatus);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Ready to Dispatch</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{pendingDispatchCount}</div>
          <div className="text-[10px] text-amber-600 font-medium mt-0.5">Needs AWB Generation</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Shipments</span>
            <Truck className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{totalShipments}</div>
          <div className="text-[10px] text-sky-600 font-medium mt-0.5">Assigned Couriers</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">In-Transit</span>
            <Navigation className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{inTransitCount}</div>
          <div className="text-[10px] text-indigo-600 font-medium mt-0.5">Hub Line-Haul Moving</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Out for Delivery</span>
            <Package className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{outForDeliveryCount}</div>
          <div className="text-[10px] text-purple-600 font-medium mt-0.5">Last-mile doorstep van</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{deliveredCount}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">100% Verified Delivery</div>
        </div>
      </div>

      {/* Shiprocket Gateway & Warehouse Hub Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hub Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-[#0f291c] to-[#0a1e14] text-white p-5 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Delhi Central Botanical Hub</h3>
                  <span className="px-2 py-0.5 text-[10px] rounded-full font-mono bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Shiprocket Live
                  </span>
                </div>
                <p className="text-xs text-white/60">
                  Automated fulfillment center with daily multi-carrier courier pickups
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-white/60">Dispatch Hub SLA:</span>
              <span className="font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/60 font-mono">
                Same-Day 18:00 cutoff
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
            <div className="p-3 bg-white/[0.04] rounded-xl border border-white/5 space-y-1">
              <span className="text-white/40 block text-[10px] uppercase font-semibold">Registered Pickup Address</span>
              <p className="font-medium text-white/90 leading-relaxed">
                Mile Infinity Skincare, Bldg 4, Okhla Phase III, New Delhi 110020
              </p>
            </div>
            <div className="p-3 bg-white/[0.04] rounded-xl border border-white/5 space-y-1">
              <span className="text-white/40 block text-[10px] uppercase font-semibold">Logistics Contact & Desk</span>
              <p className="font-medium text-white/90">
                +91 98111 88990
              </p>
              <p className="text-white/50 text-[11px]">logistics@mileinfinity.com</p>
            </div>
            <div className="p-3 bg-white/[0.04] rounded-xl border border-white/5 space-y-1">
              <span className="text-white/40 block text-[10px] uppercase font-semibold">Active Courier Partners</span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-white font-mono">Blue Dart</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-white font-mono">Delhivery</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-white font-mono">Xpressbees</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-white font-mono">Shadowfax</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pincode Estimator Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                Pincode SLA Estimator
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                27,000+ PINs
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Test transit duration and freight rate from Delhi Hub to any destination.
            </p>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                maxLength={6}
                value={calcPincode}
                onChange={(e) => handleCalculatePincode(e.target.value)}
                placeholder="e.g. 400001"
                className="w-full px-3 py-2 text-xs font-mono font-medium rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-slate-50"
              />
            </div>

            {calcResult ? (
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl text-xs space-y-1.5">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-[11px] text-slate-500">Routing:</span>
                  <span className="font-semibold text-slate-900">{calcResult.zone}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-[11px] text-slate-500">Expected Delivery:</span>
                  <span className="font-semibold text-emerald-800">{calcResult.estDays}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700 pt-1 border-t border-emerald-200/50">
                  <span className="text-[11px] text-slate-500">Surface / Air Cost:</span>
                  <span className="font-bold text-slate-900 font-mono">₹{calcResult.cost} (incl. GST)</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
                Enter valid 6-digit destination pincode
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Direct API synced with Shiprocket courier network
          </div>
        </div>
      </div>

      {/* Main Shipments Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#0f3d24]" />
            <h2 className="text-sm font-bold text-slate-900">Order Consignments & Shipping Dispatches</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono font-medium">
              {filteredOrders.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order #, AWB, customer, city..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-white"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center p-0.5 bg-slate-200/80 rounded-xl text-xs">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "pending", label: "Pending AWB" },
                  { id: "in_transit", label: "In-Transit" },
                  { id: "out_for_delivery", label: "Out For Delivery" },
                  { id: "delivered", label: "Delivered" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    filterStatus === tab.id
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Body */}
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Package className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No consignments match this filter</h3>
            <p className="text-xs text-slate-500 mt-1">
              Customer orders placed on the store will automatically appear here for courier dispatch.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100/70 text-slate-700 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order / Date</th>
                  <th className="py-3 px-4">Customer & Destination</th>
                  <th className="py-3 px-4">Enclosed Products</th>
                  <th className="py-3 px-4">Courier Partner</th>
                  <th className="py-3 px-4">AWB & Tracking</th>
                  <th className="py-3 px-4">Logistics Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const hasAwb = !!order.shipment?.awbCode;
                  const courier = order.shipment?.courierName || "Blue Dart Express";
                  const trackingUrl = `https://shiprocket.co/tracking/${order.shipment?.awbCode || ""}`;
                  const isDelivered = order.status === "delivered" || order.shipment?.status === "delivered";
                  const isOutForDelivery = order.shipment?.status === "out_for_delivery";
                  const isInTransit = order.shipment?.status === "in_transit" || order.status === "shipped";

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Order / Date */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-mono font-bold text-slate-900">{order.orderNumber}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          ₹{order.subtotalInr.toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Customer & Destination */}
                      <td className="py-3 px-4 align-top max-w-[200px]">
                        <div className="font-bold text-slate-900 truncate">{order.customerName}</div>
                        <div className="text-slate-500 text-[11px] truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {order.city ? `${order.city}, ${order.pincode || ""}` : order.pincode || "Delivery Address"}
                        </div>
                        <div className="text-slate-400 text-[10px] mt-0.5 flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 text-slate-400" />
                          {order.customerPhone}
                        </div>
                      </td>

                      {/* Enclosed Products */}
                      <td className="py-3 px-4 align-top max-w-[200px]">
                        <div className="space-y-0.5">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="text-[11px] text-slate-700 truncate">
                              <span className="font-semibold text-slate-900">{item.quantity}x</span> {item.name}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-[10px] text-slate-400 italic">
                              +{order.items.length - 2} more item(s)
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Courier Partner */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-slate-400" />
                          {courier}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Air Express Line-Haul</span>
                      </td>

                      {/* AWB & Tracking */}
                      <td className="py-3 px-4 align-top">
                        {hasAwb ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/80 w-fit">
                              <Barcode className="w-3.5 h-3.5" />
                              <span>{order.shipment?.awbCode}</span>
                              <button
                                onClick={() => handleCopyAwb(order.shipment!.awbCode!)}
                                className="p-0.5 hover:text-purple-900 cursor-pointer ml-1"
                                title="Copy AWB Code"
                              >
                                {copiedAwb === order.shipment?.awbCode ? (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3 text-purple-600" />
                                )}
                              </button>
                            </div>
                            <a
                              href={trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-0.5 font-medium"
                            >
                              Live Tracking Link
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200/60 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            AWB Not Assigned
                          </span>
                        )}
                      </td>

                      {/* Logistics Status */}
                      <td className="py-3 px-4 align-top">
                        {isDelivered ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Delivered
                          </span>
                        ) : isOutForDelivery ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1 w-fit">
                            <Package className="w-3 h-3 text-purple-600" />
                            Out For Delivery
                          </span>
                        ) : isInTransit ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 w-fit">
                            <Truck className="w-3 h-3 text-indigo-600" />
                            In-Transit
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3 text-slate-500" />
                            Manifest Ready
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 align-top text-right space-y-1">
                        {!hasAwb ? (
                          <button
                            onClick={() => onUpdateShipment(order.id, "Blue Dart Express")}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0f3d24] text-white hover:bg-[#165a35] transition-colors shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Barcode className="w-3.5 h-3.5" />
                            Generate AWB
                          </button>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setLabelModalOrder(order)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                              title="Print Thermal Shipping Label"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setPickupModalOrder(order)}
                              className="px-2 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="Schedule Courier Pickup"
                            >
                              <Calendar className="w-3 h-3 text-slate-500" />
                              Pickup
                            </button>

                            <button
                              onClick={() => handleStepStatus(order)}
                              className="px-2 py-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200/80 transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="Advance Tracking Status"
                            >
                              <RotateCw className="w-3 h-3 text-emerald-700" />
                              Update Status
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Pickup Modal */}
      {pickupModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#0f3d24]" />
                <h3 className="text-base font-bold text-slate-900">Schedule Courier Pickup</h3>
              </div>
              <button
                onClick={() => setPickupModalOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order:</span>
                  <span className="font-mono font-bold text-slate-900">{pickupModalOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Consignee:</span>
                  <span className="font-semibold text-slate-800">{pickupModalOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Courier Partner:</span>
                  <span className="font-semibold text-purple-700">
                    {pickupModalOrder.shipment?.courierName || "Blue Dart Express"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pickup Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Courier Arrival Window</label>
                <select
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="10:00 AM - 01:00 PM (Morning Slot)">10:00 AM - 01:00 PM (Morning Express Slot)</option>
                  <option value="02:00 PM - 06:00 PM (Afternoon Slot)">02:00 PM - 06:00 PM (Afternoon Standard Slot)</option>
                  <option value="06:00 PM - 08:30 PM (Evening Special)">06:00 PM - 08:30 PM (Evening Urgent Cutoff)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Package Dead Weight (kg)</label>
                <input
                  type="number"
                  step="0.05"
                  value={pickupWeight}
                  onChange={(e) => setPickupWeight(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Includes serum bottle, eco-friendly filler, and sealed courier polybag.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setPickupModalOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPickup}
                className="px-4 py-2 text-xs font-semibold bg-[#0f3d24] text-white rounded-xl hover:bg-[#165a35] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Confirm Pickup Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Thermal Shipping Label Modal */}
      {labelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#0f3d24]" />
                <h3 className="text-base font-bold">Courier Shipping Label</h3>
              </div>
              <button
                onClick={() => setLabelModalOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Label Paper Box */}
            <div id="printable-shipping-label" className="my-4 p-5 bg-white border-2 border-slate-900 rounded-lg text-xs space-y-3 font-sans">
              {/* Top Header */}
              <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2">
                <div>
                  <div className="text-lg font-black tracking-tight uppercase">
                    {labelModalOrder.shipment?.courierName || "Blue Dart Express"}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-slate-600">AIR PRIORITY EXPRESS • PREPAID</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                    ROUTING: DEL/{labelModalOrder.city?.slice(0, 3).toUpperCase() || "BOM"}
                  </div>
                  <div className="text-[10px] font-mono mt-0.5">WT: 0.45 KG</div>
                </div>
              </div>

              {/* Barcode Graphic */}
              <div className="text-center py-2 border-b-2 border-slate-900">
                <div className="h-10 mx-auto w-3/4 bg-slate-900 flex items-center justify-around px-2 py-1">
                  {/* Visual Barcode Lines */}
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-full bg-white"
                      style={{ width: i % 3 === 0 ? "3px" : i % 2 === 0 ? "1px" : "2px" }}
                    />
                  ))}
                </div>
                <div className="font-mono text-sm font-bold tracking-widest mt-1">
                  {labelModalOrder.shipment?.awbCode || "SR-AWB-84920184"}
                </div>
              </div>

              {/* Consignee Details */}
              <div className="grid grid-cols-2 gap-3 border-b-2 border-slate-900 pb-3">
                <div>
                  <div className="text-[9px] uppercase font-bold text-slate-500 mb-0.5">SHIP TO (CONSIGNEE):</div>
                  <div className="font-bold text-sm text-slate-900">{labelModalOrder.customerName}</div>
                  <div className="text-xs text-slate-700 leading-snug">{labelModalOrder.addressLine}</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                    {labelModalOrder.city} — {labelModalOrder.pincode}
                  </div>
                  <div className="text-[11px] font-mono text-slate-800 mt-1">
                    TEL: {labelModalOrder.customerPhone}
                  </div>
                </div>

                <div className="border-l border-slate-300 pl-3">
                  <div className="text-[9px] uppercase font-bold text-slate-500 mb-0.5">SHIPPER (RETURN ADDRESS):</div>
                  <div className="font-bold text-xs text-slate-900">MILE INFINITY BOTANICAL</div>
                  <div className="text-[11px] text-slate-600 leading-snug">
                    Bldg 4, Okhla Industrial Area Phase III, New Delhi 110020
                  </div>
                  <div className="text-[10px] font-mono text-slate-600 mt-0.5">GSTIN: 07AAECM4819Q1ZU</div>
                  <div className="text-[10px] text-slate-600">TEL: +91 98111 88990</div>
                </div>
              </div>

              {/* Order Items & Summary */}
              <div className="flex justify-between items-center text-[11px]">
                <div>
                  <span className="font-bold">Order #:</span>{" "}
                  <span className="font-mono">{labelModalOrder.orderNumber}</span>
                  <div className="text-[10px] text-slate-500">
                    Items: {labelModalOrder.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold font-mono text-sm text-slate-900">
                    ₹{labelModalOrder.subtotalInr.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[9px] font-bold uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                    PREPAID (RAZORPAY)
                  </span>
                </div>
              </div>
            </div>

            {/* Print & Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setLabelModalOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold bg-[#0f3d24] text-white rounded-xl hover:bg-[#165a35] transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Label (Thermal 4x6 / A4)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
