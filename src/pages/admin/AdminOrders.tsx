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
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-center">Items</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-border hover:bg-muted/30 cursor-pointer"
                  onClick={() => navigate(`/admin/orders/${o.id}`)}
                >
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
                  <td className="px-4 py-3 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                  </td>
                </tr>
              ))}
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

