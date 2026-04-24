import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Minus, Plus, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ReviewsSection } from "@/components/books/ReviewsSection";
import { RelatedBooksSection } from "@/components/books/RelatedBooksSection";
import { BookDetailsTabs } from "@/components/books/BookDetailsTabs";
import { Book as BookIcon } from "lucide-react";
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
        <main className="pt-32 sm:pt-44 pb-12 sm:pb-16 bg-white">
        <section className="container-wide bg-white px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 sm:gap-8 lg:gap-12 items-stretch">
            {/* Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px]">
                <img ref={imageRef} src={book.image} alt={book.title} className="w-full object-contain" onLoad={updateImageHeight} />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col" style={imageHeight && window.innerWidth >= 1024 ? { height: imageHeight } : undefined}>
              <div>
                <h1 className="font-baskerville font-normal text-[#333333] mb-[20px] leading-tight text-2xl">{book.title}</h1>
                {book.subtitle && (
                  <p className="font-baskerville italic text-[#333333] mb-[24px] leading-snug text-base">
                    {book.subtitle}
                  </p>
                )}
                <p className="font-baskerville text-[#696969] mb-[24px] text-base">
                  <span className="font-semibold text-black">By:</span> {book.author}
                </p>
                {book.shortDescription && (
                  <p
                    className="hidden sm:block leading-relaxed max-w-3xl mb-6 lg:mb-8 text-base font-light text-[#696969]"
                    style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                  >
                    {book.shortDescription}
                  </p>
                )}

                {/* Format Selection */}
                <div className="mb-6">
                  <p className="font-serif tracking-wider normal-case text-sm uppercase mb-3 font-bold">BINDING</p>
                  <div className="flex gap-3">
                    {hasHardback && (
                      <button
                        onClick={() => setSelectedFormat("hardbook")}
                        className={cn(
                          "flex items-center gap-2 px-6 py-3 transition-colors min-w-[120px] rounded-none",
                          selectedFormat === "hardbook"
                            ? "border-black bg-white border-solid border"
                            : "border border-border hover:border-accent/50 bg-white"
                        )}
                      >
                        <BookIcon className={cn("h-5 w-5", selectedFormat === "hardbook" ? "text-accent" : "text-muted-foreground")} />
                        <span className={cn("font-serif tracking-wider normal-case text-sm font-medium", selectedFormat === "hardbook" ? "text-accent" : "text-foreground")}>HARDBACK</span>
                        
                      </button>
                    )}
                    {hasPaperback && (
                      <button
                        onClick={() => setSelectedFormat("paperback")}
                        className={cn(
                          "flex items-center gap-2 px-6 py-3 transition-colors min-w-[120px] rounded-none",
                          selectedFormat === "paperback"
                            ? "border-black bg-white border-solid border"
                            : "border border-border hover:border-accent/50 bg-white"
                        )}
                      >
                        <BookIcon className={cn("h-5 w-5", selectedFormat === "paperback" ? "text-accent" : "text-muted-foreground")} />
                        <span className={cn("font-serif tracking-wider normal-case text-sm font-medium", selectedFormat === "paperback" ? "text-accent" : "text-foreground")}>PAPERBACK</span>
                        
                      </button>
                    )}
                    {hasEbook && (
                      <button
                        onClick={() => setSelectedFormat("ebook")}
                        className={cn(
                          "flex items-center gap-2 px-6 py-3 transition-colors min-w-[120px] rounded-none",
                          selectedFormat === "ebook"
                            ? "border-black bg-white border-solid border"
                            : "border border-border hover:border-accent/50 bg-white"
                        )}
                      >
                        <BookIcon className={cn("h-5 w-5", selectedFormat === "ebook" ? "text-accent" : "text-muted-foreground")} />
                        <span className={cn("font-serif tracking-wider normal-case text-sm font-medium", selectedFormat === "ebook" ? "text-accent" : "text-foreground")}>EBOOK</span>
                        
                      </button>
                    )}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4 sm:gap-6 mb-6">
                  <span className="font-serif tracking-wider normal-case text-sm uppercase font-bold">QUANTITY</span>
                  <div className="flex items-center border">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-muted"><Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></button>
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 min-w-[40px] sm:min-w-[50px] text-center font-serif tracking-wider text-sm font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-muted"><Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /></button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                 <div className="text-[#c4a273] text-lg font-semibold" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                   <span className="font-semibold text-[#c4a273] text-lg">From £{getPrice(selectedFormat).toFixed(2)}</span>
                </div>
                <Button
                  size="lg"
                    className="px-8 font-serif tracking-wider normal-case text-sm font-light bg-[#e4573d] hover:bg-black text-white"
                  onClick={() => {
                    const formatIsbn =
                      selectedFormat === "ebook"
                        ? book.ebookInfo?.isbn13 || book.ebookInfo?.isbn
                        : selectedFormat === "paperback"
                          ? book.paperbackInfo?.isbn13 || book.paperbackInfo?.isbn
                          : book.hardbackInfo?.isbn13 || book.hardbackInfo?.isbn;
                    for (let i = 0; i < quantity; i++) {
                      addToCart(
                        { ...book, price: getPrice(selectedFormat), isbn: formatIsbn || book.isbn },
                        selectedFormat,
                      );
                    }
                  }}
                >
                  ADD TO CART
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                    className="border-black border w-12 px-0 group text-muted-foreground hover:bg-[#e4573d] hover:border-[#e4573d] hover:text-white"
                  onClick={() => (isInWishlist(book.id) ? removeFromWishlist(book.id) : addToWishlist(book))}
                >
                  <Heart className={cn("h-5 w-5 text-muted-foreground group-hover:text-accent-foreground transition-colors", isInWishlist(book.id) && "fill-accent text-accent")} />
                </Button>
                {book.samplePdfUrl && (
                  <Button size="lg" variant="outline" className="px-8 font-serif tracking-wider normal-case text-sm font-light border border-black bg-white text-black hover:bg-[#e4573d] hover:text-white hover:border-[#e4573d]" onClick={() => window.open(book.samplePdfUrl, "_blank")}>
                    READ SAMPLE
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <BookDetailsTabs book={book} />

        {/* Customer Reviews removed */}

        {/* Related */}
        <div className="mt-24">
          <RelatedBooksSection currentBook={book} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
