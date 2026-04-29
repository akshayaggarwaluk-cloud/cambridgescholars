import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Save, X, Power } from "lucide-react";
import { adminApi, type CmsCoupon, type CmsPagination } from "@/services/cmsService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type EditState = {
  _new?: boolean;
  id?: number;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number | "";
  min_order_gbp: number | "";
  max_uses: number | "";
  expires_at: string; // datetime-local string ("" = no expiry)
  active: boolean;
  /** Empty array = applies to all bindings. */
  bindings: BindingType[];
};

type BindingType = "hardback" | "paperback" | "ebook";
const ALL_BINDINGS: { value: BindingType; label: string }[] = [
  { value: "hardback", label: "Hardback" },
  { value: "paperback", label: "Paperback" },
  { value: "ebook", label: "Ebook" },
];

const empty: EditState = {
  _new: true,
  code: "",
  discount_type: "percent",
  discount_value: 10,
  min_order_gbp: "",
  max_uses: "",
  expires_at: "",
  active: true,
  bindings: [],
};

type ActiveFilter = "all" | "active" | "inactive";

const PER_PAGE = 20;

function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const tzOff = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tzOff).toISOString().slice(0, 16);
}

function toIsoFromInput(local: string): string | null {
  if (!local) return null;
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function couponToEdit(c: CmsCoupon): EditState {
  return {
    id: c.id,
    code: c.code,
    discount_type: c.discount_type,
    discount_value: c.discount_value,
    min_order_gbp: c.min_order_gbp ?? "",
    max_uses: c.max_uses ?? "",
    expires_at: toLocalInputValue(c.expires_at),
    active: c.active,
    bindings: Array.isArray(c.bindings)
      ? (c.bindings.filter((b) =>
          (ALL_BINDINGS as { value: string }[]).some((x) => x.value === b),
        ) as BindingType[])
      : [],
  };
}

export default function AdminCoupons() {
  const [items, setItems] = useState<CmsCoupon[]>([]);
  const [pagination, setPagination] = useState<CmsPagination | null>(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<ActiveFilter>("all");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const res = await adminApi.listCoupons({
        page,
        per_page: PER_PAGE,
        active: filter === "all" ? undefined : filter === "active",
      });
      setItems(res.data || []);
      setPagination(res.pagination ?? null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [page, filter]);

  const save = async () => {
    if (!editing) return;
    const code = editing.code.trim().toUpperCase();
    if (!code) { toast.error("Code is required"); return; }
    if (editing.discount_value === "" || Number(editing.discount_value) <= 0) {
      toast.error("Discount value must be greater than 0"); return;
    }
    if (editing.discount_type === "percent" && Number(editing.discount_value) > 100) {
      toast.error("Percent discount cannot exceed 100"); return;
    }
    setSaving(true);
    try {
      const payload = {
        code,
        discount_type: editing.discount_type,
        discount_value: Number(editing.discount_value),
        min_order_gbp: editing.min_order_gbp === "" ? null : Number(editing.min_order_gbp),
        max_uses: editing.max_uses === "" ? null : Number(editing.max_uses),
        expires_at: toIsoFromInput(editing.expires_at),
        active: editing.active,
        // Empty array signals "all bindings" to the API.
        bindings: editing.bindings,
      };
      if (editing._new) {
        await adminApi.createCoupon(payload);
        toast.success("Coupon created");
      } else if (editing.id != null) {
        await adminApi.updateCoupon(editing.id, payload);
        toast.success("Coupon updated");
      }
      setEditing(null);
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: CmsCoupon) => {
    if (!confirm(`Delete coupon "${c.code}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteCoupon(c.id);
      toast.success("Coupon deleted");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const toggleActive = async (c: CmsCoupon) => {
    try {
      await adminApi.updateCoupon(c.id, { active: !c.active });
      toast.success(c.active ? "Coupon disabled" : "Coupon enabled");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  const formatDiscount = (c: CmsCoupon) =>
    c.discount_type === "percent" ? `${c.discount_value}% off` : `£${c.discount_value.toFixed(2)} off`;

  const formatExpiry = (iso: string | null) => {
    if (!iso) return "Never";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    const expired = d.getTime() < Date.now();
    return `${d.toLocaleDateString()}${expired ? " (expired)" : ""}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-baskerville text-2xl sm:text-3xl text-foreground">Coupons</h1>
          <p className="text-muted-foreground text-sm">
            Discount codes customers can apply at checkout.
          </p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing({ ...empty })} className="bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-1" /> New coupon
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "active", "inactive"] as ActiveFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            className={
              "px-3 py-1.5 text-xs font-nav uppercase tracking-wider border " +
              (filter === f
                ? "border-accent text-accent bg-accent/5"
                : "border-border text-muted-foreground hover:text-foreground")
            }
          >
            {f}
          </button>
        ))}
      </div>

      {editing && (
        <div className="border border-border p-4 sm:p-6 space-y-4 bg-[#fafafa]">
          <div className="flex items-center justify-between">
            <h2 className="font-baskerville text-xl text-foreground">
              {editing._new ? "New coupon" : `Edit ${editing.code}`}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Code">
              <input
                type="text"
                value={editing.code}
                onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })}
                className="w-full border border-border px-3 py-2 text-sm font-mono uppercase"
                placeholder="AUTHOR40"
              />
            </Field>

            <Field label="Discount type">
              <select
                value={editing.discount_type}
                onChange={(e) => setEditing({ ...editing, discount_type: e.target.value as "percent" | "fixed" })}
                className="w-full border border-border px-3 py-2 text-sm bg-background"
              >
                <option value="percent">Percent (%)</option>
                <option value="fixed">Fixed amount (£)</option>
              </select>
            </Field>

            <Field label={editing.discount_type === "percent" ? "Discount value (%)" : "Discount value (£)"}>
              <input
                type="number"
                min={0}
                step={editing.discount_type === "percent" ? 1 : 0.01}
                value={editing.discount_value}
                onChange={(e) => setEditing({
                  ...editing,
                  discount_value: e.target.value === "" ? "" : Number(e.target.value),
                })}
                className="w-full border border-border px-3 py-2 text-sm"
              />
            </Field>

            <Field label="Minimum order (£, optional)">
              <input
                type="number"
                min={0}
                step={0.01}
                value={editing.min_order_gbp}
                onChange={(e) => setEditing({
                  ...editing,
                  min_order_gbp: e.target.value === "" ? "" : Number(e.target.value),
                })}
                className="w-full border border-border px-3 py-2 text-sm"
                placeholder="0.00"
              />
            </Field>

            <Field label="Max uses (optional)">
              <input
                type="number"
                min={1}
                step={1}
                value={editing.max_uses}
                onChange={(e) => setEditing({
                  ...editing,
                  max_uses: e.target.value === "" ? "" : Number(e.target.value),
                })}
                className="w-full border border-border px-3 py-2 text-sm"
                placeholder="Unlimited"
              />
            </Field>

            <Field label="Expires at (optional)">
              <input
                type="datetime-local"
                value={editing.expires_at}
                onChange={(e) => setEditing({ ...editing, expires_at: e.target.value })}
                className="w-full border border-border px-3 py-2 text-sm"
              />
            </Field>
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editing.active}
              onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
            />
            Active
          </label>

          <div className="flex gap-2 pt-2">
            <Button onClick={save} disabled={saving} className="bg-accent hover:bg-accent/90">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              {editing._new ? "Create" : "Save"}
            </Button>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin inline" /> Loading…
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border border-dashed border-border">
          No coupons yet.
        </div>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead className="bg-[#fafafa] text-left text-xs font-nav uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">Discount</th>
                <th className="px-3 py-2">Min order</th>
                <th className="px-3 py-2">Uses</th>
                <th className="px-3 py-2">Expires</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-3 py-2 font-mono">{c.code}</td>
                  <td className="px-3 py-2">{formatDiscount(c)}</td>
                  <td className="px-3 py-2">{c.min_order_gbp ? `£${c.min_order_gbp.toFixed(2)}` : "—"}</td>
                  <td className="px-3 py-2">
                    {c.uses_count}{c.max_uses ? ` / ${c.max_uses}` : ""}
                  </td>
                  <td className="px-3 py-2">{formatExpiry(c.expires_at)}</td>
                  <td className="px-3 py-2">
                    <span className={
                      "text-xs uppercase tracking-wider px-2 py-0.5 " +
                      (c.active ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground")
                    }>
                      {c.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" title="Edit" onClick={() => setEditing(couponToEdit(c))}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title={c.active ? "Disable" : "Enable"} onClick={() => toggleActive(c)}>
                      <Power className={"h-4 w-4 " + (c.active ? "" : "text-muted-foreground")} />
                    </Button>
                    <Button variant="ghost" size="sm" title="Delete" onClick={() => remove(c)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {pagination.current_page} of {pagination.total_pages} · {pagination.total_items} coupons
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= pagination.total_pages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-nav uppercase tracking-wider text-foreground">{label}</label>
      {children}
    </div>
  );
}