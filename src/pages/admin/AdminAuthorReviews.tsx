import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Save, X, GripVertical, Download, Search } from "lucide-react";
import { adminApi, type CmsAuthorReview } from "@/services/cmsService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fetchAuthorReviews } from "@/services/cspApi";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ApiReview {
  author: string;
  book_title: string;
  praise: string;
  date: string;
}

function parseAuthor(raw: string): { name: string; position: string } {
  if (!raw) return { name: "", position: "" };
  const seps = [" - ", " – ", ", "];
  for (const s of seps) {
    const i = raw.indexOf(s);
    if (i > 0) return { name: raw.slice(0, i).trim(), position: raw.slice(i + s.length).trim() };
  }
  return { name: raw, position: "" };
}

type EditState = Partial<CmsAuthorReview> & { _new?: boolean };
const empty: EditState = { _new: true, author_name: "", quote: "", display_order: 0, is_published: true };

export default function AdminAuthorReviews() {
  const [items, setItems] = useState<CmsAuthorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [apiReviews, setApiReviews] = useState<ApiReview[] | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [search, setSearch] = useState("");

  const reload = async () => {
    setLoading(true);
    try { setItems(await adminApi.listAuthorReviews()); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.author_name?.trim() || !editing.quote?.trim()) {
      toast.error("Author name and quote are required"); return;
    }
    setSaving(true);
    try {
      if (editing._new) await adminApi.createAuthorReview(editing);
      else await adminApi.updateAuthorReview(editing as CmsAuthorReview);
      toast.success("Saved"); setEditing(null); reload();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try { await adminApi.deleteAuthorReview(id); toast.success("Deleted"); reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
  };
  const move = async (i: number, dir: -1 | 1) => {
    const t = i + dir; if (t < 0 || t >= items.length) return;
    const a = items[i], b = items[t];
    await Promise.all([
      adminApi.updateAuthorReview({ ...a, display_order: b.display_order ?? 0 }),
      adminApi.updateAuthorReview({ ...b, display_order: a.display_order ?? 0 }),
    ]);
    reload();
  };

  const openPicker = async () => {
    setPickerOpen(true);
    if (apiReviews !== null) return;
    setApiLoading(true);
    try {
      const data = await fetchAuthorReviews();
      setApiReviews(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load API reviews");
      setApiReviews([]);
    } finally {
      setApiLoading(false);
    }
  };

  const importFromApi = (r: ApiReview) => {
    const { name, position } = parseAuthor(r.author);
    setEditing({
      ...empty,
      author_name: name,
      position,
      quote: r.praise,
      book_title: r.book_title,
    });
    setPickerOpen(false);
    toast.success("Loaded from API — review and Save to publish");
  };

  const filteredApi = (apiReviews || []).filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.author?.toLowerCase().includes(q) ||
      r.book_title?.toLowerCase().includes(q) ||
      r.praise?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-baskerville text-2xl sm:text-3xl">Author Reviews</h1>
          <p className="text-muted-foreground text-sm">Quotes shown in the homepage Author Reviews grid.</p>
        </div>
        {!editing && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={openPicker}>
              <Download className="h-4 w-4 mr-1" /> Import from API
            </Button>
            <Button onClick={() => setEditing({ ...empty })} className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-1" /> New
            </Button>
          </div>
        )}
      </div>

      {editing && (
        <div className="border border-border p-4 sm:p-6 space-y-4 bg-[#fafafa]">
          <div className="flex justify-between"><h2 className="font-baskerville text-xl">{editing._new ? "New review" : "Edit"}</h2><Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button></div>
          <Field label="Author name"><input className="w-full border border-border px-3 py-2 text-sm" value={editing.author_name || ""} onChange={(e) => setEditing({ ...editing, author_name: e.target.value })} /></Field>
          <Field label="Position / institution"><input className="w-full border border-border px-3 py-2 text-sm" value={editing.position || ""} onChange={(e) => setEditing({ ...editing, position: e.target.value })} /></Field>
          <Field label="Book title (optional)"><input className="w-full border border-border px-3 py-2 text-sm" value={editing.book_title || ""} onChange={(e) => setEditing({ ...editing, book_title: e.target.value })} /></Field>
          <Field label="Quote"><textarea rows={5} className="w-full border border-border px-3 py-2 text-sm" value={editing.quote || ""} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} /></Field>
          <Field label="Photo URL"><input className="w-full border border-border px-3 py-2 text-sm" value={editing.photo_url || ""} onChange={(e) => setEditing({ ...editing, photo_url: e.target.value })} />{editing.photo_url && <img src={editing.photo_url} alt="" className="mt-2 w-16 h-16 object-cover rounded-full" />}</Field>
          <Field label="Display order"><input type="number" className="w-32 border border-border px-3 py-2 text-sm" value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.is_published ?? true} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} /> Published</label>
          <div className="flex gap-2 pt-2"><Button onClick={save} disabled={saving} className="bg-accent hover:bg-accent/90">{saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}{editing._new ? "Create" : "Save"}</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline" /> Loading…</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border border-dashed border-border">No author reviews yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={it.id} className="border border-border p-3 flex gap-3 items-start">
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground">#{i + 1}</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={i===0} onClick={() => move(i,-1)}><ArrowUp className="h-3 w-3" /></Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={i===items.length-1} onClick={() => move(i,1)}><ArrowDown className="h-3 w-3" /></Button>
              </div>
              {it.photo_url && <img src={it.photo_url} alt="" className="w-12 h-12 object-cover rounded-full" />}
              <div className="flex-1 min-w-0">
                <div className="font-baskerville text-base">{it.author_name}</div>
                {it.position && <div className="text-xs text-muted-foreground">{it.position}</div>}
                <div className="text-sm italic line-clamp-2 mt-1">"{it.quote}"</div>
                {!it.is_published && <span className="text-[10px] uppercase text-muted-foreground">Draft</span>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setEditing({ ...it })}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => remove(it.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      )}

      {pickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setPickerOpen(false)}>
          <div className="bg-white max-w-3xl w-full max-h-[85vh] flex flex-col border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="font-baskerville text-xl">Import review from API</h2>
                <p className="text-xs text-muted-foreground">Pick a review from the live CSP API to pre-fill the editor.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setPickerOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="w-full border border-border pl-9 pr-3 py-2 text-sm"
                  placeholder="Search by author, book or quote…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {apiLoading ? (
                <div className="py-12 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline" /> Loading reviews…</div>
              ) : filteredApi.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">No matching reviews.</div>
              ) : (
                filteredApi.map((r, i) => {
                  const { name, position } = parseAuthor(r.author);
                  return (
                    <div key={i} className="border border-border p-3 hover:bg-muted/30">
                      <div className="flex justify-between gap-3 items-start">
                        <div className="flex-1 min-w-0">
                          <div className="font-baskerville text-base">{name}</div>
                          {position && <div className="text-xs text-muted-foreground">{position}</div>}
                          {r.book_title && <div className="text-xs text-muted-foreground italic mt-0.5">{r.book_title}</div>}
                          <div className="text-sm italic line-clamp-3 mt-2">"{r.praise}"</div>
                        </div>
                        <Button size="sm" className="bg-accent hover:bg-accent/90 shrink-0" onClick={() => importFromApi(r)}>
                          Use this
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div className="space-y-1"><label className="block text-sm font-nav uppercase tracking-wider">{label}</label>{children}</div>);
}