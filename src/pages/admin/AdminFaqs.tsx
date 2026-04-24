import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Save, X, GripVertical } from "lucide-react";
import { adminApi, type CmsFaq } from "@/services/cmsService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

type EditState = Partial<CmsFaq> & { _new?: boolean };
const empty: EditState = { _new: true, question: "", answer: "", display_order: 0, is_published: true };

export default function AdminFaqs() {
  const [items, setItems] = useState<CmsFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    setLoading(true);
    try { setItems(await adminApi.listFaqs()); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.question?.trim() || !editing.answer?.trim()) { toast.error("Question and answer are required"); return; }
    setSaving(true);
    try {
      if (editing._new) await adminApi.createFaq(editing);
      else await adminApi.updateFaq(editing as CmsFaq);
      toast.success("Saved"); setEditing(null); reload();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try { await adminApi.deleteFaq(id); toast.success("Deleted"); reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async (event: DragEndEvent, scopedItems: CmsFaq[]) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = scopedItems.findIndex((it) => it.id === active.id);
    const newIndex = scopedItems.findIndex((it) => it.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(scopedItems, oldIndex, newIndex);
    // Optimistic merge back into items
    setItems((prev) => {
      const map = new Map(reordered.map((it, idx) => [it.id, idx]));
      return prev.map((it) => map.has(it.id) ? { ...it, display_order: map.get(it.id)! } : it);
    });
    try {
      await Promise.all(
        reordered.map((it, idx) =>
          (it.display_order ?? 0) === idx
            ? Promise.resolve()
            : adminApi.updateFaq({ ...it, display_order: idx }),
        ),
      );
      toast.success("Order saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save order");
      reload();
    }
  };

  const grouped = items.reduce<Record<string, CmsFaq[]>>((acc, f) => {
    const key = f.category || "Uncategorised";
    (acc[key] ||= []).push(f); return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-baskerville text-2xl sm:text-3xl">FAQs</h1>
          <p className="text-muted-foreground text-sm">Q&amp;A entries shown on the FAQ page.</p>
        </div>
        {!editing && <Button onClick={() => setEditing({ ...empty })} className="bg-accent hover:bg-accent/90"><Plus className="h-4 w-4 mr-1" /> New</Button>}
      </div>

      {editing && (
        <div className="border border-border p-4 sm:p-6 space-y-4 bg-[#fafafa]">
          <div className="flex justify-between"><h2 className="font-baskerville text-xl">{editing._new ? "New FAQ" : "Edit"}</h2><Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button></div>
          <Field label="Question"><input className="w-full border border-border px-3 py-2 text-sm" value={editing.question || ""} onChange={(e) => setEditing({ ...editing, question: e.target.value })} /></Field>
          <Field label="Answer (Markdown supported)"><textarea rows={8} className="w-full border border-border px-3 py-2 text-sm font-mono" value={editing.answer || ""} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} /></Field>
          <div className="flex gap-2 pt-2"><Button onClick={save} disabled={saving} className="bg-accent hover:bg-accent/90">{saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}{editing._new ? "Create" : "Save"}</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline" /> Loading…</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border border-dashed border-border">No FAQs yet.</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, list]) => (
            <div key={cat}>
              <h3 className="font-nav uppercase tracking-wider text-xs text-muted-foreground mb-2">{cat}</h3>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, list)}>
                <SortableContext items={list.map((it) => it.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {list.map((it) => (
                      <SortableFaqRow key={it.id} item={it} onEdit={() => setEditing({ ...it })} onDelete={() => remove(it.id)} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div className="space-y-1"><label className="block text-sm font-nav uppercase tracking-wider">{label}</label>{children}</div>);
}

function SortableFaqRow({ item, onEdit, onDelete }: { item: CmsFaq; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
  };
  return (
    <div ref={setNodeRef} style={style} className="border border-border p-3 flex gap-3 items-start bg-background">
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{item.question}</div>
        <div className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.answer}</div>
        {!item.is_published && <span className="text-[10px] uppercase text-muted-foreground">Draft</span>}
      </div>
      <Button variant="ghost" size="sm" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
      <Button variant="ghost" size="sm" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
    </div>
  );
}