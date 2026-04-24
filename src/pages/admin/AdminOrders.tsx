import { useEffect, useState } from "react";
import { Loader2, ChevronDown, ChevronUp, Package, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import {
  listOrders,
  getOrder,
  type OrderSummary,
  type OrderDetail,
} from "@/services/accountService";

const CURRENCY_SYMBOL: Record<string, string> = { GBP: "£", USD: "$", EUR: "€" };

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

const PER_PAGE = 20;

export default function AdminOrders() {
  const { isAuthenticated, user } = useExternalAuth();

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [detailCache, setDetailCache] = useState<Record<number, OrderDetail>>({});
  const [detailLoadingId, setDetailLoadingId] = useState<number | null>(null);
  const [detailError, setDetailError] = useState<Record<number, string>>({});

  const load = async (p = page) => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await listOrders(p, PER_PAGE);
      setOrders(res?.orders || []);
      setPage(res?.pagination?.page || p);
      setPages(res?.pagination?.pages || 1);
      setTotal(res?.pagination?.total || (res?.orders?.length ?? 0));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load orders";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const toggleExpand = async (orderId: number) => {
    if (expandedId === orderId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(orderId);
    if (detailCache[orderId]) return;
    setDetailLoadingId(orderId);
    try {
      const d = await getOrder(orderId);
      setDetailCache((prev) => ({ ...prev, [orderId]: d }));
      setDetailError((prev) => {
        const { [orderId]: _, ...rest } = prev;
        return rest;
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load order";
      setDetailError((prev) => ({ ...prev, [orderId]: msg }));
    } finally {
      setDetailLoadingId(null);
    }
  };

  // ── Empty / unauthenticated states ─────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="font-baskerville text-3xl text-foreground mb-2">Orders</h1>
          <p className="text-muted-foreground">
            Showing orders for the currently signed-in customer account.
          </p>
        </div>
        <div className="border border-border bg-[#f4f3ec] p-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-foreground">No customer signed in</p>
            <p className="text-muted-foreground mt-1">
              The Orders API is per-customer (requires a customer access token).
              Open the storefront and sign in with the customer account whose
              orders you want to view, then return here.
            </p>
            <a
              href="/auth"
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-3 text-xs uppercase tracking-wider text-accent border-b border-accent"
            >
              Open storefront sign-in →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-baskerville text-3xl text-foreground mb-2">Orders</h1>
          <p className="text-muted-foreground text-sm">
            Orders for{" "}
            <span className="font-medium text-foreground">
              {user?.email || "current customer"}
            </span>
            {total > 0 && <> · {total} total</>}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => void load(page)}
          disabled={loading}
          className="rounded-none uppercase tracking-wider text-xs"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-800 p-4 text-sm">
          {error}
        </div>
      )}

      {loading && orders.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading orders…
        </div>
      ) : orders.length === 0 ? (
        <div className="border border-border bg-[#f4f3ec] p-10 text-center">
          <Package className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-foreground font-medium">No orders found</p>
          <p className="text-sm text-muted-foreground mt-1">
            This customer hasn't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="border border-border">
          <table className="w-full text-sm">
            <thead className="bg-[#f4f3ec] text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const isOpen = expandedId === o.id;
                const detail = detailCache[o.id];
                return (
                  <>
                    <tr
                      key={`row-${o.id}`}
                      className="border-t border-border hover:bg-muted/30 cursor-pointer"
                      onClick={() => void toggleExpand(o.id)}
                    >
                      <td className="px-4 py-3 text-muted-foreground">
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">#{o.id}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(o.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs uppercase tracking-wider ${statusColor(
                            o.status,
                          )}`}
                        >
                          {statusLabel(o.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {o.payment_method_title || "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {o.billing_email || "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatMoney(o.total_amount, o.currency)}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr key={`detail-${o.id}`} className="bg-[#fafaf6]">
                        <td colSpan={7} className="px-4 py-4">
                          {detailLoadingId === o.id ? (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Loading details…
                            </div>
                          ) : detailError[o.id] ? (
                            <div className="text-sm text-red-700">
                              {detailError[o.id]}
                            </div>
                          ) : detail ? (
                            <OrderDetailBlock detail={detail} />
                          ) : null}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => void load(page - 1)}
              className="rounded-none uppercase tracking-wider text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= pages || loading}
              onClick={() => void load(page + 1)}
              className="rounded-none uppercase tracking-wider text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderDetailBlock({ detail }: { detail: OrderDetail }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 text-sm">
      {/* Items */}
      <div className="md:col-span-2 space-y-3">
        <h3 className="font-baskerville text-base text-foreground">Items</h3>
        <div className="border border-border">
          <table className="w-full text-xs">
            <thead className="bg-white text-left text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">ISBN</th>
                <th className="px-3 py-2 text-center">Qty</th>
                <th className="px-3 py-2 text-right">Unit</th>
                <th className="px-3 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {detail.items.map((it, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-2 text-foreground">{it.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {it.isbn || "—"}
                  </td>
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

        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs max-w-sm ml-auto pt-2">
          {typeof detail.shipping_total_amount === "number" && (
            <>
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-right">
                {formatMoney(detail.shipping_total_amount, detail.currency)}
              </span>
            </>
          )}
          {typeof detail.discount_total_amount === "number" &&
            detail.discount_total_amount > 0 && (
              <>
                <span className="text-muted-foreground">Discount</span>
                <span className="text-right">
                  −{formatMoney(detail.discount_total_amount, detail.currency)}
                </span>
              </>
            )}
          {typeof detail.tax_amount === "number" && (
            <>
              <span className="text-muted-foreground">Tax</span>
              <span className="text-right">
                {formatMoney(detail.tax_amount, detail.currency)}
              </span>
            </>
          )}
          <span className="text-foreground font-medium">Total</span>
          <span className="text-right font-medium">
            {formatMoney(detail.total_amount, detail.currency)}
          </span>
        </div>

        {detail.coupons && detail.coupons.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Coupons:{" "}
            {detail.coupons
              .map((c) => c.code || `−${formatMoney(c.discount, detail.currency)}`)
              .join(", ")}
          </div>
        )}

        {detail.customer_note && (
          <div className="text-xs">
            <span className="text-muted-foreground">Note: </span>
            {detail.customer_note}
          </div>
        )}
      </div>

      {/* Addresses + meta */}
      <div className="space-y-4">
        <AddressBlock title="Billing" addr={detail.billing} />
        <AddressBlock title="Shipping" addr={detail.shipping} />
        <div className="border border-border p-3 bg-white text-xs space-y-1">
          <div>
            <span className="text-muted-foreground">Payment: </span>
            {detail.payment_method_title || detail.payment_method || "—"}
          </div>
          {detail.transaction_id && (
            <div>
              <span className="text-muted-foreground">Tx: </span>
              {detail.transaction_id}
            </div>
          )}
          {detail.date_paid_gmt && (
            <div>
              <span className="text-muted-foreground">Paid: </span>
              {formatDate(detail.date_paid_gmt)}
            </div>
          )}
          {detail.date_completed_gmt && (
            <div>
              <span className="text-muted-foreground">Completed: </span>
              {formatDate(detail.date_completed_gmt)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddressBlock({
  title,
  addr,
}: {
  title: string;
  addr?: OrderDetail["billing"];
}) {
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
    <div className="border border-border p-3 bg-white text-xs">
      <div className="font-medium text-foreground uppercase tracking-wider text-[10px] mb-1">
        {title}
      </div>
      {lines.map((l, i) => (
        <div key={i} className="text-muted-foreground">
          {l}
        </div>
      ))}
    </div>
  );
}