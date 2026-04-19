import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Loader2, X, Check, Facebook, Twitter, Mail } from "lucide-react";
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

      <div className="bg-[#f4f3ec] pt-28 sm:pt-32 pb-10 sm:pb-14 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-4xl sm:text-5xl font-serif text-gray-800">My Wishlist</h1>
          <PageBreadcrumb currentPage="Wishlist" />
        </div>
      </div>

      <main className="pb-16">
        <div className="container-wide max-w-7xl py-12 px-6 md:px-16">

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : wishlistItems.length === 0 ? (
            <div>
              {/* Table header */}
              <div className="grid grid-cols-3 gap-4 pb-6 border-b border-border">
                <div className="text-sm font-semibold tracking-wider uppercase text-foreground">Product</div>
                <div className="text-sm font-semibold tracking-wider uppercase text-foreground">Price</div>
                <div className="text-sm font-semibold tracking-wider uppercase text-foreground">Stock Status</div>
              </div>
              {/* Empty message box */}
              <div className="mt-8 border border-border px-8 py-10">
                <p className="text-base text-foreground">No products added to the wishlist</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Table header */}
              <div className="grid grid-cols-[1fr_120px_140px_220px] gap-4 pb-6 border-b border-border items-center">
                <div className="text-sm font-semibold tracking-wider uppercase text-foreground">Product</div>
                <div className="text-sm font-semibold tracking-wider uppercase text-foreground">Price</div>
                <div className="text-sm font-semibold tracking-wider uppercase text-foreground">Stock Status</div>
                <div></div>
              </div>

              {/* Items */}
              <div className="mt-6 space-y-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_120px_140px_220px] gap-4 items-center border border-border px-6 py-5"
                  >
                    {/* Product */}
                    <div className="flex items-center gap-5 min-w-0">
                      <Link to={`/books/${item.book_id}`} className="shrink-0">
                        <img
                          src={item.book_image || "/placeholder.svg"}
                          alt={item.book_title}
                          className="w-20 h-28 object-cover hover:opacity-80 transition-opacity"
                        />
                      </Link>
                      <Link to={`/books/${item.book_id}`} className="min-w-0">
                        <h3 className="font-serif text-lg text-foreground hover:text-accent transition-colors leading-snug">
                          {item.book_title}
                        </h3>
                      </Link>
                    </div>

                    {/* Price */}
                    <div className="text-base text-foreground">
                      ${item.book_price.toFixed(2)}
                    </div>

                    {/* Stock */}
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" strokeWidth={3} />
                      <span className="text-base text-foreground">In Stock</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-[#C75B2A] hover:bg-[#a84a22] text-white text-sm font-semibold tracking-wider uppercase px-4 py-3 rounded-none transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.book_id)}
                        aria-label="Remove from wishlist"
                        className="w-10 h-10 border border-border flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
                      >
                        <X className="h-4 w-4 text-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Share on */}
              <div className="mt-12">
                <h3 className="font-serif text-2xl text-foreground mb-4">Share on:</h3>
                <div className="flex items-center gap-5">
                  <a href="#" aria-label="Share on Facebook" className="text-muted-foreground hover:text-accent transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" aria-label="Share on X" className="text-muted-foreground hover:text-accent transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" aria-label="Share via Email" className="text-muted-foreground hover:text-accent transition-colors">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}