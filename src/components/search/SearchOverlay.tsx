import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAutocomplete, fetchBooks } from "@/services/cspApi";
import { cn } from "@/lib/utils";

interface SearchOverlayProps {
  onClose: () => void;
}

interface AutocompleteResult {
  title: string;
  isbn: string;
  slug: string;
  authors: string;
  cover_image: string;
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AutocompleteResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedFields, setAdvancedFields] = useState({
    title: "",
    author: "",
    isbn: "",
    blurb: "",
    series: "",
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await fetchAutocomplete(query);
        setResults(data);
      } catch {
        try {
          const { books } = await fetchBooks({ search: query, per_page: 6 });
          setResults(
            books.map((b) => ({
              title: b.title,
              isbn: b.isbn || b.id,
              slug: b.id,
              authors: b.author,
              cover_image: b.image,
            }))
          );
        } catch {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSearch = () => {
    if (showAdvanced) {
      const params = new URLSearchParams();
      if (advancedFields.title) params.set("title", advancedFields.title);
      if (advancedFields.author) params.set("author", advancedFields.author);
      if (advancedFields.isbn) params.set("isbn", advancedFields.isbn);
      if (advancedFields.blurb) params.set("blurb", advancedFields.blurb);
      if (advancedFields.series) params.set("series", advancedFields.series);
      navigate(`/books?${params.toString()}`);
    } else if (query.trim()) {
      navigate(`/books?search=${encodeURIComponent(query.trim())}`);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleResultClick = (isbn: string) => {
    navigate(`/books/${isbn}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] animate-fade-in">
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 md:top-8 md:right-10 text-white/70 hover:text-white transition-colors"
          aria-label="Close search"
        >
          <X className="h-8 w-8" />
        </button>

        {/* Search bar area */}
        <div className="w-full max-w-4xl mx-auto mt-24 md:mt-32 px-6">
          <div className="flex items-center gap-3">
            {/* Main search input */}
            <div className="flex-1 relative flex items-center bg-white rounded-sm">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search by Title, Subtitle, or Author/Editor name..."
                className="w-full h-14 md:h-16 px-5 pr-14 text-base md:text-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Search"
              >
                <Search className="h-6 w-6" />
              </button>
            </div>

            {/* Advanced button */}
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                "h-14 md:h-16 px-6 md:px-8 text-base font-medium rounded-sm border-2 transition-all",
                showAdvanced
                  ? "bg-white text-foreground border-white"
                  : "bg-transparent text-white border-white/60 hover:bg-white/10 hover:border-white"
              )}
            >
              Advanced
            </Button>
          </div>

          {/* Advanced search fields */}
          {showAdvanced && (
            <div className="mt-6 bg-white/10 backdrop-blur rounded-lg p-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "title", label: "Title", placeholder: "Search by title..." },
                  { key: "author", label: "Author / Editor", placeholder: "Search by author or editor..." },
                  { key: "isbn", label: "ISBN", placeholder: "Search by ISBN..." },
                  { key: "blurb", label: "Blurb (Word Search)", placeholder: "Search in book descriptions..." },
                  { key: "series", label: "Series", placeholder: "Search by series..." },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-white/80 text-sm font-medium mb-1.5">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={advancedFields[field.key as keyof typeof advancedFields]}
                      onChange={(e) =>
                        setAdvancedFields((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      onKeyDown={handleKeyDown}
                      className="w-full h-11 px-4 rounded-sm bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <Button
                  variant="ghost"
                  onClick={() =>
                    setAdvancedFields({ title: "", author: "", isbn: "", blurb: "", series: "" })
                  }
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  Clear
                </Button>
                <Button
                  onClick={handleSearch}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 px-8"
                >
                  Search
                </Button>
              </div>
            </div>
          )}

          {/* Autocomplete results */}
          {query.length >= 2 && !showAdvanced && (
            <div className="mt-3 bg-white rounded-lg shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="p-6 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                </div>
              ) : results.length > 0 ? (
                <>
                  {results.map((book) => (
                    <button
                      key={book.isbn}
                      onClick={() => handleResultClick(book.isbn)}
                      className="flex items-center gap-4 p-4 w-full text-left hover:bg-secondary transition-colors border-b border-border/50 last:border-0"
                    >
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground line-clamp-1">{book.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{book.authors}</p>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={handleSearch}
                    className="block w-full p-3 text-center text-sm font-medium text-accent hover:bg-secondary border-t border-border"
                  >
                    View all results for "{query}"
                  </button>
                </>
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
