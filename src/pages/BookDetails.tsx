import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, Tablet, Book, BookOpen, ShoppingCart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { ReviewsSection } from "@/components/books/ReviewsSection";
import { RelatedBooksSection } from "@/components/books/RelatedBooksSection";
import { BookDetailsTabs } from "@/components/books/BookDetailsTabs";
import { books } from "@/data/books";
import { useCart, BookFormat } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>("hardbook");

  const book = books.find((b) => b.id === id);

  // Pricing based on format
  const getPrice = (format: BookFormat | "paperback") => {
    if (!book) return 0;
    if (format === "ebook") return book.price * 0.6;
    if (format === "paperback") return book.price * 0.8;
    return book.price;
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-32 pb-16">
          <div className="container-wide text-center">
            <h1 className="font-serif text-4xl font-bold text-foreground mb-4">Book Not Found</h1>

            <p className="text-muted-foreground mb-8">Sorry, we couldn't find the book you're looking for.</p>

            <Button asChild variant="gold">
              <Link to="/books">Browse All Books</Link>
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="container-wide py-6">
          <PageBreadcrumb items={[{ label: "Books", href: "/books" }]} currentPage={book.title} />
        </div>

        {/* Book Details */}
        <section className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Book Cover */}
            <div className="relative">
              <div className="mx-auto lg:mx-0 w-full max-w-[480px] overflow-hidden bg-secondary rounded-xl h-full">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Book Info */}
            <div className="flex flex-col justify-between py-4">
              {/* Top Content */}
              <div>
                {/* Category */}
                <p className="text-accent font-semibold uppercase tracking-wider mb-2">{book.category}</p>

                {/* Title */}
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                  {book.title}
                </h1>

                {/* Author */}
                <p className="text-lg text-muted-foreground mb-6">by {book.author}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < Math.floor(book.rating) ? "fill-accent text-accent" : "text-muted",
                        )}
                      />
                    ))}
                  </div>

                  <span className="font-semibold text-foreground">{book.rating}</span>

                  <span className="text-muted-foreground">(Based on 247 reviews)</span>
                </div>

                {/* Select Format */}
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-3">Select Format</p>

                  <div className="flex flex-wrap gap-3">
                    {/* Ebook */}
                    <button
                      onClick={() => setSelectedFormat("ebook")}
                      className={cn(
                        "flex items-center gap-3 px-5 py-4 border-2 transition-all min-w-[140px]",
                        selectedFormat === "ebook"
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50",
                      )}
                    >
                      <Tablet
                        className={cn("h-5 w-5", selectedFormat === "ebook" ? "text-accent" : "text-muted-foreground")}
                      />

                      <div className="text-left">
                        <p
                          className={cn("font-medium", selectedFormat === "ebook" ? "text-accent" : "text-foreground")}
                        >
                          eBook
                        </p>

                        <p className="text-sm text-muted-foreground">£{getPrice("ebook").toFixed(2)}</p>
                      </div>
                    </button>

                    {/* Hardback */}
                    <button
                      onClick={() => setSelectedFormat("hardbook")}
                      className={cn(
                        "flex items-center gap-3 px-5 py-4 border-2 transition-all min-w-[140px]",
                        selectedFormat === "hardbook"
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50",
                      )}
                    >
                      <Book
                        className={cn(
                          "h-5 w-5",
                          selectedFormat === "hardbook" ? "text-accent" : "text-muted-foreground",
                        )}
                      />

                      <div className="text-left">
                        <p
                          className={cn(
                            "font-medium",
                            selectedFormat === "hardbook" ? "text-accent" : "text-foreground",
                          )}
                        >
                          Hardback
                        </p>

                        <p className="text-sm text-muted-foreground">£{getPrice("hardbook").toFixed(2)}</p>
                      </div>
                    </button>

                    {/* Paperback */}
                    <button
                      onClick={() => setSelectedFormat("hardbook")}
                      className={cn(
                        "flex items-center gap-3 px-5 py-4 border-2 transition-all min-w-[140px]",
                        false ? "border-accent bg-accent/5" : "border-border hover:border-accent/50",
                      )}
                    >
                      <BookOpen className="h-5 w-5 text-muted-foreground" />

                      <div className="text-left">
                        <p className="font-medium text-foreground">Paperback</p>

                        <p className="text-sm text-muted-foreground">£{getPrice("paperback").toFixed(2)}</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <span className="font-serif text-4xl font-bold text-foreground">
                    £{getPrice(selectedFormat).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions Bottom */}
              <div className="flex items-center gap-3">
                <Button
                  variant="gold"
                  size="lg"
                  className="px-8"
                  onClick={() => addToCart({ ...book, price: getPrice(selectedFormat) }, selectedFormat)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  ADD TO CART
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="px-4"
                  onClick={() => (isInWishlist(book.id) ? removeFromWishlist(book.id) : addToWishlist(book))}
                >
                  <Heart className={cn("h-5 w-5", isInWishlist(book.id) && "fill-accent text-accent")} />
                </Button>

                {book.samplePdfUrl && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-6"
                    onClick={() => window.open(book.samplePdfUrl, "_blank")}
                  >
                    READ SAMPLE
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <BookDetailsTabs book={book} />

        {/* Reviews */}
        <ReviewsSection bookId={book.id} />

        {/* Related */}
        <div className="mt-24">
          <RelatedBooksSection currentBook={book} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
