import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Save, X, ArrowUp, ArrowDown } from "lucide-react";
import { adminApi, type CmsFeaturedBook } from "@/services/cmsService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type EditState = Partial<CmsFeaturedBook> & { _new?: boolean };
const empty: EditState = { _new: true, title: "", display_order: 0, is_published: true };

export default function AdminFeaturedBooks() {
  const [items, setItems] = useState<CmsFeaturedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    setLoading(true);
    try { setItems(await adminApi.listFeaturedBooks()); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      if (editing._new) await adminApi.createFeaturedBook(editing);
      else await adminApi.updateFeaturedBook(editing as CmsFeaturedBook);
      toast.success("Saved");
      setEditing(null); reload();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this featured book?")) return;
    try { await adminApi.deleteFeaturedBook(id); toast.success("Deleted"); reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
  };

  const move = async (i: number, dir: -1 | 1) => {
    const t = i + dir; if (t < 0 || t >= items.length) return;
    const a = items[i], b = items[t];
    await Promise.all([
      adminApi.updateFeaturedBook({ ...a, display_order: b.display_order ?? 0 }),
      adminApi.updateFeaturedBook({ ...b, display_order: a.display_order ?? 0 }),
    ]);
    reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-baskerville text-2xl sm:text-3xl">Featured Books</h1>
          <p className="text-muted-foreground text-sm">Books shown in the homepage Featured Books slider.</p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing({ ...empty })} className="bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-1" /> New
          </Button>
        )}
      </div>

      {editing && (
        <div className="border border-border p-4 sm:p-6 space-y-4 bg-[#fafafa]">
          <div className="flex justify-between">
            <h2 className="font-baskerville text-xl">{editing._new ? "New featured book" : "Edit"}</h2>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
          </div>
          <Field label="Title">
            <input className="w-full border border-border px-3 py-2 text-sm" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </Field>
          <Field label="Subtitle">
            <input className="w-full border border-border px-3 py-2 text-sm" value={editing.subtitle || ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
          </Field>
          <Field label="Author">
            <input className="w-full border border-border px-3 py-2 text-sm" value={editing.author || ""} onChange={(e) => setEditing({ ...editing, author: e.target.value })} />
          </Field>
          <Field label="Cover image URL">
            <input className="w-full border border-border px-3 py-2 text-sm" value={editing.cover_image || ""} onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })} />
            {editing.cover_image && <img src={editing.cover_image} alt="" className="mt-2 w-20 h-28 object-cover" />}
          </Field>
          <Field label="Link URL (e.g. /books/9781234567890)">
            <input className="w-full border border-border px-3 py-2 text-sm" value={editing.link_url || ""} onChange={(e) => setEditing({ ...editing, link_url: e.target.value })} />
          </Field>
          <Field label="Short description">
            <textarea rows={3} className="w-full border border-border px-3 py-2 text-sm" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </Field>
          <Field label="Display order">
            <input type="number" className="w-32 border border-border px-3 py-2 text-sm" value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={editing.is_published ?? true} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} />
            Published
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
        <div className="py-12 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline" /> Loading…</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border border-dashed border-border">No featured books yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={it.id} className="border border-border p-3 flex gap-3 items-center">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">#{i + 1}</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={i===0} onClick={() => move(i,-1)}><ArrowUp className="h-3 w-3" /></Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={i===items.length-1} onClick={() => move(i,1)}><ArrowDown className="h-3 w-3" /></Button>
              </div>
              {it.cover_image && <img src={it.cover_image} alt="" className="w-12 h-16 object-cover" />}
              <div className="flex-1 min-w-0">
                <div className="font-baskerville text-base">{it.title}</div>
                {it.author && <div className="text-xs text-muted-foreground">{it.author}</div>}
                {!it.is_published && <span className="text-[10px] uppercase text-muted-foreground">Draft</span>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setEditing({ ...it })}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => remove(it.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-nav uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}