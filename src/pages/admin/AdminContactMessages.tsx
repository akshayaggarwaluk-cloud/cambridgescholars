import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Inbox, RefreshCw, Search, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  adminApi, adminSession, type CmsContactMessageSummary,
} from "@/services/cmsService";

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

const PER_PAGE = 25;

export default function AdminContactMessages() {
  const adminUser = adminSession.getUser();
  const navigate = useNavigate();

  const [rows, setRows] = useState<CmsContactMessageSummary[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const load = async (
    p = page,
    overrides: { q?: string; date_from?: string; date_to?: string } = {},
  ) => {
    setLoading(true);
    setError(null);
    try {
      const q = overrides.q !== undefined ? overrides.q : search;
      const df = overrides.date_from !== undefined ? overrides.date_from : dateFrom;
      const dt = overrides.date_to !== undefined ? overrides.date_to : dateTo;

      const res = await adminApi.listContactMessages({
        page: p,
        per_page: PER_PAGE,
        q: q || undefined,
        date_from: df || undefined,
        date_to: dt || undefined,
        sort: "created_at",
        order: "desc",
      });
      setRows(res?.data || []);
      setPage(res?.page || p);
      setPages(res?.total_pages || 1);
      setTotal(res?.total || (res?.data?.length ?? 0));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load messages";
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
    setDateFrom("");
    setDateTo("");
    void load(1, { q: "", date_from: "", date_to: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-baskerville text-3xl text-foreground mb-2">Contact Submissions</h1>
          <p className="text-muted-foreground text-sm">
            Messages submitted via the public contact form
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
        className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-end"
      >
        <div className="lg:col-span-3">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Search</label>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Name, email, subject or message body"
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
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">From</label>
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 rounded-none" />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">To</label>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 rounded-none" />
        </div>

        <div className="lg:col-span-5 flex gap-2">
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
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading messages…
        </div>
      ) : rows.length === 0 ? (
        <div className="border border-border bg-[#f4f3ec] p-10 text-center">
          <Inbox className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-foreground font-medium">No messages found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting filters or search criteria.</p>
        </div>
      ) : (
        <div className="border border-border">
          <table className="w-full text-sm">
            <thead className="bg-[#f4f3ec] text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Ticket</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-border hover:bg-muted/30 cursor-pointer"
                  onClick={() => navigate(`/admin/contact-submissions/${r.id}`)}
                >
                  <td className="px-4 py-3 font-medium">{r.ticket_id || `#${r.id}`}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(r.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="text-foreground">{r.name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    <div>{r.subject || r.subject_name || "—"}</div>
                    {r.subject_name && r.subject && r.subject_name !== r.subject && (
                      <div className="text-xs text-muted-foreground">{r.subject_name}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-md truncate">
                    {r.message_preview || "—"}
                  </td>
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