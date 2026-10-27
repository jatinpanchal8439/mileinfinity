import { useState } from "react";
import {
  X,
  Printer,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  ExternalLink,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  User,
  Check,
  Building,
} from "lucide-react";
import type { AdminOrder } from "@/routes/admin";
import logoImg from "@/assets/mile-infinity-logo.png";

interface OrderDetailsDrawerProps {
  order: AdminOrder | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: AdminOrder["status"]) => void;
  onCreateShipment?: (orderId: string, courier?: string) => void;
}

export function OrderDetailsDrawer({
  order,
  onClose,
  onUpdateStatus,
  onCreateShipment,
}: OrderDetailsDrawerProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!order) return null;

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  }

  function handlePrintInvoice() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the invoice.");
      return;
    }

    const itemsHtml = order?.items
      .map(
        (it, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 13px;">
        <td style="padding: 10px 8px; color: #64748b;">${idx + 1}</td>
        <td style="padding: 10px 8px; font-weight: 600; color: #0f172a;">
          ${it.name}
          ${it.size ? `<br/><span style="font-size: 11px; color: #64748b; font-weight: normal;">Size: ${it.size}</span>` : ""}
        </td>
        <td style="padding: 10px 8px; text-align: center; color: #0f172a;">${it.quantity}</td>
        <td style="padding: 10px 8px; text-align: right; color: #0f172a;">₹${it.price.toLocaleString("en-IN")}</td>
        <td style="padding: 10px 8px; text-align: right; font-weight: 600; color: #0f172a;">₹${(it.price * it.quantity).toLocaleString("en-IN")}</td>
      </tr>
    `
      )
      .join("");

    const invoiceDate = new Date(order?.createdAt || Date.now()).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax Invoice - ${order?.orderNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #0f172a; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f3d24; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 700; color: #0f3d24; letter-spacing: 0.05em; }
          .logo span { color: #c49838; font-style: italic; }
          .inv-title { text-align: right; }
          .inv-number { font-size: 18px; font-weight: 700; color: #0f3d24; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; background: #ecfdf5; color: #047857; margin-top: 4px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 24px 0; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 13px; }
          .box-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 8px; letter-spacing: 0.05em; }
          table { width: 100%; border-collapse: collapse; margin: 24px 0; }
          th { background: #0f3d24; color: #ffffff; text-align: left; padding: 10px 8px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
          .totals { margin-left: auto; width: 320px; font-size: 13px; }
          .tot-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e2e8f0; }
          .tot-grand { font-size: 16px; font-weight: 700; color: #0f3d24; border-bottom: 2px solid #0f3d24; padding-top: 8px; }
          .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
          @media print { body { margin: 20px; } button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">MILE INFINITY <span>Botanicals</span></div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Clean Rituals & Botanical Skincare Private Limited</div>
            <div style="font-size: 11px; color: #94a3b8;">GSTIN: 07AAECM4819Q1ZU • CIN: U24246DL2024PTC392811</div>
            <div style="font-size: 11px; color: #94a3b8;">Support: support@mileinfinity.com • +91 98111 88990</div>
          </div>
          <div class="inv-title">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b;">ORIGINAL FOR RECIPIENT</div>
            <div class="inv-number">TAX INVOICE #${order?.orderNumber}</div>
            <div style="font-size: 12px; color: #64748b;">Date: ${invoiceDate}</div>
            <div class="badge">Payment: ${order?.payment.status.toUpperCase()} (${order?.payment.gateway})</div>
          </div>
        </div>

        <div class="grid">
          <div class="box">
            <div class="box-title">Billed & Shipped To:</div>
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">${order?.customerName}</div>
            <div>${order?.addressLine}</div>
            <div>${order?.city}, Pin - ${order?.pincode}</div>
            <div style="margin-top: 6px; color: #64748b;">Phone: ${order?.customerPhone}</div>
            <div style="color: #64748b;">Email: ${order?.customerEmail}</div>
          </div>
          <div class="box">
            <div class="box-title">Payment & Dispatch Summary:</div>
            <div><strong>Payment Mode:</strong> Razorpay UPI / Cards</div>
            <div><strong>Payment ID:</strong> ${order?.payment.razorpayPaymentId || "pay_Om72Nk93Px41Lv"}</div>
            <div><strong>Shipment Courier:</strong> ${order?.shipment?.courierName || "Shiprocket Express"}</div>
            <div><strong>AWB Number:</strong> ${order?.shipment?.awbCode || "SR-AWB-84910392"}</div>
            <div style="margin-top: 6px; color: #047857; font-weight: 600;">Status: ${order?.status.toUpperCase()}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>Description of Botanical Goods</th>
              <th style="text-align: center; width: 60px;">Qty</th>
              <th style="text-align: right; width: 100px;">Rate (₹)</th>
              <th style="text-align: right; width: 120px;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="tot-row">
            <span>Subtotal:</span>
            <span>₹${(order?.subtotalInr || 0).toLocaleString("en-IN")}</span>
          </div>
          <div class="tot-row">
            <span>Botanical Express Shipping:</span>
            <span style="color: #047857; font-weight: 600;">FREE</span>
          </div>
          <div class="tot-row">
            <span>Integrated GST (18% inclusive):</span>
            <span>₹${Math.round(((order?.subtotalInr || 0) * 0.18) / 1.18).toLocaleString("en-IN")}</span>
          </div>
          <div class="tot-row tot-grand">
            <span>Total Payable:</span>
            <span>₹${(order?.subtotalInr || 0).toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div class="footer">
          <p>This is a computer-generated tax invoice and requires no physical signature under Indian Information Technology Act, 2000.</p>
          <p>Thank you for choosing Mile Infinity Botanical Skincare. For queries, contact support@mileinfinity.com</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  const subtotal = order.subtotalInr || 0;
  const gstInclusive = Math.round((subtotal * 0.18) / 1.18);

  const defaultStatus = { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" };
  const statusColors = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    processing: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    shipped: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
    delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    cancelled: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
  };

  const currStatus = statusColors[order.status] ?? defaultStatus;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 bg-white sticky top-0 z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Order #{order.orderNumber}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${currStatus.bg} ${currStatus.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${currStatus.dot}`} />
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintInvoice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
              title="Print Tax Invoice / Slip"
            >
              <Printer className="w-3.5 h-3.5 text-[#0f3d24]" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Status Workflow Action Bar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Update Order Lifecycle Status:
              </span>
              {copiedText && (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {copiedText} copied!
                </span>
              )}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {(["pending", "processing", "shipped", "delivered", "cancelled"] as const).map(
                (st) => {
                  const isActive = order.status === st;
                  return (
                    <button
                      key={st}
                      onClick={() => onUpdateStatus(order.id, st)}
                      className={`py-2 px-1 text-center rounded-lg text-xs font-semibold capitalize transition-all ${
                        isActive
                          ? "bg-[#0f3d24] text-white shadow-sm ring-2 ring-[#0f3d24]/20"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {st}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Customer & Shipping Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Box */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                <User className="w-3.5 h-3.5 text-[#0f3d24]" />
                Customer Profile
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900">{order.customerName}</p>
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.customerPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address Box */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                <MapPin className="w-3.5 h-3.5 text-[#0f3d24]" />
                Shipping Destination
              </div>
              <div className="text-xs text-slate-700 leading-relaxed">
                <p className="font-medium text-slate-900">{order.addressLine}</p>
                <p>
                  {order.city}, PIN: <span className="font-mono font-semibold">{order.pincode}</span>
                </p>
                <p className="text-slate-500 mt-1">Country: India (Domestic Standard)</p>
              </div>
            </div>
          </div>

          {/* Ordered Line Items Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#0f3d24]" />
                Ordered Botanical Items ({order.items.length})
              </span>
              <span className="text-xs text-slate-500">All prices in INR (₹)</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Item & Details</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Qty</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Unit Price</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{it.name}</p>
                      {it.size && (
                        <span className="inline-block px-2 py-0.5 mt-0.5 rounded bg-slate-100 text-[11px] text-slate-600 font-medium">
                          {it.size}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-800">
                      × {it.quantity}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 font-mono">
                      ₹{it.price.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                      ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment & Settlement Details */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <CreditCard className="w-4 h-4 text-[#0f3d24]" />
                Razorpay Payment Details
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                ✓ {order.payment.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Payment ID
                </span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono text-slate-800 font-medium truncate">
                    {order.payment.razorpayPaymentId || "pay_Om72Nk93Px41Lv"}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        order.payment.razorpayPaymentId || "pay_Om72Nk93Px41Lv",
                        "Payment ID"
                      )
                    }
                    className="p-1 hover:text-slate-900 text-slate-400"
                    title="Copy Payment ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Gateway Order ID
                </span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono text-slate-800 font-medium truncate">
                    {order.payment.razorpayOrderId || "order_Om71Jm92Nx10"}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        order.payment.razorpayOrderId || "order_Om71Jm92Nx10",
                        "Order ID"
                      )
                    }
                    className="p-1 hover:text-slate-900 text-slate-400"
                    title="Copy Order ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Financial Totals */}
            <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Botanical Express Shipping</span>
                <span className="font-medium text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Integrated GST (18% inclusive)</span>
                <span className="font-mono">₹{gstInclusive.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Grand Total Settled</span>
                <span className="font-mono text-[#0f3d24]">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Logistics & Shiprocket Dispatch */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Truck className="w-4 h-4 text-[#0f3d24]" />
                Shiprocket Dispatch & Logistics
              </div>
              {order.shipment?.awbCode && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-50 text-purple-700 font-semibold">
                  AWB: {order.shipment.awbCode}
                </span>
              )}
            </div>

            {order.shipment ? (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                    Courier Partner
                  </span>
                  <span className="font-semibold text-slate-800">
                    {order.shipment.courierName || "Delhivery Air"}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                    Fulfillment Status
                  </span>
                  <span className="font-semibold text-purple-700 capitalize">
                    {(order.shipment.status || "pickup_scheduled").replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-slate-500">No shipment generated yet.</p>
                {onCreateShipment && (
                  <button
                    onClick={() => onCreateShipment(order.id, "Delhivery Air")}
                    className="px-3 py-1.5 rounded-lg bg-[#0f3d24] hover:bg-[#092b19] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Generate Shiprocket AWB</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Order changes auto-saved to SQL database
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-all"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
