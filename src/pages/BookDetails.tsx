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
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    addToCart
  } = useCart();
  const {
    isInWishlist,
    addToWishlist,
    removeFromWishlist
  } = useWishlist();
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>("hardbook");
  const [quantity, setQuantity] = useState(1);
  const book = books.find(b => b.id === id);

  /* Price Calculation */
  const getPrice = (format: BookFormat | "paperback") => {
    if (!book) return 0;
    if (format === "ebook") return book.price * 0.6;
    if (format === "paperback") return book.price * 0.8;
    return book.price;
  };

  /* Not Found */
  if (!book) {
    return <div className="min-h-screen bg-background">
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
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="container-wide py-6">
          <PageBreadcrumb items={[{
          label: "Books",
          href: "/books"
        }]} currentPage={book.title} />
        </div>

        {/* Main Section */}
        <section className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-start">
            {/* Image Section */}
            <div className="flex justify-center md:justify-start">
              <div className="w-full max-w-[340px] lg:max-w-[380px]">
                <img src={book.image} alt={book.title} className="
                    w-full
                    max-h-[520px]
                    object-contain
                  " />
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-between min-h-[520px]">
              <div>
                {/* Title */}
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">{book.title}</h1>

                {/* Subtitle */}
                <p className="font-serif text-base italic mb-4">{book.description}</p>

                {/* Author */}
                <p className="text-sm mb-4">
                  <span className="font-semibold">By:</span> {book.author}
                </p>

                {/* Blurb */}
                <p className="hidden sm:block text-muted-foreground leading-relaxed max-w-2xl mb-6 text-lg">
                  {book.blurb?.slice(0, 200)}
                  {book.blurb && book.blurb.length > 200 ? "..." : ""}
                </p>

                {/* Format */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Select Format</p>

                  <div className="flex flex-wrap gap-[10px]">
                    {/* Ebook */}
                    <button onClick={() => setSelectedFormat("ebook")} className={cn("flex items-center gap-2 px-4 py-2 border-2 transition min-w-[120px]", selectedFormat === "ebook" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50")}>
                      <Tablet className={cn("h-4 w-4", selectedFormat === "ebook" ? "text-accent" : "text-muted-foreground")} />

                      <div>
                        <p className={cn("text-sm font-medium", selectedFormat === "ebook" ? "text-accent" : "text-foreground")}>
                          eBook
                        </p>

                        <p className="text-xs text-muted-foreground">£{getPrice("ebook").toFixed(2)}</p>
                      </div>
                    </button>

                    {/* Hardback */}
                    <button onClick={() => setSelectedFormat("hardbook")} className={cn("flex items-center gap-2 px-4 py-2 border-2 transition min-w-[120px]", selectedFormat === "hardbook" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50")}>
                      <Book className={cn("h-4 w-4", selectedFormat === "hardbook" ? "text-accent" : "text-muted-foreground")} />

                      <div>
                        <p className={cn("text-sm font-medium", selectedFormat === "hardbook" ? "text-accent" : "text-foreground")}>
                          Hardback
                        </p>

                        <p className="text-xs text-muted-foreground">£{getPrice("hardbook").toFixed(2)}</p>
                      </div>
                    </button>

                    {/* Paperback */}
                    <button onClick={() => setSelectedFormat("paperback")} className={cn("flex items-center gap-2 px-4 py-2 border-2 transition min-w-[120px]", selectedFormat === "paperback" ? "border-accent bg-accent/5" : "border-border hover:border-accent/50")}>
                      <BookOpen className={cn("h-4 w-4", selectedFormat === "paperback" ? "text-accent" : "text-muted-foreground")} />

                      <div>
                        <p className={cn("text-sm font-medium", selectedFormat === "paperback" ? "text-accent" : "text-foreground")}>
                          Paperback
                        </p>

                        <p className="text-xs text-muted-foreground">£{getPrice("paperback").toFixed(2)}</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-6 mb-[20px] mt-0 my-0">
                  <span className="text-sm font-semibold uppercase tracking-wide">Quantity</span>

                  <div className="flex items-center border">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-muted">
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="px-4 py-2 min-w-[50px] text-center font-medium">{quantity}</span>

                    <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-muted">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 flex-wrap mt-6 my-[30px]">
                {/* Price */}
                <span className="text-lg text-muted-foreground">
                  From <span className="font-semibold text-foreground">£{getPrice(selectedFormat).toFixed(2)}</span>
                </span>

                {/* Add to Cart */}
                <Button size="lg" className="px-8" onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart({
                    ...book,
                    price: getPrice(selectedFormat)
                  }, selectedFormat);
                }
              }}>
                  ADD TO CART
                </Button>

                {/* Wishlist */}
                <Button variant="outline" size="lg" onClick={() => isInWishlist(book.id) ? removeFromWishlist(book.id) : addToWishlist(book)}>
                  <Heart className={cn("h-5 w-5", isInWishlist(book.id) && "fill-accent text-accent")} />
                </Button>

                {/* Sample */}
                {book.samplePdfUrl && <Button variant="outline" size="lg" onClick={() => window.open(book.samplePdfUrl, "_blank")}>
                    READ SAMPLE
                  </Button>}
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
    </div>;
}