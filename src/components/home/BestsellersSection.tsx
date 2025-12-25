import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/BookCard";
import { books } from "@/data/books";

export function BestsellersSection() {
  const bestsellers = books.filter((book) => book.rating >= 4.7).slice(0, 4);

  return (
    <section className="py-24">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-accent font-medium mb-2">Top Picks</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Bestsellers
            </h2>
          </div>
          <Button asChild variant="ghost" className="mt-4 md:mt-0 text-accent hover:text-accent/80">
            <Link to="/books">
              View All Books
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestsellers.map((book, index) => (
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
    </section>
  );
}
