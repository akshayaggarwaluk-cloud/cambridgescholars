import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { adminApi, type CmsCustomerUserDetail, type CmsCustomerAddress } from "@/services/cmsService";

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function formatMoney(v?: number | null, currency = "GBP") {
  if (v === null || v === undefined) return "—";
  const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : currency === "EUR" ? "€" : "";
  return `${symbol}${Number(v).toFixed(2)}`;
}

function AddressBlock({ a }: { a?: CmsCustomerAddress | null }) {
  if (!a) return <div className="text-sm text-muted-foreground">—</div>;
  const lines = [
    [a.first_name, a.last_name].filter(Boolean).join(" "),
    a.company,
    a.address_1,
    a.address_2,
    [a.city, a.state, a.postcode].filter(Boolean).join(", "),
    a.country,
    a.email,
    a.phone,
  ].filter(Boolean);
  if (!lines.length) return <div className="text-sm text-muted-foreground">—</div>;
  return (
    <div className="text-sm space-y-0.5">
      {lines.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  );
}

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<CmsCustomerUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    adminApi.getCustomerUser(id)
      .then((data) => { if (!cancelled) setUser(data); })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : "Failed to load user";
        if (!cancelled) setError(msg);
        toast.error(msg);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading user…
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate("/admin/users")} className="rounded-none uppercase tracking-wider text-xs">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="border border-red-200 bg-red-50 text-red-800 p-4 text-sm">
          {error || "User not found"}
        </div>
      </div>
    );
  }

  const stats = user.stats || {};
  const fullName =
    user.display_name ||
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.username ||
    user.email;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/users")}
            className="rounded-none uppercase tracking-wider text-xs mb-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to users
          </Button>
          <h1 className="font-baskerville text-3xl text-foreground">{fullName}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            #{user.id} · {user.email}
            {user.is_active === false && <> · <span className="text-red-600">Inactive</span></>}
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="rounded-none uppercase tracking-wider text-xs"
        >
          <a href={`mailto:${user.email}`}><Mail className="h-4 w-4 mr-2" /> Email user</a>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Successful orders", value: stats.successful_orders ?? 0 },
          { label: "Total orders", value: stats.total_orders ?? 0 },
          { label: "Lifetime spend", value: formatMoney(stats.lifetime_spend) },
          { label: "Last order", value: formatDate(stats.last_order_at) },
          { label: "Wishlist items", value: stats.wishlist_count ?? 0 },
          { label: "Ebooks", value: stats.ebook_count ?? 0 },
        ].map((s) => (
          <div key={s.label} className="border border-border bg-white p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="text-lg font-medium text-foreground mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="border border-border bg-white p-5">
          <h2 className="font-baskerville text-lg mb-3">Profile</h2>
          <dl className="text-sm space-y-1.5">
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Username</dt><dd>{user.username || "—"}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Display name</dt><dd>{user.display_name || "—"}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">First name</dt><dd>{user.first_name || "—"}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Last name</dt><dd>{user.last_name || "—"}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Phone</dt><dd>{user.phone || "—"}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">WP user ID</dt><dd>{user.wp_user_id ?? "—"}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Registered</dt><dd>{formatDate(user.registered_at || user.created_at)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Updated</dt><dd>{formatDate(user.updated_at)}</dd></div>
          </dl>
        </div>
        <div className="border border-border bg-white p-5">
          <h2 className="font-baskerville text-lg mb-3">Billing address</h2>
          <AddressBlock a={user.billing} />
        </div>
        <div className="border border-border bg-white p-5">
          <h2 className="font-baskerville text-lg mb-3">Shipping address</h2>
          <AddressBlock a={user.shipping} />
        </div>
      </div>

      {/* Recent orders */}
      <div className="border border-border bg-white">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-baskerville text-lg">Recent orders</h2>
          <span className="text-xs text-muted-foreground">Last 5</span>
        </div>
        {!user.recent_orders || user.recent_orders.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">No recent orders.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#f4f3ec] text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {user.recent_orders.map((o) => (
                <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${o.id}`} className="text-accent hover:underline font-medium">
                      #{o.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(o.created_at)}</td>
                  <td className="px-4 py-3">{o.status}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {o.payment_method_title || "—"}
                    {o.failure_reason && (
                      <div className="text-xs text-red-600 mt-0.5">{o.failure_reason}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">{formatMoney(o.total_amount, o.currency || "GBP")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}