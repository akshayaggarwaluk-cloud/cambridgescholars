import { useEffect, useState } from "react";
import { Loader2, Save, X, Pencil, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { adminApi, type CmsPolicyPage } from "@/services/cmsService";

const SLUG_TO_ROUTE: Record<string, string> = {
  "privacy-policy": "/privacy-policy",
  "cookies-policy": "/cookies-policy",
  "terms-and-conditions": "/terms-and-conditions",
  "accessibility-policy": "/accessibility-policy",
  "refund-returns": "/refund-returns",
};

export default function AdminPolicyPages() {
  const [items, setItems] = useState<CmsPolicyPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CmsPolicyPage | null>(null);
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    setLoading(true);
    try { setItems(await adminApi.listPolicyPages()); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      await adminApi.updatePolicyPage({
        id: editing.id,
        title: editing.title,
        content: editing.content ?? "",
      });
      toast.success("Saved");
      setEditing(null);
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-baskerville text-2xl sm:text-3xl">Footer Documents</h1>
        <p className="text-muted-foreground text-sm">
          Edit the content of the “Other Links” pages in the site footer. Leaving the body empty falls back to the original built-in copy.
        </p>
      </div>

      {editing && (
        <div className="border border-border p-4 sm:p-6 space-y-4 bg-[#fafafa]">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-baskerville text-xl">Edit page</h2>
              <Link
                to={SLUG_TO_ROUTE[editing.slug] || "#"}
                target="_blank"
                className="text-xs text-accent inline-flex items-center gap-1"
              >
                {SLUG_TO_ROUTE[editing.slug] || editing.slug} <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-nav uppercase tracking-wider">Page title</label>
            <input
              className="w-full border border-border px-3 py-2 text-sm"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-nav uppercase tracking-wider">Body (HTML)</label>
            <RichTextEditor
              value={editing.content || ""}
              onChange={(html) => setEditing({ ...editing, content: html })}
              rows={20}
            />
            <p className="text-xs text-muted-foreground">
              When the body is empty, the website shows the original built-in copy for this page.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={save} disabled={saving} className="bg-accent hover:bg-accent/90">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              Save
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
          No policy pages yet.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((it) => {
            const route = SLUG_TO_ROUTE[it.slug];
            const hasCustom = !!(it.content && it.content.trim().length > 0);
            return (
              <div
                key={it.id}
                className="border border-border p-3 flex gap-3 items-center bg-background"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-baskerville text-base">{it.title}</div>
                  {route && (
                    <Link
                      to={route}
                      target="_blank"
                      className="text-xs text-accent inline-flex items-center gap-1"
                    >
                      {route} <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                  <span className="text-[10px] uppercase text-muted-foreground ml-2">
                    {hasCustom ? "Custom content" : "Using built-in copy"}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setEditing({ ...it })}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}