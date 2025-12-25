import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, BookOpen, Calendar, Building, FileText } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/BookCard";
import { books } from "@/data/books";
import { useCart } from "@/contexts/CartContext";

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const book = books.find((b) => b.id === id);

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

  const relatedBooks = books
    .filter((b) => b.category === book.category && b.id !== book.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="container-wide py-6">
          <Link
            to="/books"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Books
          </Link>
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
              {book.originalPrice && (
                <div className="absolute top-4 left-4 bg-accent text-primary font-bold px-4 py-2 rounded-lg">
                  {Math.round((1 - book.price / book.originalPrice) * 100)}% OFF
                </div>
              )}
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

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-serif text-4xl font-bold text-foreground">
                  ${book.price.toFixed(2)}
                </span>
                {book.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${book.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-foreground/80 leading-relaxed mb-8">
                {book.description}
              </p>

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
                  onClick={() => addToCart(book)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="xl">
                  <Heart className="mr-2 h-5 w-5" />
                  Wishlist
                </Button>
                <Button variant="outline" size="icon" className="h-14 w-14">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <section className="container-wide mt-24">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedBooks.map((relatedBook) => (
                <BookCard key={relatedBook.id} book={relatedBook} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
