import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, BookOpen, Calendar, Building, FileText, Tablet, Book, Eye, Facebook, Twitter, Linkedin } from "lucide-react";
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
  
  // eBook is typically cheaper
  const getPrice = (format: BookFormat) => {
    if (!book) return 0;
    return format === "ebook" ? book.price * 0.6 : book.price;
  };

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
              <p className="text-accent font-medium uppercase tracking-wider mb-2">
                {book.category}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                by {book.author}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(book.rating)
                          ? "fill-accent text-accent"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-foreground">
                  {book.rating}
                </span>
                <span className="text-muted-foreground">
                  (Based on 247 reviews)
                </span>
              </div>

              {/* Format Selection */}
              <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground mb-3">Select Format</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedFormat("ebook")}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all",
                      selectedFormat === "ebook"
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50"
                    )}
                  >
                    <Tablet className={cn("h-5 w-5", selectedFormat === "ebook" ? "text-accent" : "text-muted-foreground")} />
                    <div className="text-left">
                      <p className={cn("font-medium", selectedFormat === "ebook" ? "text-accent" : "text-foreground")}>eBook</p>
                      <p className="text-sm text-muted-foreground">${getPrice("ebook").toFixed(2)}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedFormat("hardbook")}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all",
                      selectedFormat === "hardbook"
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50"
                    )}
                  >
                    <Book className={cn("h-5 w-5", selectedFormat === "hardbook" ? "text-accent" : "text-muted-foreground")} />
                    <div className="text-left">
                      <p className={cn("font-medium", selectedFormat === "hardbook" ? "text-accent" : "text-foreground")}>Hardbook</p>
                      <p className="text-sm text-muted-foreground">${getPrice("hardbook").toFixed(2)}</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-serif text-4xl font-bold text-foreground">
                  ${getPrice(selectedFormat).toFixed(2)}
                </span>
              </div>

              {/* Short Description - only show if no blurb */}
              {!book.blurb && book.description && (
                <p className="text-foreground/80 leading-relaxed mb-8">
                  {book.description}
                </p>
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-secondary rounded-xl">
                {book.pages && (
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pages</p>
                      <p className="font-medium text-foreground">{book.pages}</p>
                    </div>
                  </div>
                )}
                {book.publishDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Published</p>
                      <p className="font-medium text-foreground">
                        {new Date(book.publishDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                {book.publisher && (
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Publisher</p>
                      <p className="font-medium text-foreground">{book.publisher}</p>
                    </div>
                  </div>
                )}
                {book.isbn && (
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">ISBN</p>
                      <p className="font-medium text-foreground">{book.isbn}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <Button
                  variant="gold"
                  size="xl"
                  className="flex-1"
                  onClick={() => addToCart({ ...book, price: getPrice(selectedFormat) }, selectedFormat)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button 
                  variant={isInWishlist(book.id) ? "gold" : "outline"} 
                  size="xl"
                  onClick={() => isInWishlist(book.id) ? removeFromWishlist(book.id) : addToWishlist(book)}
                >
                  <Heart className={cn("mr-2 h-5 w-5", isInWishlist(book.id) && "fill-current")} />
                  {isInWishlist(book.id) ? "In Wishlist" : "Wishlist"}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-14 w-14"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  title="Share on Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-14 w-14"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out "${book.title}" by ${book.author}`)}`, '_blank')}
                  title="Share on Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-14 w-14"
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  title="Share on LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>

              {/* Read Sample Button */}
              {book.samplePdfUrl && (
                <Button
                  variant="outline"
                  size="lg"
                  className="mt-4 w-full sm:w-auto"
                  onClick={() => window.open(book.samplePdfUrl, '_blank')}
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Read Sample
                </Button>
              )}
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
