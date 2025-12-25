import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Book, useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  className?: string;
}

export function BookCard({ book, className }: BookCardProps) {
  const { addToCart } = useCart();

  return (
    <div
      className={cn(
        "group bg-card rounded-xl overflow-hidden shadow-card hover-lift",
        className
      )}
    >
      <Link to={`/books/${book.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {book.originalPrice && (
            <div className="absolute top-3 left-3 bg-accent text-primary text-xs font-bold px-2 py-1 rounded-md">
              Sale
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/books/${book.id}`}>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {book.category}
          </p>
          <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-accent transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
        </Link>

        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="text-sm font-medium text-foreground">{book.rating}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-foreground">
              ${book.price.toFixed(2)}
            </span>
            {book.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Button
            variant="gold"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              addToCart(book);
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
