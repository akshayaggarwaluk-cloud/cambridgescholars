import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Minus, Plus, Tablet, Book, BookOpen } from "lucide-react";
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
  const [quantity, setQuantity] = useState(1);

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Book Cover */}
            <div className="relative">
              <div className="mx-auto lg:mx-0 w-full max-w-[320px]">
                <img src={book.image} alt={book.title} className="w-full h-auto object-contain" />
              </div>
            </div>

            {/* Book Info */}
            <div className="flex flex-col justify-between">
              {/* Top Content */}
              <div>
                {/* Title */}
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {book.title}
                </h1>

                {/* Subtitle/Description */}
                <p className="font-serif text-base italic text-foreground mb-3">
                  {book.description}
                </p>

                {/* Author */}
                <p className="text-sm text-foreground mb-4">
                  <span className="font-semibold">By:</span> {book.author}
                </p>

                {/* Blurb */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {book.blurb?.slice(0, 180)}{book.blurb && book.blurb.length > 180 ? '...' : ''}
                </p>

                {/* Select Format */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Select Format</p>

                  <div className="flex flex-wrap gap-2">
                    {/* Ebook */}
                    <button
                      onClick={() => setSelectedFormat("ebook")}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 border-2 transition-all min-w-[110px]",
                        selectedFormat === "ebook"
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50",
                      )}
                    >
                      <Tablet
                        className={cn("h-4 w-4", selectedFormat === "ebook" ? "text-accent" : "text-muted-foreground")}
                      />
                      <div className="text-left">
                        <p className={cn("text-sm font-medium", selectedFormat === "ebook" ? "text-accent" : "text-foreground")}>
                          eBook
                        </p>
                        <p className="text-xs text-muted-foreground">£{getPrice("ebook").toFixed(2)}</p>
                      </div>
                    </button>

                    {/* Hardback */}
                    <button
                      onClick={() => setSelectedFormat("hardbook")}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 border-2 transition-all min-w-[110px]",
                        selectedFormat === "hardbook"
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50",
                      )}
                    >
                      <Book
                        className={cn("h-4 w-4", selectedFormat === "hardbook" ? "text-accent" : "text-muted-foreground")}
                      />
                      <div className="text-left">
                        <p className={cn("text-sm font-medium", selectedFormat === "hardbook" ? "text-accent" : "text-foreground")}>
                          Hardback
                        </p>
                        <p className="text-xs text-muted-foreground">£{getPrice("hardbook").toFixed(2)}</p>
                      </div>
                    </button>

                    {/* Paperback */}
                    <button
                      onClick={() => setSelectedFormat("paperback")}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 border-2 transition-all min-w-[110px]",
                        selectedFormat === "paperback"
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50",
                      )}
                    >
                      <BookOpen
                        className={cn("h-4 w-4", selectedFormat === "paperback" ? "text-accent" : "text-muted-foreground")}
                      />
                      <div className="text-left">
                        <p className={cn("text-sm font-medium", selectedFormat === "paperback" ? "text-accent" : "text-foreground")}>
                          Paperback
                        </p>
                        <p className="text-xs text-muted-foreground">£{getPrice("paperback").toFixed(2)}</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* QUANTITY */}
                <div className="flex items-center gap-6 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Quantity</span>
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2 py-1 hover:bg-muted transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 py-1 min-w-[40px] text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2 py-1 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                {/* Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Price */}
                  <span className="text-lg text-muted-foreground">
                    From <span className="font-semibold text-foreground">£{getPrice(selectedFormat).toFixed(2)}</span>
                  </span>

                  <Button
                    variant="default"
                    size="default"
                    className="px-6"
                    onClick={() => {
                      for (let i = 0; i < quantity; i++) {
                        addToCart({ ...book, price: getPrice(selectedFormat) }, selectedFormat);
                      }
                    }}
                  >
                    ADD TO CART
                  </Button>

                  <Button
                    variant="outline"
                    size="default"
                    className="px-3"
                    onClick={() => (isInWishlist(book.id) ? removeFromWishlist(book.id) : addToWishlist(book))}
                  >
                    <Heart className={cn("h-4 w-4", isInWishlist(book.id) && "fill-accent text-accent")} />
                  </Button>

                  {book.samplePdfUrl && (
                    <Button
                      variant="outline"
                      size="default"
                      className="px-4"
                      onClick={() => window.open(book.samplePdfUrl, "_blank")}
                    >
                      READ SAMPLE
                    </Button>
                  )}
                </div>
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
