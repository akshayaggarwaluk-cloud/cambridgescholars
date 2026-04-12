import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Minus, Plus, Tablet, Book, BookOpen, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ReviewsSection } from "@/components/books/ReviewsSection";
import { RelatedBooksSection } from "@/components/books/RelatedBooksSection";
import { BookDetailsTabs } from "@/components/books/BookDetailsTabs";
import { fetchBookByIsbn } from "@/services/cspApi";
import { useCart, BookFormat, Book as BookType } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>("hardbook");
  const [quantity, setQuantity] = useState(1);
  const [book, setBook] = useState<(BookType & { _hardbackPrice?: number | null; _paperbackPrice?: number | null; _praise?: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  const updateImageHeight = useCallback(() => {
    if (imageRef.current) {
      setImageHeight(imageRef.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateImageHeight);
    return () => window.removeEventListener("resize", updateImageHeight);
  }, [updateImageHeight]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchBookByIsbn(id)
      .then((data) => setBook(data as any))
      .catch((err) => {
        console.error("Error fetching book:", err);
        setBook(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const getPrice = (format: BookFormat | "paperback") => {
    if (!book) return 0;
    if (format === "ebook") return (book._hardbackPrice || book.price) * 0.6;
    if (format === "paperback") return book._paperbackPrice || book.price * 0.8;
    return book._hardbackPrice || book.price;
  };

  const hasHardback = !!book?.hardbackInfo;
  const hasPaperback = !!book?.paperbackInfo;
  const hasEbook = !!book?.ebookInfo;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <span className="ml-3 text-muted-foreground">Loading book details...</span>
        </main>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-16">
          <div className="container-wide text-center">
            <h1 className="font-serif text-4xl font-bold mb-4">Book Not Found</h1>
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
      <main className="pt-32 pb-16 bg-white">
        <section className="container-wide bg-white">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-start">
            {/* Image */}
            <div className="flex justify-center md:justify-start">
              <div className="w-full max-w-[280px] lg:max-w-[320px]">
                <img ref={imageRef} src={book.image} alt={book.title} className="w-full object-contain" onLoad={updateImageHeight} />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between" style={imageHeight ? { maxHeight: imageHeight, overflowY: 'auto' } : undefined}>
              <div>
                <h1 className="font-baskerville text-2xl sm:text-3xl mb-3 lg:text-xl font-medium">{book.title}</h1>
                <p className="font-baskerville text-base italic mb-4 text-black line-clamp-2">{book.description}</p>
                <p className="mb-4 text-base">
                  <span className="font-semibold">By:</span> {book.author}
                </p>
                <p className="hidden sm:block text-muted-foreground leading-relaxed max-w-3xl mb-6 text-lg">
                  {book.blurb?.slice(0, 200)}
                  {book.blurb && book.blurb.length > 200 ? "..." : ""}
                </p>

                {/* Format Selection */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Select Format</p>
                  <div className="flex flex-wrap gap-[10px]">
                    {hasEbook && (
                      <button
                        onClick={() => setSelectedFormat("ebook")}
                        className={cn("flex items-center gap-2 px-4 py-2 border-2 transition min-w-[120px]", selectedFormat === "ebook" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50")}
                      >
                        <Tablet className={cn("h-4 w-4", selectedFormat === "ebook" ? "text-accent" : "text-muted-foreground")} />
                        <div>
                          <p className={cn("text-sm font-medium", selectedFormat === "ebook" ? "text-accent" : "text-foreground")}>eBook</p>
                          <p className="text-xs text-muted-foreground">£{getPrice("ebook").toFixed(2)}</p>
                        </div>
                      </button>
                    )}
                    {hasHardback && (
                      <button
                        onClick={() => setSelectedFormat("hardbook")}
                        className={cn("flex items-center gap-2 px-4 py-2 border-2 transition min-w-[120px]", selectedFormat === "hardbook" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50")}
                      >
                        <Book className={cn("h-4 w-4", selectedFormat === "hardbook" ? "text-accent" : "text-muted-foreground")} />
                        <div>
                          <p className={cn("text-sm font-medium", selectedFormat === "hardbook" ? "text-accent" : "text-foreground")}>Hardback</p>
                          <p className="text-xs text-muted-foreground">£{getPrice("hardbook").toFixed(2)}</p>
                        </div>
                      </button>
                    )}
                    {hasPaperback && (
                      <button
                        onClick={() => setSelectedFormat("paperback")}
                        className={cn("flex items-center gap-2 px-4 py-2 border-2 transition min-w-[120px]", selectedFormat === "paperback" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50")}
                      >
                        <BookOpen className={cn("h-4 w-4", selectedFormat === "paperback" ? "text-accent" : "text-muted-foreground")} />
                        <div>
                          <p className={cn("text-sm font-medium", selectedFormat === "paperback" ? "text-accent" : "text-foreground")}>Paperback</p>
                          <p className="text-xs text-muted-foreground">£{getPrice("paperback").toFixed(2)}</p>
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-6 mb-[20px] mt-0">
                  <span className="text-sm font-semibold uppercase tracking-wide">Quantity</span>
                  <div className="flex items-center border">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-muted"><Minus className="h-4 w-4" /></button>
                    <span className="px-4 py-2 min-w-[50px] text-center font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-muted"><Plus className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 flex-wrap mt-6 my-[30px]">
                <span className="text-lg text-muted-foreground">
                  From <span className="font-semibold text-foreground">£{getPrice(selectedFormat).toFixed(2)}</span>
                </span>
                <Button
                  size="lg"
                  className="px-8"
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
                  size="lg"
                  onClick={() => (isInWishlist(book.id) ? removeFromWishlist(book.id) : addToWishlist(book))}
                >
                  <Heart className={cn("h-5 w-5", isInWishlist(book.id) && "fill-accent text-accent")} />
                </Button>
                {book.samplePdfUrl && (
                  <Button variant="outline" size="lg" onClick={() => window.open(book.samplePdfUrl, "_blank")}>
                    READ SAMPLE
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <BookDetailsTabs book={book} />

        {/* Press Reviews from API */}
        {book.apiReviews && book.apiReviews.length > 0 && (
          <section className="container-wide mt-16">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Press Reviews</h2>
            <div className="space-y-6">
              {book.apiReviews.map((review, idx) => (
                <blockquote key={idx} className="border-l-4 border-accent pl-6 py-2">
                  <p className="text-foreground/80 italic leading-relaxed">{review.review}</p>
                  <footer className="mt-3 text-sm text-muted-foreground">
                    — <strong>{review.reviewer}</strong>
                    {review.reviewer_position && `, ${review.reviewer_position}`}
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {/* Customer Reviews */}
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
