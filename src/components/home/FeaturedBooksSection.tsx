import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { books } from "@/data/books";
import { Button } from "@/components/ui/button";

// Get featured books
const featuredBooks = books.slice(0, 6);

export function FeaturedBooksSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Books
            </h2>
            <div className="w-16 h-1 bg-accent" />
          </div>
          <Link
            to="/books"
            className="hidden md:inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Books Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBooks.map((book, index) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              className="group bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-accent/30 hover:shadow-lg animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Book Cover */}
              <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {book.originalPrice && (
                  <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                    Sale
                  </span>
                )}
              </div>

              {/* Book Info */}
              <div className="p-5">
                <span className="text-xs text-accent font-medium uppercase tracking-wide">
                  {book.category}
                </span>
                
                <h3 className="font-serif text-lg font-semibold text-foreground mt-2 mb-1 line-clamp-2 group-hover:text-accent transition-colors">
                  {book.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {book.author}
                </p>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {book.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      £{book.price.toFixed(2)}
                    </span>
                    {book.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        £{book.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className="text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="md:hidden text-center mt-8">
          <Button asChild variant="outline">
            <Link to="/books">
              View All Books
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
