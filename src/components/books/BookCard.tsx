import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Book, useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  className?: string;
}

export function BookCard({ book, className }: BookCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(book.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  return (
    <div
      className={cn(
        "group relative bg-card rounded-2xl overflow-hidden border border-border/50 transition-all duration-300 hover:border-accent/30 hover:shadow-card-hover",
        className
      )}
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className={cn(
          "absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
          inWishlist 
            ? "bg-accent text-accent-foreground shadow-gold" 
            : "bg-card/90 backdrop-blur-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
      </button>

      <Link to={`/books/${book.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Sale Badge */}
          {book.originalPrice && (
            <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              {Math.round((1 - book.price / book.originalPrice) * 100)}% OFF
            </div>
          )}
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick Add Button */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Button
              variant="gold"
              size="lg"
              className="w-full rounded-xl shadow-gold gap-2 font-semibold"
              onClick={(e) => {
                e.preventDefault();
                addToCart(book);
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/books/${book.id}`} className="block space-y-3">
          {/* Category Tag */}
          <span className="inline-block text-xs font-semibold text-accent uppercase tracking-widest">
            {book.category}
          </span>
          
          {/* Title */}
          <h3 className="font-serif text-lg font-bold text-foreground line-clamp-2 leading-tight group-hover:text-accent transition-colors duration-200">
            {book.title}
          </h3>
          
          {/* Author */}
          <p className="text-sm text-muted-foreground font-medium">
            by {book.author}
          </p>
        </Link>

        {/* Rating & Price */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(book.rating) 
                      ? "fill-accent text-accent" 
                      : "fill-muted text-muted"
                  )} 
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground ml-1">{book.rating}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {book.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="font-serif text-xl font-bold text-foreground">
              ${book.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
