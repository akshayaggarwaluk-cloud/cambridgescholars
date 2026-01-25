import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Eye, Plus, Minus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>("hardbook");
  const [quantity, setQuantity] = useState(1);

  const book = books.find((b) => b.id === id);
  
  // eBook is typically cheaper
  const getPrice = (format: BookFormat) => {
    if (!book) return 0;
    return format === "ebook" ? book.price * 0.6 : book.price;
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Book Cover */}
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-card-hover bg-secondary">
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

              {/* Binding Selection */}
              <div className="flex items-center gap-6 mb-6">
                <span className="text-sm font-medium uppercase tracking-wider text-foreground min-w-[80px]">
                  Binding
                </span>
                <Select 
                  value={selectedFormat} 
                  onValueChange={(value: BookFormat) => setSelectedFormat(value)}
                >
                  <SelectTrigger className="w-[280px] border-border">
                    <SelectValue placeholder="Choose an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hardbook">Hardback - £{getPrice("hardbook").toFixed(2)}</SelectItem>
                    <SelectItem value="ebook">eBook - £{getPrice("ebook").toFixed(2)}</SelectItem>
                  </SelectContent>
                </Select>
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
                      addToCart({ ...book, price: getPrice(selectedFormat) }, selectedFormat);
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
