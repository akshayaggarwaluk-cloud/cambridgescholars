import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/BookCard";
import { books } from "@/data/books";
import { Book } from "@/contexts/CartContext";

interface RelatedBooksSectionProps {
  currentBook: Book;
}

export function RelatedBooksSection({ currentBook }: RelatedBooksSectionProps) {
  const { sameCategory, sameAuthor, recommended } = useMemo(() => {
    const categoryBooks = books
      .filter((b) => b.category === currentBook.category && b.id !== currentBook.id)
      .slice(0, 4);

    const authorBooks = books
      .filter((b) => b.author === currentBook.author && b.id !== currentBook.id)
      .slice(0, 4);

    // If not enough category books, fill with top-rated books from other categories
    let recommendedBooks: typeof books = [];
    if (categoryBooks.length < 4) {
      const existingIds = new Set([currentBook.id, ...categoryBooks.map(b => b.id), ...authorBooks.map(b => b.id)]);
      recommendedBooks = books
        .filter((b) => !existingIds.has(b.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4 - categoryBooks.length);
    }

    return { 
      sameCategory: categoryBooks, 
      sameAuthor: authorBooks,
      recommended: recommendedBooks
    };
  }, [currentBook]);

  // Combine category books with recommendations to ensure 3-4 books
  const similarBooks = [...sameCategory, ...recommended].slice(0, 4);

  if (similarBooks.length === 0 && sameAuthor.length === 0) {
    return null;
  }

  return (
    <div className="space-y-20">
      {/* Same Author Section */}
      {sameAuthor.length > 0 && (
        <section className="container-wide">
          <div className="bg-gradient-charcoal rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-accent/5 rounded-full blur-2xl" />
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
                <div>
                  <span className="inline-flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-widest mb-3">
                    <Sparkles className="h-4 w-4" />
                    More from this Author
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground">
                    Books by {currentBook.author}
                  </h2>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="mt-4 md:mt-0 rounded-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to={`/books?search=${encodeURIComponent(currentBook.author)}`}>
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sameAuthor.map((book, index) => (
                  <div
                    key={book.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Similar Books Section */}
      {similarBooks.length > 0 && (
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
            <Button
              asChild
              variant="outline"
              className="mt-4 md:mt-0 rounded-full"
            >
              <Link to="/books">
                Browse All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {similarBooks.map((book, index) => (
              <div
                key={book.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
