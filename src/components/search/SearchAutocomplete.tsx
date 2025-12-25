import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { books as staticBooks } from "@/data/books";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Book } from "@/contexts/CartContext";

interface SearchAutocompleteProps {
  onClose?: () => void;
  className?: string;
}

export function SearchAutocomplete({ onClose, className }: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [publishedBooks, setPublishedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Combine static and published books
  const allBooks = [...staticBooks, ...publishedBooks];

  const filteredBooks = query.length >= 2
    ? allBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  // Get unique matching categories
  const matchingCategories = query.length >= 2
    ? [...new Set(allBooks
        .filter(book => book.category.toLowerCase().includes(query.toLowerCase()))
        .map(book => book.category)
      )].slice(0, 3)
    : [];

  // Fetch published books on mount
  useEffect(() => {
    const fetchPublishedBooks = async () => {
      try {
        const { data, error } = await supabase
          .from("published_books")
          .select("*");

        if (error) throw error;

        if (data) {
          const formattedBooks: Book[] = data.map((book) => ({
            id: `published_${book.id}`,
            title: book.title,
            author: book.author,
            price: Number(book.price),
            image: book.cover_image || "/placeholder.svg",
            rating: 4.0,
            category: book.category,
            description: book.description || undefined,
          }));
          setPublishedBooks(formattedBooks);
        }
      } catch (error) {
        console.error("Error fetching published books:", error);
      }
    };

    fetchPublishedBooks();
  }, []);

  useEffect(() => {
    setIsOpen(filteredBooks.length > 0 || matchingCategories.length > 0);
    setHighlightedIndex(-1);
  }, [query, filteredBooks.length, matchingCategories.length]);

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

    const totalItems = filteredBooks.length + matchingCategories.length;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < totalItems - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          if (highlightedIndex < matchingCategories.length) {
            // Category selected
            navigate(`/books?category=${encodeURIComponent(matchingCategories[highlightedIndex])}`);
            handleClose();
          } else {
            // Book selected
            const bookIndex = highlightedIndex - matchingCategories.length;
            if (filteredBooks[bookIndex]) {
              handleSelect(filteredBooks[bookIndex].id);
            }
          }
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

  const handleSelect = (bookId: string) => {
    navigate(`/books/${bookId}`);
    handleClose();
  };

  const handleCategorySelect = (category: string) => {
    navigate(`/books?category=${encodeURIComponent(category)}`);
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
          placeholder="Search books, authors, or categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="pl-10 pr-10 h-11 bg-secondary/50 border-border/50 focus:bg-card"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-lg border border-border overflow-hidden z-50 animate-fade-in">
          <div className="max-h-[400px] overflow-y-auto">
            {/* Category Results */}
            {matchingCategories.length > 0 && (
              <div className="px-3 pt-3 pb-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {matchingCategories.map((category, index) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                        highlightedIndex === index
                          ? "bg-accent text-primary"
                          : "bg-secondary text-foreground hover:bg-accent/20"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Book Results */}
            {filteredBooks.length > 0 && (
              <>
                {matchingCategories.length > 0 && (
                  <div className="border-t border-border my-2" />
                )}
                <div className="px-3 pb-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Books
                  </p>
                </div>
                {filteredBooks.map((book, index) => (
                  <Link
                    key={book.id}
                    to={`/books/${book.id}`}
                    onClick={handleClose}
                    className={cn(
                      "flex items-center gap-4 p-3 transition-colors",
                      highlightedIndex === index + matchingCategories.length
                        ? "bg-accent/10"
                        : "hover:bg-secondary"
                    )}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground line-clamp-1">
                        {highlightQuery(book.title, query)}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {highlightQuery(book.author, query)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                          {book.category}
                        </span>
                        <span className="text-sm font-semibold text-accent">
                          ${book.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* View All Results */}
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
      {query.length >= 2 && filteredBooks.length === 0 && matchingCategories.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-lg border border-border p-6 text-center z-50 animate-fade-in">
          <p className="text-muted-foreground">No books found for "{query}"</p>
          <Link
            to="/books"
            onClick={handleClose}
            className="text-accent text-sm font-medium hover:underline mt-2 inline-block"
          >
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
      <span key={i} className="bg-accent/20 text-accent font-semibold">
        {part}
      </span>
    ) : (
      part
    )
  );
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
