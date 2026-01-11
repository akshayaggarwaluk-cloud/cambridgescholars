import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Book, useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <motion.div
      className={cn(
        "group relative bg-card rounded-2xl overflow-hidden transition-all duration-500",
        "border border-border/50 hover:border-accent/40",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -10,
        boxShadow: "0 25px 60px hsl(220 20% 20% / 0.15), 0 0 40px hsl(168 65% 35% / 0.08)"
      }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Wishlist Button */}
      <motion.button
        onClick={handleWishlistClick}
        className={cn(
          "absolute top-4 right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300",
          inWishlist 
            ? "bg-accent text-accent-foreground shadow-lg" 
            : "bg-card/95 backdrop-blur-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-border/50"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart className={cn("h-5 w-5 transition-transform", inWishlist && "fill-current")} />
      </motion.button>

      <Link to={`/books/${book.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <motion.img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          
          {/* Premium gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          {/* Action Buttons */}
          <div className="absolute bottom-5 left-5 right-5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-100 flex gap-2">
            <Button
              variant="gold"
              size="lg"
              className="flex-1 rounded-xl shadow-lg gap-2 font-semibold h-12 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault();
                addToCart(book);
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl bg-white/90 backdrop-blur-sm border-0 hover:bg-white"
              asChild
            >
              <Link to={`/books/${book.id}`} onClick={(e) => e.stopPropagation()}>
                <Eye className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </Link>

      <div className="p-6 relative">
        <Link to={`/books/${book.id}`} className="block space-y-3">
          {/* Category Tag */}
          <span className="inline-block text-xs font-semibold text-accent uppercase tracking-[0.15em] bg-accent/10 px-2 py-1 rounded">
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
              £{book.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}