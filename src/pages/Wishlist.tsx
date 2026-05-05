import { Link } from "react-router-dom";
import { ShoppingCart, Loader2, X, Check, Facebook, Twitter, Mail } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { useWishlist } from "@/contexts/WishlistContext";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Wishlist</h1>
          <PageBreadcrumb currentPage="Wishlist" />
        </div>
      </div>

      <main className="pb-16">
        <div className="container-wide max-w-7xl py-12 px-4 sm:px-6 md:px-16 bg-white">

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
              {/* Table header - desktop only */}
              <div className="hidden lg:grid grid-cols-[1fr_120px_140px_220px] gap-4 pb-6 border-b border-border items-center">
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
                    className="flex flex-col lg:grid lg:grid-cols-[1fr_120px_140px_220px] gap-4 lg:items-center border border-border p-4 sm:p-5 lg:px-6 lg:py-5"
                  >
                    {/* Product */}
                    <div className="flex items-start gap-4 sm:gap-5 min-w-0 relative">
                      <Link to={`/product/${item.book_id}`} className="shrink-0">
                        <img
                          src={item.book_image || "/placeholder.svg"}
                          alt={item.book_title}
                          className="w-16 h-24 sm:w-20 sm:h-28 object-cover hover:opacity-80 transition-opacity"
                        />
                      </Link>
                      <div className="flex-1 min-w-0 pr-10 lg:pr-0">
                        <Link to={`/product/${item.book_id}`} className="min-w-0">
                          <h3 className="transition-colors leading-snug text-[15px] text-[#6D6C6C] hover:text-[#C75B2A] break-words" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                            {item.book_title}
                          </h3>
                        </Link>
                        {/* Mobile-only price + stock under title */}
                        <div className="lg:hidden mt-2 space-y-1">
                          <div className="text-[14px] text-[#ABABAB]" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                            From £{item.book_price.toFixed(2)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" strokeWidth={3} />
                            <span className="text-[12.8px] text-[#333333]" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>In Stock</span>
                          </div>
                        </div>
                      </div>
                      {/* Mobile remove button - top right */}
                      <button
                        onClick={() => removeFromWishlist(item.book_id)}
                        aria-label="Remove from wishlist"
                        className="lg:hidden absolute top-0 right-0 w-8 h-8 border border-border flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
                      >
                        <X className="h-3.5 w-3.5 text-foreground" />
                      </button>
                    </div>

                    {/* Price - desktop */}
                    <div className="hidden lg:block text-[15px] text-[#ABABAB]" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>
                      From £{item.book_price.toFixed(2)}
                    </div>

                    {/* Stock - desktop */}
                    <div className="hidden lg:flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" strokeWidth={3} />
                      <span className="text-[12.8px] text-[#333333]" style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif' }}>In Stock</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 lg:justify-end">
                      <Link
                        to={`/product/${item.book_id}`}
                        className="flex-1 bg-[#E4573D] hover:bg-[#C75B2A] text-white text-[14px] font-bold uppercase rounded-none transition-colors flex items-center justify-center gap-2"
                        style={{ fontFamily: '"Nunito Sans", system-ui, sans-serif', padding: '13px 30px', fontWeight: 700 }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        View More
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(item.book_id)}
                        aria-label="Remove from wishlist"
                        className="hidden lg:flex w-10 h-10 border border-border items-center justify-center hover:bg-secondary transition-colors shrink-0"
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