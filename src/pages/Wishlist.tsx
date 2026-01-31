import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";

export default function Wishlist() {
  const { user } = useExternalAuth();
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: typeof wishlistItems[0]) => {
    addToCart({
      id: item.book_id,
      title: item.book_title,
      author: item.book_author,
      price: item.book_price,
      image: item.book_image || "/placeholder.svg",
      rating: 4.0,
      category: "General",
    }, "hardbook");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-16">
          <div className="container-wide text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Sign in to view wishlist
            </h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to access your saved books.
            </p>
            <Button asChild variant="gold" size="lg">
              <Link to="/auth">Sign In</Link>
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
        <div className="container-wide max-w-4xl">
          {/* Breadcrumb */}
          <div className="pb-4">
            <PageBreadcrumb currentPage="Wishlist" />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <Heart className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-4xl font-bold text-foreground">
              My Wishlist
            </h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-xl shadow-card">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Save books you love for later!
              </p>
              <Button asChild variant="gold">
                <Link to="/books">Browse Books</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 p-6 bg-card rounded-xl shadow-card"
                >
                  <Link to={`/books/${item.book_id}`}>
                    <img
                      src={item.book_image || "/placeholder.svg"}
                      alt={item.book_title}
                      className="w-24 h-36 object-cover rounded-lg hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/books/${item.book_id}`}>
                      <h3 className="font-serif text-xl font-semibold text-foreground hover:text-accent transition-colors">
                        {item.book_title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground mb-2">{item.book_author}</p>
                    <p className="text-2xl font-bold text-accent">
                      ${item.book_price.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Added {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="gold"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => removeFromWishlist(item.book_id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}