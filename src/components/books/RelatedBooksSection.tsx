import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/BookCard";
import { fetchBooks } from "@/services/cspApi";
import { Book } from "@/contexts/CartContext";

interface RelatedBooksSectionProps {
  currentBook: Book;
}

export function RelatedBooksSection({ currentBook }: RelatedBooksSectionProps) {
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);

  useEffect(() => {
    // Fetch books from same category
    const category = currentBook.categories?.[0] || currentBook.category;
    fetchBooks({ category, per_page: 5 })
      .then(({ books }) => {
        const filtered = books.filter((b) => b.id !== currentBook.id).slice(0, 4);
        setRelatedBooks(filtered);
      })
      .catch(() => setRelatedBooks([]));
  }, [currentBook]);

  if (relatedBooks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-20">
      <section className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-2 block">
              You May Also Like
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Similar Books
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Handpicked recommendations based on your interests
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0 rounded-full">
            <Link to="/books">
              Browse All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {relatedBooks.map((book, index) => (
            <div key={book.id} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
