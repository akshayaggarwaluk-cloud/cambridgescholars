import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Package,
  RefreshCw,
  Search,
  X,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  adminSession,
  type CmsOrderSummary,
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

const PER_PAGE = 25;

export default function AdminOrders() {
  const adminUser = adminSession.getUser();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<CmsOrderSummary[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const load = async (
    p = page,
    overrides: { q?: string; status?: string; date_from?: string; date_to?: string } = {},
  ) => {
    setLoading(true);
    setError(null);
    try {
      const q = overrides.q !== undefined ? overrides.q : search;
      const status = overrides.status !== undefined ? overrides.status : statusFilter;
      const df = overrides.date_from !== undefined ? overrides.date_from : dateFrom;
      const dt = overrides.date_to !== undefined ? overrides.date_to : dateTo;

      const res = await adminApi.listAllOrders({
        page: p,
        per_page: PER_PAGE,
        q: q || undefined,
        status: status && status !== "all" ? status : undefined,
        date_from: df || undefined,
        date_to: dt || undefined,
        sort: "created_at",
        order: "desc",
      });
      setOrders(res?.data || []);
      setPage(res?.page || p);
      setPages(res?.total_pages || 1);
      setTotal(res?.total || (res?.data?.length ?? 0));
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
  }, []);

  const toggleExpand = async (orderId: number) => {
    if (expandedId === orderId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(orderId);
    if (detailCache[orderId]) return;
    setDetailLoadingId(orderId);
    try {
      const d = await adminApi.getOrderById(orderId);
      setDetailCache((prev) => ({ ...prev, [orderId]: d }));
      setDetailError((prev) => {
        const { [orderId]: _omit, ...rest } = prev;
        return rest;
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load order";
      setDetailError((prev) => ({ ...prev, [orderId]: msg }));
    } finally {
      setDetailLoadingId(null);
    }
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    setStatusUpdatingId(orderId);
    try {
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: res.status, updated_at: res.updated_at } : o,
        ),
      );
      setDetailCache((prev) =>
        prev[orderId] ? { ...prev, [orderId]: { ...prev[orderId], status: res.status } } : prev,
      );
      toast.success(`Order #${orderId} updated to ${statusLabel(res.status)}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const applyFilters = () => {
    setSearch(searchInput.trim());
    void load(1, { q: searchInput.trim() });
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    void load(1, { q: "", status: "all", date_from: "", date_to: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-baskerville text-3xl text-foreground mb-2">Orders</h1>
          <p className="text-muted-foreground text-sm">
            All customer orders
            {adminUser?.email && (
              <>
                {" · signed in as "}
                <span className="font-medium text-foreground">{adminUser.email}</span>
              </>
            )}
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

      {/* Filter bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters();
        }}
        className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-end"
      >
        <div className="lg:col-span-2">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Order #, email, or name"
              className="pl-8 pr-8 h-9 rounded-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
            Status
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 rounded-none">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
            From
          </label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 rounded-none"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
            To
          </label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9 rounded-none"
          />
        </div>

        <div className="lg:col-span-5 flex gap-2">
          <Button
            type="submit"
            className="rounded-none uppercase tracking-wider text-xs"
            disabled={loading}
          >
            Apply filters
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            disabled={loading}
            className="rounded-none uppercase tracking-wider text-xs"
          >
            Reset
          </Button>
        </div>
      </form>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-800 p-4 text-sm">{error}</div>
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
            Try adjusting filters or search criteria.
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
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-center">Items</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const isOpen = expandedId === o.id;
                const detail = detailCache[o.id];
                return (
                  <Fragment key={o.id}>
                    <tr
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
                        <div className="text-foreground">{o.billing_name || "—"}</div>
                        <div className="text-xs">{o.billing_email || ""}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {o.payment_method_title || o.payment_method || "—"}
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground">
                        {o.item_count ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatMoney(o.total_amount, o.currency)}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-[#fafaf6]">
                        <td colSpan={8} className="px-4 py-4">
                          {detailLoadingId === o.id ? (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Loading details…
                            </div>
                          ) : detailError[o.id] ? (
                            <div className="text-sm text-red-700">{detailError[o.id]}</div>
                          ) : detail ? (
                            <OrderDetailBlock
                              detail={detail}
                              currentStatus={o.status}
                              updating={statusUpdatingId === o.id}
                              onStatusChange={(newStatus) => void updateStatus(o.id, newStatus)}
                            />
                          ) : null}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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

function OrderDetailBlock({
  detail,
  currentStatus,
  updating,
  onStatusChange,
}: {
  detail: CmsOrderDetail;
  currentStatus: string;
  updating: boolean;
  onStatusChange: (status: string) => void;
}) {
  const totals = detail.totals || {};
  return (
    <div className="grid md:grid-cols-3 gap-6 text-sm">
      <div className="md:col-span-2 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-baskerville text-base text-foreground">Items</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Update status
            </span>
            <Select
              value={currentStatus}
              onValueChange={onStatusChange}
              disabled={updating}
            >
              <SelectTrigger className="h-8 w-[180px] rounded-none text-xs">
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
        <div className="border border-border">
          <table className="w-full text-xs">
            <thead className="bg-white text-left text-muted-foreground uppercase tracking-wider">
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

        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs max-w-sm ml-auto pt-2">
          {typeof totals.items_subtotal === "number" && (
            <>
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-right">
                {formatMoney(totals.items_subtotal, detail.currency)}
              </span>
            </>
          )}
          {typeof totals.shipping === "number" && (
            <>
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-right">{formatMoney(totals.shipping, detail.currency)}</span>
            </>
          )}
          {typeof totals.discount === "number" && totals.discount > 0 && (
            <>
              <span className="text-muted-foreground">Discount</span>
              <span className="text-right">−{formatMoney(totals.discount, detail.currency)}</span>
            </>
          )}
          {typeof totals.tax === "number" && (
            <>
              <span className="text-muted-foreground">Tax</span>
              <span className="text-right">{formatMoney(totals.tax, detail.currency)}</span>
            </>
          )}
          {typeof totals.total === "number" && (
            <>
              <span className="text-foreground font-medium">Total</span>
              <span className="text-right font-medium">
                {formatMoney(totals.total, detail.currency)}
              </span>
            </>
          )}
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
          {detail.vendor_tx_code && (
            <div>
              <span className="text-muted-foreground">Vendor Tx: </span>
              {detail.vendor_tx_code}
            </div>
          )}
          {detail.opayo_status && (
            <div>
              <span className="text-muted-foreground">Opayo status: </span>
              {detail.opayo_status}
            </div>
          )}
          {detail.ip_address && (
            <div>
              <span className="text-muted-foreground">IP: </span>
              {detail.ip_address}
            </div>
          )}
          {detail.updated_at && (
            <div>
              <span className="text-muted-foreground">Updated: </span>
              {formatDate(detail.updated_at)}
            </div>
          )}
        </div>
      </div>
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
