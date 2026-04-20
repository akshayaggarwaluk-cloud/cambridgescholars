import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Save, X, BookOpen } from "lucide-react";
import { adminApi, type CmsHeroSlide } from "@/services/cmsService";
import { fetchAutocomplete, fetchBookByIsbn } from "@/services/cspApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface BookSuggestion {
  title: string;
  isbn: string;
  slug: string;
  authors: string;
  cover_image: string;
}

type EditState = Partial<CmsHeroSlide> & { _new?: boolean };

const empty: EditState = {
  _new: true,
  title: "",
  subtitle: "",
  author: "",
  quote: "",
  reviewer_name: "",
  reviewer_position: "",
  cover_image: "",
  link_url: "",
  display_order: 0,
  is_published: true,
};

export default function AdminHeroSlides() {
  const [slides, setSlides] = useState<CmsHeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  // Book autocomplete state
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [importing, setImporting] = useState(false);
  const debounceRef = useRef<number | null>(null);

  const searchBooks = (q: string) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!q || q.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSearching(true);
    debounceRef.current = window.setTimeout(async () => {
      try {
        const res = await fetchAutocomplete(q.trim());
        setSuggestions(res);
        setShowSuggestions(true);
      } catch (err) {
        console.error("[AdminHeroSlides] autocomplete failed:", err);
        toast.error("Book search is unavailable right now (catalog API error). Try again shortly or fill the slide manually.");
        setSuggestions([]);
        setShowSuggestions(true);
      } finally {
        setSearching(false);
      }
    }, 250);
  };

  const pickBook = async (s: BookSuggestion) => {
    setShowSuggestions(false);
    setSuggestions([]);
    if (!editing) return;
    setImporting(true);
    try {
      const book = await fetchBookByIsbn(s.isbn);
      const reviewer = book?.apiReviews?.[0];
      const authorName = book?.author || s.authors || "";
      setEditing((prev) => prev ? {
        ...prev,
        title: book?.title || s.title,
        author: authorName || prev.author || "",
        cover_image: book?.image || s.cover_image || "",
        link_url: `/books/${s.isbn}`,
        quote: reviewer?.review || prev.quote || "",
        reviewer_name: reviewer?.reviewer || prev.reviewer_name || "",
        reviewer_position: reviewer?.reviewer_position || prev.reviewer_position || "",
      } : prev);
      toast.success(`Loaded "${book?.title || s.title}"`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load book");
    } finally {
      setImporting(false);
    }
  };


  const reload = async () => {
    setLoading(true);
    try {
      const data = await adminApi.listHero();
      setSlides(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load slides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      if (editing._new) {
        await adminApi.createHero(editing);
        toast.success("Slide created");
      } else {
        await adminApi.updateHero(editing as CmsHeroSlide);
        toast.success("Slide updated");
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
    if (!confirm("Delete this slide?")) return;
    try {
      await adminApi.deleteHero(id);
      toast.success("Slide deleted");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-baskerville text-3xl text-foreground">Featured Reviews</h1>
          <p className="text-muted-foreground text-sm">Homepage Featured Reviews carousel content.</p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing({ ...empty })} className="bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-1" /> New slide
          </Button>
        )}
      </div>

      {editing && (
        <div className="border border-border p-6 space-y-4 bg-[#fafafa]">
          <div className="flex items-center justify-between">
            <h2 className="font-baskerville text-xl text-foreground">
              {editing._new ? "New slide" : "Edit slide"}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Field label="Title (search the catalog to auto-fill)">
            <div className="relative">
              <input
                type="text"
                value={editing.title || ""}
                onChange={(e) => {
                  setEditing({ ...editing, title: e.target.value });
                  searchBooks(e.target.value);
                }}
                onFocus={() => { if (suggestions.length) setShowSuggestions(true); }}
                onBlur={() => { window.setTimeout(() => setShowSuggestions(false), 150); }}
                placeholder="Start typing a book title, author, or ISBN…"
                className="w-full border border-border px-3 py-2 pr-9 text-sm bg-background"
              />
              {(searching || importing) && (
                <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              )}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 max-h-72 overflow-y-auto border border-border bg-background shadow-lg">
                  {suggestions.map((s) => (
                    <button
                      type="button"
                      key={s.isbn || s.slug}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickBook(s)}
                      className="w-full text-left px-3 py-2 hover:bg-muted flex gap-3 items-center border-b border-border last:border-b-0"
                    >
                      {s.cover_image ? (
                        <img src={s.cover_image} alt="" className="w-8 h-10 object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-10 bg-muted flex-shrink-0 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-foreground truncate">{s.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{s.authors} · {s.isbn}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {showSuggestions && !searching && suggestions.length === 0 && (editing.title?.length || 0) >= 2 && (
                <div className="absolute z-20 left-0 right-0 mt-1 border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                  No matching books found.
                </div>
              )}
            </div>
          </Field>

          <Field label="Author">
            <input
              type="text"
              value={editing.author || ""}
              onChange={(e) => setEditing({ ...editing, author: e.target.value })}
              placeholder="Book author name (shown under the title)"
              className="w-full border border-border px-3 py-2 text-sm bg-background"
            />
          </Field>

          <Field label="Quote / review">
            <textarea
              rows={4}
              value={editing.quote || ""}
              onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
              className="w-full border border-border px-3 py-2 text-sm bg-background"
            />
          </Field>

          <Field label="Book cover (auto-filled from catalog)">
            {editing.cover_image ? (
              <div className="flex items-center gap-3 border border-border bg-background p-3">
                <img src={editing.cover_image} alt="" className="w-16 h-20 object-cover" />
                <p className="text-xs text-muted-foreground break-all flex-1">{editing.cover_image}</p>
              </div>
            ) : (
              <div className="border border-dashed border-border bg-background p-4 text-xs text-muted-foreground">
                Search and select a book above to load its cover automatically.
              </div>
            )}
          </Field>
          <Field label="Link URL (e.g. /books/9781234567890)">
            <input
              type="text"
              value={editing.link_url || ""}
              onChange={(e) => setEditing({ ...editing, link_url: e.target.value })}
              className="w-full border border-border px-3 py-2 text-sm bg-background"
            />
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
      ) : slides.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border border-dashed border-border">
          No slides yet. Click "New slide" to create the first one.
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide) => (
            <div key={slide.id} className="border border-border p-4 flex gap-4 items-start">
              {slide.cover_image && (
                <img src={slide.cover_image} alt="" className="w-16 h-20 object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-baskerville text-lg text-foreground">{slide.title}</h3>
                {slide.author && (
                  <p className="text-xs text-muted-foreground mt-0.5">{slide.author}</p>
                )}
                {slide.quote && (
                  <p className="text-sm text-muted-foreground italic line-clamp-2 mt-1">"{slide.quote}"</p>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setEditing({ ...slide })}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => remove(slide.id)}>
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
