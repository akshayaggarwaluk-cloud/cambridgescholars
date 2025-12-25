import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { books } from "@/data/books";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

// Staff picks - select specific high-rated books
const staffPicks = [
  { ...books[0], badge: "Editor's Choice" },
  { ...books[1], badge: "Most Popular" },
  { ...books[6], badge: "Staff Pick" },
  { ...books[3], badge: "Award Winner" },
  { ...books[7], badge: "Trending Now" },
];

export function FeaturedBooksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { addToCart } = useCart();

  const activeBook = staffPicks[activeIndex];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % staffPicks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + staffPicks.length) % staffPicks.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % staffPicks.length);
  };

  return (
    <section className="py-24 bg-gradient-charcoal relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4" />
            Staff Picks & Trending
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Featured Books
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Handpicked selections from our literary experts, guaranteed to captivate and inspire
          </p>
        </div>

        {/* Main Carousel */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Book Image */}
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-accent/20 rounded-3xl blur-2xl" />
              
              {/* Main Image */}
              <div className="relative aspect-[3/4] w-64 md:w-80 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img
                  src={activeBook.image}
                  alt={activeBook.title}
                  className="w-full h-full object-cover transition-all duration-700"
                />
                
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-gold">
                  {activeBook.badge}
                </div>
              </div>

              {/* Floating Thumbnails */}
              <div className="absolute -right-8 md:-right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                {staffPicks.map((book, index) => (
                  <button
                    key={book.id}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setActiveIndex(index);
                    }}
                    className={cn(
                      "w-14 h-20 md:w-16 md:h-24 rounded-lg overflow-hidden transition-all duration-300 ring-2",
                      activeIndex === index
                        ? "ring-accent scale-110 shadow-gold"
                        : "ring-transparent opacity-50 hover:opacity-80"
                    )}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="text-primary-foreground space-y-6">
            <div className="space-y-4">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">
                {activeBook.category}
              </span>
              <h3 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
                {activeBook.title}
              </h3>
              <p className="text-xl text-primary-foreground/80">
                by {activeBook.author}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(activeBook.rating)
                        ? "fill-accent text-accent"
                        : "fill-primary-foreground/20 text-primary-foreground/20"
                    )}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{activeBook.rating}</span>
              <span className="text-primary-foreground/60">• 2,847 reviews</span>
            </div>

            {/* Description */}
            <p className="text-primary-foreground/70 text-lg leading-relaxed line-clamp-3">
              {activeBook.description}
            </p>

            {/* Price & Actions */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-4xl font-bold">
                  ${activeBook.price.toFixed(2)}
                </span>
                {activeBook.originalPrice && (
                  <span className="text-xl text-primary-foreground/50 line-through">
                    ${activeBook.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="gold"
                  size="lg"
                  className="rounded-full px-8 gap-2 shadow-gold"
                  onClick={() => addToCart(activeBook)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="rounded-full px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to={`/books/${activeBook.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrev}
            className="rounded-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 h-12 w-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Progress Indicators */}
          <div className="flex gap-2">
            {staffPicks.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveIndex(index);
                }}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  activeIndex === index
                    ? "w-8 bg-accent"
                    : "w-2 bg-primary-foreground/30 hover:bg-primary-foreground/50"
                )}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="rounded-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 h-12 w-12"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
}
