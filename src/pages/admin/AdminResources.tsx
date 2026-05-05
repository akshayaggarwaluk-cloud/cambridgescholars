import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Save, X, ExternalLink, GripVertical, Upload, Paperclip } from "lucide-react";
import { Link } from "react-router-dom";
import { adminApi, type CmsResource } from "@/services/cmsService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ImageUploadField from "@/components/admin/ImageUploadField";
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

type EditState = Partial<CmsResource> & { _new?: boolean };
const empty: EditState = { _new: true, slug: "", title: "", display_order: 0, is_published: true };

export default function AdminResources() {
  const [items, setItems] = useState<CmsResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const reload = async () => {
    setLoading(true);
    try { setItems(await adminApi.listResources()); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.slug?.trim() || !editing.title?.trim()) { toast.error("Slug and title are required"); return; }
    setSaving(true);
    try {
      if (editing._new) await adminApi.createResource(editing);
      else await adminApi.updateResource(editing as CmsResource);
      toast.success("Saved"); setEditing(null); reload();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this resource page?")) return;
    try { await adminApi.deleteResource(id); toast.success("Deleted"); reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
  };

  const handleAttachFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editing) return;
    setUploadingFile(true);
    try {
      const url = await adminApi.uploadFile(file);
      const cleanName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      const snippet = `- **[${cleanName}](${url})** - ${file.name}`;
      const next = (editing.content || "").trimEnd() + (editing.content?.trim() ? "\n" : "") + snippet + "\n";
      setEditing({ ...editing, content: next });
      toast.success("File uploaded and link inserted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingFile(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((it) => it.id === active.id);
    const newIndex = items.findIndex((it) => it.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered); // optimistic UI
    try {
      await Promise.all(
        reordered.map((it, idx) =>
          (it.display_order ?? 0) === idx
            ? Promise.resolve()
            : adminApi.updateResource({ ...it, display_order: idx }),
        ),
      );
      toast.success("Order saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save order");
      reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-baskerville text-2xl sm:text-3xl">Resources</h1>
          <p className="text-muted-foreground text-sm">Resource pages shown under /resources/&lt;slug&gt;.</p>
        </div>
        {!editing && <Button onClick={() => setEditing({ ...empty })} className="bg-accent hover:bg-accent/90"><Plus className="h-4 w-4 mr-1" /> New</Button>}
      </div>

      {editing && (
        <div className="border border-border p-4 sm:p-6 space-y-4 bg-[#fafafa]">
          <div className="flex justify-between"><h2 className="font-baskerville text-xl">{editing._new ? "New resource" : "Edit"}</h2><Button variant="ghost" size="sm" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button></div>
          <Field label="URL slug (e.g. preparing-your-manuscript)"><input className="w-full border border-border px-3 py-2 text-sm font-mono" value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} /></Field>
          <Field label="Title"><input className="w-full border border-border px-3 py-2 text-sm" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
          <Field label="Excerpt (short paragraph shown under the title on the Resources listing)"><textarea rows={3} className="w-full border border-border px-3 py-2 text-sm" value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></Field>
          <ImageUploadField label="Cover image" value={editing.cover_image || null} onChange={(url) => setEditing({ ...editing, cover_image: url || "" })} />
          <Field label="Body (Markdown / HTML)">
            <textarea rows={14} className="w-full border border-border px-3 py-2 text-sm font-mono" value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
            <div className="flex items-center gap-3 pt-2">
              <label className="cursor-pointer">
                <input type="file" onChange={handleAttachFile} className="hidden" disabled={uploadingFile} />
                <Button type="button" variant="outline" size="sm" asChild disabled={uploadingFile}>
                  <span className="inline-flex items-center gap-2">
                    {uploadingFile ? <Loader2 className="h-3 w-3 animate-spin" /> : <Paperclip className="h-3 w-3" />}
                    Upload file & insert link
                  </span>
                </Button>
              </label>
              <span className="text-xs text-muted-foreground">Uploads any file (PDF, DOCX, etc.) and appends a markdown link to the body.</span>
            </div>
          </Field>
          <Field label="Display order"><input type="number" className="w-32 border border-border px-3 py-2 text-sm" value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.is_published ?? true} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} /> Published</label>
          <div className="flex gap-2 pt-2"><Button onClick={save} disabled={saving} className="bg-accent hover:bg-accent/90">{saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}{editing._new ? "Create" : "Save"}</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin inline" /> Loading…</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border border-dashed border-border">No resource pages yet.</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((it) => it.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((it) => (
                <SortableRow
                  key={it.id}
                  item={it}
                  onEdit={() => setEditing({ ...it })}
                  onDelete={() => remove(it.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div className="space-y-1"><label className="block text-sm font-nav uppercase tracking-wider">{label}</label>{children}</div>);
}

function SortableRow({
  item,
  onEdit,
  onDelete,
}: {
  item: CmsResource;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-border p-3 flex gap-3 items-center bg-background"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      {item.cover_image && <img src={item.cover_image} alt="" className="w-16 h-12 object-cover" />}
      <div className="flex-1 min-w-0">
        <div className="font-baskerville text-base">{item.title}</div>
        <Link to={`/resources/${item.slug}`} className="text-xs text-accent inline-flex items-center gap-1" target="_blank">
          /resources/{item.slug} <ExternalLink className="h-3 w-3" />
        </Link>
        {!item.is_published && <span className="text-[10px] uppercase text-muted-foreground ml-2">Draft</span>}
      </div>
      <Button variant="ghost" size="sm" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
      <Button variant="ghost" size="sm" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
    </div>
  );
}