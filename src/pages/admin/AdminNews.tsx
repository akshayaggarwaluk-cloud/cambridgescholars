import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Save, X } from "lucide-react";
import { adminApi, type CmsNewsArticle } from "@/services/cmsService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ImageUploadField from "@/components/admin/ImageUploadField";

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
            <textarea
              rows={10}
              value={editing.content || ""}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              className="w-full border border-border px-3 py-2 text-sm bg-background font-mono"
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
        <div className="space-y-3">
          {articles.map((a) => (
            <div key={a.id} className="border border-border p-4 flex gap-4 items-start">
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
                </p>
                {a.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{a.excerpt}</p>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setEditing({ ...a })}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => remove(a.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
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
      <label className="block text-sm font-nav uppercase tracking-wider text-foreground">{label}</label>
      {children}
    </div>
  );
}
