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

      {/* Box 1 — Items */}
      <Section title="Items">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#f4f3ec] text-left text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">ISBN</th>
                <th className="px-3 py-2">Format</th>
                <th className="px-3 py-2 text-center">Qty</th>
                <th className="px-3 py-2 text-right">Unit</th>
                <th className="px-3 py-2 text-right">Total</th>
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
        {detail.customer_note && (
          <div className="text-xs px-4 py-3 border-t border-border bg-[#f4f3ec]/40">
            <span className="text-muted-foreground">Note: </span>
            {detail.customer_note}
          </div>
        )}
      </Section>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Box 2 — Totals */}
        <Section title="Totals">
          <dl className="divide-y divide-border text-sm">
            {typeof totals.items_subtotal === "number" && (
              <Row label="Subtotal" value={formatMoney(totals.items_subtotal, detail.currency)} />
            )}
            {typeof totals.shipping === "number" && (
              <Row label="Shipping" value={formatMoney(totals.shipping, detail.currency)} />
            )}
            {typeof totals.discount === "number" && totals.discount > 0 && (
              <Row
                label="Discount"
                value={`−${formatMoney(totals.discount, detail.currency)}`}
              />
            )}
            {typeof totals.tax === "number" && (
              <Row label="Tax" value={formatMoney(totals.tax, detail.currency)} />
            )}
            {typeof totals.total === "number" && (
              <Row
                label="Total"
                value={formatMoney(totals.total, detail.currency)}
                emphasis
              />
            )}
          </dl>
          {detail.coupons && detail.coupons.length > 0 && (
            <div className="text-xs text-muted-foreground px-4 py-3 border-t border-border">
              Coupons:{" "}
              {detail.coupons
                .map((c) => c.code || `−${formatMoney(c.discount, detail.currency)}`)
                .join(", ")}
            </div>
          )}
        </Section>

        {/* Box 4 — Payment */}
        <Section title="Payment">
          <dl className="divide-y divide-border text-sm">
            <Row
              label="Method"
              value={detail.payment_method_title || detail.payment_method || "—"}
            />
            {detail.transaction_id && (
              <Row label="Transaction" value={detail.transaction_id} mono />
            )}
            {detail.vendor_tx_code && (
              <Row label="Vendor Tx" value={detail.vendor_tx_code} mono />
            )}
            {detail.opayo_status && <Row label="Opayo status" value={detail.opayo_status} />}
            {detail.failure_reason && (
              <Row label="Failure reason" value={detail.failure_reason} highlight />
            )}
            {detail.ip_address && <Row label="IP address" value={detail.ip_address} mono />}
            {detail.updated_at && (
              <Row label="Updated" value={formatDate(detail.updated_at)} />
            )}
          </dl>
        </Section>
      </div>

      {/* Box 3 — Addresses */}
      <Section title="Addresses">
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <AddressColumn title="Billing" addr={detail.billing} />
          <AddressColumn title="Shipping" addr={detail.shipping} />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-border bg-white">
      <header className="px-4 py-2.5 border-b border-border bg-[#f4f3ec]">
        <h2 className="font-baskerville text-sm text-foreground uppercase tracking-wider">
          {title}
        </h2>
      </header>
      <div>{children}</div>
    </section>
  );
}

function Row({
  label,
  value,
  emphasis,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  emphasis?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd
        className={`text-right ${emphasis ? "font-semibold text-foreground" : "text-foreground"} ${
          mono ? "font-mono text-xs break-all" : "text-sm"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function AddressColumn({ title, addr }: { title: string; addr?: CmsOrderAddress }) {
  const lines = [
    [addr?.first_name, addr?.last_name].filter(Boolean).join(" "),
    addr?.company,
    addr?.address_1,
    addr?.address_2,
    [addr?.city, addr?.state, addr?.postcode].filter(Boolean).join(", "),
    addr?.country,
    addr?.email,
    addr?.phone,
  ].filter((l) => l && String(l).trim().length > 0);

  return (
    <div className="p-4 space-y-1">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
        {title}
      </div>
      {lines.length === 0 ? (
        <div className="text-xs text-muted-foreground italic">No {title.toLowerCase()} address</div>
      ) : (
        lines.map((l, i) => (
          <div key={i} className="text-sm text-foreground">
            {l}
          </div>
        ))
      )}
    </div>
  );
}