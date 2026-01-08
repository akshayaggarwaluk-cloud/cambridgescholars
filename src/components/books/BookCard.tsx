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
        "group relative bg-card rounded-2xl overflow-hidden transition-all duration-500",
        "border border-border/50 hover:border-accent/30",
        "shadow-card hover:shadow-card-hover hover:-translate-y-2",
        className
      )}
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className={cn(
          "absolute top-4 right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300",
          inWishlist 
            ? "bg-accent text-accent-foreground shadow-gold scale-110" 
            : "bg-card/95 backdrop-blur-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:scale-110 border border-border/50"
        )}
      >
        <Heart className={cn("h-5 w-5 transition-transform", inWishlist && "fill-current")} />
      </button>

      <Link to={`/books/${book.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
          />
          
          
          {/* Premium gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          {/* Quick Add Button */}
          <div className="absolute bottom-5 left-5 right-5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-100">
            <Button
              variant="gold"
              size="lg"
              className="w-full rounded-xl shadow-gold gap-2 font-semibold h-12"
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

      <div className="p-6">
        <Link to={`/books/${book.id}`} className="block space-y-3">
          {/* Category Tag */}
          <span className="inline-block text-xs font-semibold text-accent uppercase tracking-[0.15em]">
            {book.category}
          </span>
          
          {/* Title */}
          <h3 className="font-serif text-xl font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-accent transition-colors duration-300">
            {book.title}
          </h3>
          
          {/* Author */}
          <p className="text-sm text-muted-foreground font-medium">
            by {book.author}
          </p>
        </Link>

        {/* Rating & Price */}
        <div className="flex items-center justify-between mt-5 pt-5 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-4 w-4 transition-colors",
                    i < Math.floor(book.rating) 
                      ? "fill-accent text-accent" 
                      : "fill-muted text-muted"
                  )} 
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">{book.rating}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-foreground">
              ${book.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}