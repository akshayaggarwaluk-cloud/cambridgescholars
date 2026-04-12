import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchAutocomplete, fetchBooks } from "@/services/cspApi";
import { cn } from "@/lib/utils";

interface AutocompleteResult {
  title: string;
  isbn: string;
  slug: string;
  authors: string;
  cover_image: string;
}

interface SearchAutocompleteProps {
  onClose?: () => void;
  className?: string;
}

export function SearchAutocomplete({ onClose, className }: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [results, setResults] = useState<AutocompleteResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        // Try dedicated autocomplete endpoint first
        const data = await fetchAutocomplete(query);
        setResults(data);
        setIsOpen(data.length > 0);
      } catch {
        // Fallback to books search if autocomplete endpoint not available
        try {
          const { books } = await fetchBooks({ search: query, per_page: 8 });
          const mapped = books.map((b) => ({
            title: b.title,
            isbn: b.isbn || b.id,
            slug: b.id,
            authors: b.author,
            cover_image: b.image,
          }));
          setResults(mapped);
          setIsOpen(mapped.length > 0);
        } catch {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [results]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        } else if (query.length >= 2) {
          navigate(`/books?search=${encodeURIComponent(query)}`);
          handleClose();
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (item: AutocompleteResult) => {
    navigate(`/books/${item.isbn}`);
    handleClose();
  };

  const handleClose = () => {
    setQuery("");
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search books, authors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          className="pl-10 pr-10 h-11 bg-secondary/50 border-border/50 focus:bg-card"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-lg border border-border p-4 text-center z-50">
          <Loader2 className="h-5 w-5 animate-spin mx-auto text-accent" />
        </div>
      )}

      {/* Dropdown */}
      {isOpen && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-lg border border-border overflow-hidden z-50 animate-fade-in">
          <div className="max-h-[400px] overflow-y-auto">
            <div className="px-3 pb-2 pt-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Books</p>
            </div>
            {results.map((book, index) => (
              <Link
                key={book.isbn}
                to={`/books/${book.isbn}`}
                onClick={handleClose}
                className={cn(
                  "flex items-center gap-4 p-3 transition-colors",
                  highlightedIndex === index ? "bg-accent/10" : "hover:bg-secondary"
                )}
              >
                <img src={book.cover_image} alt={book.title} className="w-12 h-16 object-cover rounded-md flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground line-clamp-1">{highlightQuery(book.title, query)}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{highlightQuery(book.authors, query)}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to={`/books?search=${encodeURIComponent(query)}`}
            onClick={handleClose}
            className="block p-3 text-center text-sm font-medium text-accent hover:bg-secondary border-t border-border"
          >
            View all results for "{query}"
          </Link>
        </div>
      )}

      {/* No Results */}
      {query.length >= 2 && !loading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-lg border border-border p-6 text-center z-50 animate-fade-in">
          <p className="text-muted-foreground">No books found for "{query}"</p>
          <Link to="/books" onClick={handleClose} className="text-accent text-sm font-medium hover:underline mt-2 inline-block">
            Browse all books
          </Link>
        </div>
      )}
    </div>
  );
}

function highlightQuery(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-accent/20 text-accent font-semibold">{part}</span>
    ) : (
      part
    )
  );
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
