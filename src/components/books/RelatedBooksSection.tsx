import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchBooks } from "@/services/cspApi";
import { Book } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface RelatedBooksSectionProps {
  currentBook: Book;
}

export function RelatedBooksSection({ currentBook }: RelatedBooksSectionProps) {
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (currentBook.recommendedBooks && currentBook.recommendedBooks.length > 0) {
      const converted: Book[] = currentBook.recommendedBooks.slice(0, 12).map((rb) => {
        const authorNames = rb.authors?.map((a) => a.name).join(", ") || "Unknown";
        const hbFormat = rb.formats?.find((f) => f.type === "hardback");
        const pbFormat = rb.formats?.find((f) => f.type === "paperback");
        const price = hbFormat?.price_gbp ?? pbFormat?.price_gbp ?? 0;
        const isEdited = rb.authors?.some((a) => a.role?.toLowerCase().includes("edit"));

        return {
          id: rb.isbn,
          title: rb.title,
          author: (isEdited ? "Edited By: " : "By: ") + authorNames,
          price,
          image: rb.cover_image,
          rating: 0,
          category: "General",
          description: rb.subtitle || undefined,
          isbn: rb.isbn,
        };
      });
      setRelatedBooks(converted);
      return;
    }

    const category = currentBook.categories?.[0] || currentBook.category;
    fetchBooks({ category, per_page: 12 })
      .then(({ books }) => {
        const filtered = books.filter((b) => b.id !== currentBook.id).slice(0, 12);
        setRelatedBooks(filtered);
      })
      .catch(() => setRelatedBooks([]));
  }, [currentBook]);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(relatedBooks.length / itemsPerPage);
  const visibleBooks = relatedBooks.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const goNext = useCallback(() => {
    setCurrentPage((p) => (p + 1) % totalPages);
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setCurrentPage((p) => (p - 1 + totalPages) % totalPages);
  }, [totalPages]);

  if (relatedBooks.length === 0) return null;

  return (
    <section className="container-wide py-16">
      {/* Title */}
      <h2 className="font-baskerville text-[32px] md:text-[40px] font-normal text-center text-[#333333] mb-12">
        Recommended
      </h2>

      {/* Carousel */}
      <div className="relative">
        {/* Prev Arrow */}
        {totalPages > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-10 w-12 h-12 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10 px-4 md:px-8">
          {visibleBooks.map((book) => (
            <Link
              key={book.id}
              to={`/books/${book.id}`}
              className="group text-center block"
            >
              {/* Cover */}
              <div className="aspect-[3/4] mb-4 overflow-hidden mx-auto max-w-[220px]">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Title */}
              <h3 className="font-baskerville text-[18px] md:text-[20px] font-normal text-[#333333] leading-tight line-clamp-2 mb-2">
                {book.title}
              </h3>

              {/* Author */}
              <p className="font-baskerville text-[15px] text-[#696969] line-clamp-2 mb-3">
                {book.author}
              </p>

              {/* Price */}
              <p className="font-baskerville text-[16px] text-[#C5A374]">
                From <span className="font-semibold">£{book.price.toFixed(2)}</span>
              </p>
            </Link>
          ))}
        </div>

        {/* Next Arrow */}
        {totalPages > 1 && (
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-10 w-12 h-12 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        )}
      </div>

      {/* Dot Indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                i === currentPage
                  ? "bg-accent scale-110"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
