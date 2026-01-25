import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Plus, Minus } from "lucide-react";
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

type BindingFormat = "hardback" | "paperback" | "ebook";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [selectedBinding, setSelectedBinding] = useState<BindingFormat>("hardback");
  const [quantity, setQuantity] = useState(1);

  const book = books.find((b) => b.id === id);
  
  // Pricing based on binding type
  const getPrice = (binding: BindingFormat) => {
    if (!book) return 0;
    switch (binding) {
      case "ebook":
        return book.price * 0.6;
      case "paperback":
        return book.price * 0.8;
      case "hardback":
      default:
        return book.price;
    }
  };

  // Map binding to cart format
  const getCartFormat = (binding: BindingFormat): BookFormat => {
    return binding === "ebook" ? "ebook" : "hardbook";
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);


  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-16">
          <div className="container-wide text-center">
            <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
              Book Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              Sorry, we couldn't find the book you're looking for.
            </p>
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
          <PageBreadcrumb 
            items={[{ label: "Books", href: "/books" }]} 
            currentPage={book.title} 
          />
        </div>

        {/* Book Details */}
        <section className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Book Cover - matches content height */}
            <div className="relative h-fit">
              <div className="aspect-[3/4] max-h-[500px] overflow-hidden bg-secondary">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Book Info */}
            <div className="flex flex-col">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
                {book.title}
              </h1>
              
              {/* Subtitle - show blurb as subtitle if available, otherwise description */}
              {(book.blurb || book.description) && (
                <p className="font-serif text-lg italic text-foreground/80 mb-4">
                  {book.blurb ? book.blurb.substring(0, 100) + (book.blurb.length > 100 ? '...' : '') : book.description?.substring(0, 100) + (book.description && book.description.length > 100 ? '...' : '')}
                </p>
              )}

              <p className="text-lg text-foreground mb-6">
                <span className="font-medium">By:</span> {book.author}
              </p>

              {/* Full Description */}
              {book.description && (
                <p className="text-foreground/80 leading-relaxed mb-8">
                  {book.description}
                </p>
              )}

              {/* Binding Selection - Box Options */}
              <div className="mb-6">
                <span className="text-sm font-medium uppercase tracking-wider text-foreground block mb-3">
                  Binding
                </span>
                <div className="flex flex-wrap gap-3">
                  {(["hardback", "paperback", "ebook"] as BindingFormat[]).map((binding) => (
                    <button
                      key={binding}
                      onClick={() => setSelectedBinding(binding)}
                      className={cn(
                        "px-6 py-3 border-2 transition-all text-sm font-medium uppercase tracking-wide",
                        selectedBinding === binding
                          ? "border-accent bg-accent text-white"
                          : "border-border bg-background text-foreground hover:border-accent"
                      )}
                    >
                      {binding === "ebook" ? "eBook" : binding.charAt(0).toUpperCase() + binding.slice(1)} - £{getPrice(binding).toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-6 mb-8">
                <span className="text-sm font-medium uppercase tracking-wider text-foreground min-w-[80px]">
                  Quantity
                </span>
                <div className="flex items-center border border-border">
                  <button
                    onClick={decrementQuantity}
                    className="px-4 py-2 hover:bg-secondary transition-colors border-r border-border"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-2 font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="px-4 py-2 hover:bg-secondary transition-colors border-l border-border"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Price and Actions Row */}
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-serif text-2xl text-foreground">
                  From £{getPrice("ebook").toFixed(2)}
                </span>
                
                <Button
                  variant="gold"
                  size="lg"
                  className="px-8"
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      addToCart({ ...book, price: getPrice(selectedBinding) }, getCartFormat(selectedBinding));
                    }
                  }}
                >
                  ADD TO CART
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-4"
                  onClick={() => isInWishlist(book.id) ? removeFromWishlist(book.id) : addToWishlist(book)}
                >
                  <Heart className={cn("h-5 w-5", isInWishlist(book.id) && "fill-accent text-accent")} />
                </Button>

                {book.samplePdfUrl && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-6"
                    onClick={() => window.open(book.samplePdfUrl, '_blank')}
                  >
                    READ SAMPLE
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Book Details Tabs - Blurb, Biography, Book Information */}
        <BookDetailsTabs book={book} />

        {/* Reviews Section */}
        <ReviewsSection bookId={book.id} />

        {/* Related Books */}
        <div className="mt-24">
          <RelatedBooksSection currentBook={book} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
