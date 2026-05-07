import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  adminApi,
  type CmsOrderDetail,
  type CmsOrderAddress,
} from "@/services/cmsService";

const CURRENCY_SYMBOL: Record<string, string> = { GBP: "£", USD: "$", EUR: "€" };

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "wc-pending", label: "Pending payment" },
  { value: "wc-processing", label: "Processing" },
  { value: "wc-on-hold", label: "On hold" },
  { value: "wc-completed", label: "Completed" },
  { value: "wc-cancelled", label: "Cancelled" },
  { value: "wc-refunded", label: "Refunded" },
  { value: "wc-failed", label: "Failed" },
];

function formatMoney(amount: number | null | undefined, currency?: string | null) {
  const value = typeof amount === "number" ? amount : 0;
  const symbol = currency ? CURRENCY_SYMBOL[currency.toUpperCase()] || `${currency} ` : "";
  return `${symbol}${value.toFixed(2)}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function statusLabel(status: string) {
  return status.replace(/^wc-/, "").replace(/[-_]/g, " ");
}

function statusColor(status: string) {
  const s = status.toLowerCase().replace(/^wc-/, "");
  if (s.includes("completed")) return "bg-green-100 text-green-800";
  if (s.includes("processing")) return "bg-blue-100 text-blue-800";
  if (s.includes("pending") || s.includes("on-hold")) return "bg-yellow-100 text-yellow-800";
  if (s.includes("cancel") || s.includes("fail") || s.includes("refund"))
    return "bg-red-100 text-red-800";
  return "bg-muted text-muted-foreground";
}

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = Number(id);

  const [detail, setDetail] = useState<CmsOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(orderId)) {
      setError("Invalid order id");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const d = await adminApi.getOrderById(orderId);
        if (!cancelled) setDetail(d);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load order");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const updateStatus = async (newStatus: string) => {
    if (!detail) return;
    setUpdating(true);
    try {
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      setDetail({ ...detail, status: res.status });
      toast.success(`Order #${orderId} updated to ${statusLabel(res.status)}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading order…
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="space-y-4">
        <Link to="/admin/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to orders
        </Link>
        <div className="border border-red-200 bg-red-50 text-red-800 p-4 text-sm">
          {error || "Order not found"}
        </div>
      </div>
    );
  }

  const totals = detail.totals || {};

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to orders
        </button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-baskerville text-3xl text-foreground mb-1">Order #{detail.id}</h1>
            <p className="text-muted-foreground text-sm">
              {formatDate(detail.created_at)}
              {" · "}
              <span
                className={`inline-block px-2 py-0.5 text-xs uppercase tracking-wider ${statusColor(
                  detail.status,
                )}`}
              >
                {statusLabel(detail.status)}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Update status
            </span>
            <Select value={detail.status} onValueChange={updateStatus} disabled={updating}>
              <SelectTrigger className="h-9 w-[200px] rounded-none text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {updating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 text-sm">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-baskerville text-base text-foreground">Items</h2>
          <div className="border border-border">
            <table className="w-full text-sm">
              <thead className="bg-[#f4f3ec] text-left text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2 text-xs">Product</th>
                  <th className="px-3 py-2 text-xs">ISBN</th>
                  <th className="px-3 py-2 text-xs">Format</th>
                  <th className="px-3 py-2 text-xs text-center">Qty</th>
                  <th className="px-3 py-2 text-xs text-right">Unit</th>
                  <th className="px-3 py-2 text-xs text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {detail.items.map((it, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-3 py-2 text-foreground">{it.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{it.isbn || "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{it.format || "—"}</td>
                    <td className="px-3 py-2 text-center">{it.quantity}</td>
                    <td className="px-3 py-2 text-right">
                      {formatMoney(it.unit_price, detail.currency)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatMoney(it.total ?? it.subtotal, detail.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border border-border bg-[#f4f3ec] p-4">
            <h3 className="font-baskerville text-base text-foreground mb-3">Order summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {typeof totals.items_subtotal === "number" && (
                <SummaryCell label="Subtotal" value={formatMoney(totals.items_subtotal, detail.currency)} />
              )}
              {typeof totals.shipping === "number" && (
                <SummaryCell label="Shipping" value={formatMoney(totals.shipping, detail.currency)} />
              )}
              {typeof totals.discount === "number" && totals.discount > 0 && (
                <SummaryCell label="Discount" value={`−${formatMoney(totals.discount, detail.currency)}`} />
              )}
              {typeof totals.tax === "number" && (
                <SummaryCell label="Tax" value={formatMoney(totals.tax, detail.currency)} />
              )}
              {typeof totals.total === "number" && (
                <SummaryCell label="Total" value={formatMoney(totals.total, detail.currency)} highlight />
              )}
            </div>
          </div>

          {detail.coupons && detail.coupons.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Coupons:{" "}
              {detail.coupons
                .map((c) => c.code || `−${formatMoney(c.discount, detail.currency)}`)
                .join(", ")}
            </div>
          )}

          {detail.customer_note && (
            <div className="text-sm border border-border bg-white p-3">
              <span className="text-muted-foreground">Note: </span>
              {detail.customer_note}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <AddressBlock title="Billing" addr={detail.billing} />
          <AddressBlock title="Shipping" addr={detail.shipping} />
          <div className="border border-border p-4 bg-white text-sm space-y-2">
            <div className="font-medium text-foreground uppercase tracking-wider text-xs mb-2">
              Payment
            </div>
            <PaymentRow label="Method" value={detail.payment_method_title || detail.payment_method || "—"} />
            {detail.transaction_id && <PaymentRow label="Tx" value={detail.transaction_id} mono />}
            {detail.vendor_tx_code && <PaymentRow label="Vendor Tx" value={detail.vendor_tx_code} mono />}
            {detail.opayo_status && <PaymentRow label="Opayo status" value={detail.opayo_status} />}
            {detail.ip_address && <PaymentRow label="IP" value={detail.ip_address} mono />}
            {detail.updated_at && <PaymentRow label="Updated" value={formatDate(detail.updated_at)} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`border border-border bg-white p-3 ${highlight ? "border-[#C75B2A]" : ""}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`font-baskerville mt-1 ${highlight ? "text-foreground text-lg" : "text-foreground text-base"}`}>
        {value}
      </div>
    </div>
  );
}

function PaymentRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground text-xs uppercase tracking-wider">{label}</span>
      <span className={`text-foreground text-right break-all ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function AddressBlock({ title, addr }: { title: string; addr?: CmsOrderAddress }) {
  if (!addr) return null;
  const lines = [
    [addr.first_name, addr.last_name].filter(Boolean).join(" "),
    addr.company,
    addr.address_1,
    addr.address_2,
    [addr.city, addr.state, addr.postcode].filter(Boolean).join(", "),
    addr.country,
    addr.email,
    addr.phone,
  ].filter((l) => l && String(l).trim().length > 0);

  if (lines.length === 0) return null;
  return (
    <div className="border border-border p-4 bg-white text-sm">
      <div className="font-medium text-foreground uppercase tracking-wider text-xs mb-2">
        {title}
      </div>
      <div className="space-y-0.5">
        {lines.map((l, i) => (
          <div key={i} className={i === 0 ? "text-foreground font-medium" : "text-muted-foreground"}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}