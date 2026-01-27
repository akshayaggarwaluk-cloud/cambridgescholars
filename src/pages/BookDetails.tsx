import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Minus, Plus, ChevronDown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { ReviewsSection } from "@/components/books/ReviewsSection";
import { RelatedBooksSection } from "@/components/books/RelatedBooksSection";
import { BookDetailsTabs } from "@/components/books/BookDetailsTabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { books } from "@/data/books";
import { useCart, BookFormat } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [selectedFormat, setSelectedFormat] = useState<BookFormat | "">("");
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
                {/* Title */}
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {book.title}
                </h1>

                {/* Subtitle/Description */}
                <p className="font-serif text-lg italic text-foreground mb-4">
                  {book.description}
                </p>

                {/* Author */}
                <p className="text-base text-foreground mb-6">
                  <span className="font-semibold">By:</span> {book.author}
                </p>

                {/* Blurb */}
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {book.blurb?.slice(0, 250)}{book.blurb && book.blurb.length > 250 ? '...' : ''}
                </p>

                {/* BINDING Dropdown */}
                <div className="flex items-center gap-8 mb-6">
                  <span className="text-sm font-semibold uppercase tracking-wider text-foreground">Binding</span>
                  <Select 
                    value={selectedFormat} 
                    onValueChange={(value) => setSelectedFormat(value as BookFormat)}
                  >
                    <SelectTrigger className="w-[280px] bg-background border-border">
                      <SelectValue placeholder="Choose an option" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="ebook">eBook - £{getPrice("ebook").toFixed(2)}</SelectItem>
                      <SelectItem value="hardbook">Hardback - £{getPrice("hardbook").toFixed(2)}</SelectItem>
                      <SelectItem value="paperback">Paperback - £{getPrice("paperback").toFixed(2)}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* QUANTITY */}
                <div className="flex items-center gap-8 mb-8">
                  <span className="text-sm font-semibold uppercase tracking-wider text-foreground">Quantity</span>
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 min-w-[50px] text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions Bottom */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Price */}
                <span className="text-xl text-muted-foreground">
                  From <span className="font-semibold text-foreground">£{getPrice(selectedFormat || "ebook").toFixed(2)}</span>
                </span>

                <Button
                  variant="default"
                  size="lg"
                  className="px-8"
                  disabled={!selectedFormat}
                  onClick={() => {
                    if (selectedFormat) {
                      for (let i = 0; i < quantity; i++) {
                        addToCart({ ...book, price: getPrice(selectedFormat) }, selectedFormat as BookFormat);
                      }
                    }
                  }}
                >
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
