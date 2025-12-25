import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/BookCard";
import { books } from "@/data/books";

export function NewArrivalsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const newArrivals = books.slice(4, 10);
  const itemsPerView = 4;
  const maxIndex = Math.max(0, newArrivals.length - itemsPerView);

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <section className="py-24 bg-secondary">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-accent font-medium mb-2">Just In</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              New Arrivals
            </h2>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              disabled={currentIndex === 0}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              disabled={currentIndex === maxIndex}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-8 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView + 2)}%)` }}
          >
            {newArrivals.map((book, index) => (
              <div
                key={book.id}
                className="min-w-[calc(25%-1.5rem)] flex-shrink-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Show grid instead of carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden mt-8">
          {newArrivals.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}
