import { useState, useEffect, useRef } from "react";
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
          const { books } = await fetchBooks({ search: query, per_page: 6 });
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
    <div className="fixed inset-0 z-[100]">
      {/* Semi-transparent dark backdrop over entire page */}
      <div
        className="absolute inset-0 bg-[#1e1e2e]/92"
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
                placeholder="Search by Title, Subtitle, or Author/Editor name..."
                className="w-full h-[56px] px-5 pr-14 text-[16px] bg-white text-[#333] placeholder:text-[#999] focus:outline-none border-0"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              />
              <button
                onClick={handleSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#333] transition-colors"
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

          {/* Advanced search fields */}
          {showAdvanced && (
            <div className="mt-4 bg-white/10 backdrop-blur-sm p-6 animate-fade-in">
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
                        setAdvancedFields((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                      onKeyDown={handleKeyDown}
                      className="w-full h-11 px-4 bg-white text-[#333] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setAdvancedFields({ title: "", author: "", isbn: "", blurb: "", series: "" })}
                  className="text-white/70 hover:text-white px-4 py-2 text-sm transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleSearch}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-2 text-sm font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          )}

          {/* Autocomplete results */}
          {query.length >= 2 && !showAdvanced && (
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
