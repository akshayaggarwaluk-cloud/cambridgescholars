import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Save, X, GripVertical } from "lucide-react";
import { adminApi, type CmsNewsArticle } from "@/services/cmsService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";
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

type EditState = Partial<CmsNewsArticle> & { _new?: boolean };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const empty: EditState = {
  _new: true,
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_image: "",
  category: "",
  author: "",
  published_at: new Date().toISOString(),
  is_published: true,
  show_on_homepage: true,
  display_order: 0,
  homepage_order: 0,
};

export default function AdminNews() {
  const [articles, setArticles] = useState<CmsNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      setArticles(await adminApi.listNews());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) return toast.error("Title is required");
    if (!editing.slug?.trim()) return toast.error("Slug is required");

    setSaving(true);
    try {
      if (editing._new) {
        await adminApi.createNews(editing);
        toast.success("Article created");
      } else {
        await adminApi.updateNews(editing as CmsNewsArticle);
        toast.success("Article updated");
      }
      setEditing(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    try {
      await adminApi.deleteNews(id);
      toast.success("Article deleted");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const sortedArticles = [...articles].sort((a, b) => {
    const ao = a.display_order ?? 0;
    const bo = b.display_order ?? 0;
    if (ao !== bo) return ao - bo;
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sortedArticles.findIndex((it) => it.id === active.id);
    const newIndex = sortedArticles.findIndex((it) => it.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(sortedArticles, oldIndex, newIndex);
    setArticles((prev) => {
      const map = new Map(reordered.map((it, idx) => [it.id, idx]));
      return prev.map((it) => map.has(it.id) ? { ...it, display_order: map.get(it.id)! } : it);
    });
    try {
      await Promise.all(
        reordered.map((it, idx) =>
          (it.display_order ?? 0) === idx
            ? Promise.resolve()
            : adminApi.updateNews({ id: it.id, display_order: idx }),
        ),
      );
      toast.success("Order saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reorder failed");
      reload();
    }
  };

  const dateForInput = (iso?: string) =>
    iso ? new Date(iso).toISOString().slice(0, 16) : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-baskerville text-3xl text-foreground">News</h1>
          <p className="text-muted-foreground text-sm">Each card on the homepage shows: Featured Image, Title, Short Excerpt, and a Read More link. The 3 most recent published articles are pulled automatically.</p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing({ ...empty })} className="bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-1" /> New article
          </Button>
        )}
      </div>

      {editing && (
        <div className="border border-border p-6 space-y-4 bg-[#fafafa]">
          <div className="flex items-center justify-between">
            <h2 className="font-baskerville text-xl text-foreground">
              {editing._new ? "New article" : "Edit article"}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Field label="Title">
            <input
              type="text"
              value={editing.title || ""}
              onChange={(e) => {
                const title = e.target.value;
                setEditing({
                  ...editing,
                  title,
                  slug: editing._new && (!editing.slug || editing.slug === slugify(editing.title || ""))
                    ? slugify(title)
                    : editing.slug,
                });
              }}
              className="w-full border border-border px-3 py-2 text-sm bg-background"
            />
          </Field>

          <Field label="Read More link (URL slug)">
            <input
              type="text"
              value={editing.slug || ""}
              onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
              className="w-full border border-border px-3 py-2 text-sm bg-background font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              The "Read More" link on the homepage card will point to <span className="font-mono">/news/{editing.slug || "your-slug"}</span>
            </p>
          </Field>

          <Field label="Short Excerpt (shown on the homepage card)">
            <textarea
              rows={3}
              value={editing.excerpt || ""}
              onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              className="w-full border border-border px-3 py-2 text-sm bg-background"
            />
          </Field>

          <Field label="Body content (full article — Markdown or plain text)">
            <RichTextEditor
              value={editing.content || ""}
              onChange={(html) => setEditing({ ...editing, content: html })}
              rows={10}
            />
          </Field>

          <ImageUploadField
            value={editing.cover_image || null}
            onChange={(url) => setEditing({ ...editing, cover_image: url })}
            label="Featured Image (shown on the homepage card)"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category">
              <input
                type="text"
                value={editing.category || ""}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="w-full border border-border px-3 py-2 text-sm bg-background"
              />
            </Field>
            <Field label="Author">
              <input
                type="text"
                value={editing.author || ""}
                onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                className="w-full border border-border px-3 py-2 text-sm bg-background"
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Publish date">
              <input
                type="datetime-local"
                value={dateForInput(editing.published_at)}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    published_at: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : new Date().toISOString(),
                  })
                }
                className="w-full border border-border px-3 py-2 text-sm bg-background"
              />
            </Field>
            <Field label="Status">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.is_published ?? true}
                  onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
                />
                Published (visible on site)
              </label>
            </Field>
          </div>

          <Field label="Visibility on homepage">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.show_on_homepage ?? true}
                onChange={(e) => setEditing({ ...editing, show_on_homepage: e.target.checked })}
              />
              Show on homepage News section
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              When unchecked, the article still appears on the full /news page (if Published) but is hidden from the homepage 3-column News block.
            </p>
          </Field>

          <Field label="Display order on /news listing page (lower numbers appear first: 1 = first, 2 = second, …)">
            <input
              type="number"
              min={0}
              value={editing.display_order ?? 0}
              onChange={(e) =>
                setEditing({ ...editing, display_order: Number(e.target.value) || 0 })
              }
              className="w-full sm:w-40 border border-border px-3 py-2 text-sm bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Controls order on the full /news listing page only. Articles with the same number fall back to most-recently published first.
            </p>
          </Field>

          <Field label="Homepage order (controls order in the homepage News section)">
            <input
              type="number"
              min={0}
              value={editing.homepage_order ?? 0}
              onChange={(e) =>
                setEditing({ ...editing, homepage_order: Number(e.target.value) || 0 })
              }
              className="w-full sm:w-40 border border-border px-3 py-2 text-sm bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Independent from "/news" order. Lower numbers appear first in the homepage 3-column News block.
            </p>
          </Field>

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
      ) : articles.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border border-dashed border-border">
          No articles yet.
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortedArticles.map((it) => it.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {sortedArticles.map((a) => (
                <SortableNewsRow
                  key={a.id}
                  article={a}
                  onEdit={() => setEditing({ ...a })}
                  onDelete={() => remove(a.id)}
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
  return (
    <div className="space-y-1">
      <label className="block text-sm font-nav uppercase tracking-wider text-foreground">{label}</label>
      {children}
    </div>
  );
}

function SortableNewsRow({ article: a, onEdit, onDelete }: { article: CmsNewsArticle; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: a.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
  };
  return (
    <div ref={setNodeRef} style={style} className="border border-border p-4 flex gap-4 items-start bg-background">
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 mt-1"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      {a.cover_image && (
        <img src={a.cover_image} alt="" className="w-24 h-16 object-cover" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-baskerville text-lg text-foreground">{a.title}</h3>
          {!a.is_published && (
            <span className="text-xs uppercase tracking-wider px-2 py-0.5 bg-muted text-muted-foreground">
              Draft
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          /{a.slug} · {new Date(a.published_at).toLocaleDateString()}
          {a.category ? ` · ${a.category}` : ""}
          {a.show_on_homepage === false ? " · Hidden from homepage" : ""}
        </p>
        {a.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{a.excerpt}</p>
        )}
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
