import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Users, RefreshCw, Search, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  adminApi, adminSession, type CmsCustomerUserSummary,
} from "@/services/cmsService";

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

function formatMoney(v?: number | null) {
  if (v === null || v === undefined) return "—";
  return `£${Number(v).toFixed(2)}`;
}

const PER_PAGE = 25;

export default function AdminUsers() {
  const adminUser = adminSession.getUser();
  const navigate = useNavigate();

  const [rows, setRows] = useState<CmsCustomerUserSummary[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");
  const [hasOrders, setHasOrders] = useState<"" | "true" | "false">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const load = async (
    p = page,
    overrides: {
      q?: string;
      is_active?: "" | "true" | "false";
      has_orders?: "" | "true" | "false";
      date_from?: string;
      date_to?: string;
    } = {},
  ) => {
    setLoading(true);
    setError(null);
    try {
      const q = overrides.q !== undefined ? overrides.q : search;
      const ia = overrides.is_active !== undefined ? overrides.is_active : isActive;
      const ho = overrides.has_orders !== undefined ? overrides.has_orders : hasOrders;
      const df = overrides.date_from !== undefined ? overrides.date_from : dateFrom;
      const dt = overrides.date_to !== undefined ? overrides.date_to : dateTo;

      const res = await adminApi.listCustomerUsers({
        page: p,
        per_page: PER_PAGE,
        q: q || undefined,
        is_active: ia || undefined,
        has_orders: ho || undefined,
        date_from: df || undefined,
        date_to: dt || undefined,
        sort: "registered_at",
        order: "desc",
      });
      setRows(res?.data || []);
      setPage(res?.page || p);
      setPages(res?.total_pages || 1);
      setTotal(res?.total || (res?.data?.length ?? 0));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load users";
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
    setIsActive("");
    setHasOrders("");
    setDateFrom("");
    setDateTo("");
    void load(1, { q: "", is_active: "", has_orders: "", date_from: "", date_to: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-baskerville text-3xl text-foreground mb-2">Users</h1>
          <p className="text-muted-foreground text-sm">
            Customer accounts with order count and lifetime spend
            {adminUser?.email && (
              <>{" · signed in as "}<span className="font-medium text-foreground">{adminUser.email}</span></>
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
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); applyFilters(); }}
        className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 items-end"
      >
        <div className="lg:col-span-2">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Search</label>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Email, name or billing email"
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
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Active</label>
          <Select value={isActive || "all"} onValueChange={(v) => setIsActive(v === "all" ? "" : (v as "true" | "false"))}>
            <SelectTrigger className="h-9 rounded-none"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Has orders</label>
          <Select value={hasOrders || "all"} onValueChange={(v) => setHasOrders(v === "all" ? "" : (v as "true" | "false"))}>
            <SelectTrigger className="h-9 rounded-none"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">With orders</SelectItem>
              <SelectItem value="false">No orders</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">From</label>
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 rounded-none" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">To</label>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 rounded-none" />
        </div>

        <div className="lg:col-span-6 flex gap-2">
          <Button type="submit" className="rounded-none uppercase tracking-wider text-xs" disabled={loading}>
            Apply filters
          </Button>
          <Button type="button" variant="outline" onClick={resetFilters} disabled={loading} className="rounded-none uppercase tracking-wider text-xs">
            Reset
          </Button>
        </div>
      </form>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-800 p-4 text-sm">{error}</div>
      )}

      {loading && rows.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading users…
        </div>
      ) : rows.length === 0 ? (
        <div className="border border-border bg-[#f4f3ec] p-10 text-center">
          <Users className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-foreground font-medium">No users found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting filters or search criteria.</p>
        </div>
      ) : (
        <div className="border border-border">
          <table className="w-full text-sm">
            <thead className="bg-[#f4f3ec] text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Registered</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3 text-right">Orders</th>
                <th className="px-4 py-3 text-right">Lifetime spend</th>
                <th className="px-4 py-3">Last order</th>
                <th className="px-4 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-border hover:bg-muted/30 cursor-pointer"
                  onClick={() => navigate(`/admin/users/${r.id}`)}
                >
                  <td className="px-4 py-3 font-medium">#{r.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(r.registered_at || r.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="text-foreground">{r.name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.billing_country || "—"}</td>
                  <td className="px-4 py-3">
                    {r.is_active ? (
                      <span className="text-xs uppercase tracking-wider text-green-700">Yes</span>
                    ) : (
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">{r.order_count ?? 0}</td>
                  <td className="px-4 py-3 text-right">{formatMoney(r.lifetime_spend)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(r.last_order_at)}</td>
                  <td className="px-4 py-3 text-muted-foreground"><Eye className="h-4 w-4" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Page {page} of {pages}</span>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1 || loading} onClick={() => void load(page - 1)} className="rounded-none uppercase tracking-wider text-xs">
              Previous
            </Button>
            <Button variant="outline" disabled={page >= pages || loading} onClick={() => void load(page + 1)} className="rounded-none uppercase tracking-wider text-xs">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}