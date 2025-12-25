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
  const { sameCategory, sameAuthor } = useMemo(() => {
    const categoryBooks = books
      .filter((b) => b.category === currentBook.category && b.id !== currentBook.id)
      .slice(0, 4);

    const authorBooks = books
      .filter((b) => b.author === currentBook.author && b.id !== currentBook.id)
      .slice(0, 4);

    return { sameCategory: categoryBooks, sameAuthor: authorBooks };
  }, [currentBook]);

  if (sameCategory.length === 0 && sameAuthor.length === 0) {
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

      {/* Same Category Section */}
      {sameCategory.length > 0 && (
        <section className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
            <div>
              <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-2 block">
                Similar Reads
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                More in {currentBook.category}
              </h2>
              <p className="text-muted-foreground mt-2 max-w-lg">
                Discover other captivating titles in the {currentBook.category.toLowerCase()} category
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="mt-4 md:mt-0 rounded-full"
            >
              <Link to={`/books?category=${currentBook.category.toLowerCase()}`}>
                Browse {currentBook.category}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {sameCategory.map((book, index) => (
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
