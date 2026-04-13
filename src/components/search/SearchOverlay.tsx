import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
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
  const [searchByField, setSearchByField] = useState<string>("title");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await fetchAutocomplete(query);
        setResults(data);
      } catch {
        try {
          const { books } = await fetchBooks({ search: query, per_page: 6, search_field: showAdvanced ? searchByField : undefined });
          setResults(books.map((b) => ({
            title: b.title, isbn: b.isbn || b.id, slug: b.id,
            authors: b.author, cover_image: b.image,
          })));
        } catch { setResults([]); }
      } finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set("search", query.trim());
      if (showAdvanced && searchByField) {
        params.set("search_field", searchByField);
      }
      navigate(`/books?${params.toString()}`);
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
    <div className="fixed inset-0 z-[100]">
      {/* Semi-transparent dark backdrop over entire page */}
      <div
        className="absolute inset-0 bg-black/85"
        onClick={onClose}
      />

      {/* Close button - top right, large X like CSP */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 z-20 text-white/80 hover:text-white transition-colors"
        aria-label="Close search"
      >
        <X className="h-9 w-9" strokeWidth={1.5} />
      </button>

      {/* Search bar - positioned below header area */}
      <div className="relative z-10 w-full mt-[120px]">
        <div className="max-w-5xl mx-auto px-6">
          {/* Main search row */}
          <div className="flex items-center gap-0">
            {/* Search input - white background */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={showAdvanced ? `Search by ${searchByField.charAt(0).toUpperCase() + searchByField.slice(1)}...` : "Enter search term, then choose a field below..."}
                className="w-full h-[56px] px-5 pr-14 text-[16px] bg-black text-white placeholder:text-white/60 focus:outline-none border border-white"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              />
              <button
                onClick={handleSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Advanced button - outlined, right side */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                "h-[56px] px-7 text-[15px] font-medium tracking-wide border-2 transition-all whitespace-nowrap",
                showAdvanced
                  ? "bg-white text-[#333] border-white"
                  : "bg-transparent text-white border-white/50 hover:border-white"
              )}
            >
              Advanced
            </button>
          </div>

          {/* Advanced search - Search By filter buttons */}
          {showAdvanced && (
            <div className="bg-black/80 border border-white/20 px-6 py-4 animate-fade-in flex items-center gap-3 flex-wrap">
              <span className="text-white font-semibold text-[15px] mr-1">Search By :</span>
              {[
                { key: "title", label: "Title" },
                { key: "subtitle", label: "Subtitle" },
                { key: "author", label: "Author" },
                { key: "editor", label: "Editor" },
                { key: "isbn", label: "ISBN" },
                { key: "blurb", label: "Blurb" },
              ].map((field) => (
                <button
                  key={field.key}
                  onClick={() => setSearchByField(field.key)}
                  className={cn(
                    "px-5 py-2 text-[14px] font-medium rounded-full border transition-all",
                    searchByField === field.key
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-transparent text-white border-white/40 hover:border-white"
                  )}
                >
                  {field.label}
                </button>
              ))}
            </div>
          )}

          {/* Autocomplete results */}
          {query.length >= 2 && (
            <div className="bg-white shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto">
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
                      className="flex items-center gap-4 p-4 w-full text-left hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-0"
                    >
                      <img src={book.cover_image} alt={book.title} className="w-12 h-16 object-cover flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[#333] line-clamp-1">{book.title}</p>
                        <p className="text-sm text-[#777] line-clamp-1">{book.authors}</p>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={handleSearch}
                    className="block w-full p-3 text-center text-sm font-medium text-accent hover:bg-gray-50 border-t border-gray-200"
                  >
                    View all results for "{query}"
                  </button>
                </>
              ) : (
                <div className="p-6 text-center text-[#777]">
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
