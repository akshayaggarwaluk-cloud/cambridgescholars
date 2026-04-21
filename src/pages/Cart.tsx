import { Link } from "react-router-dom";
import { Minus, Plus, X, Info, ShoppingCart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Cart</h1>
            <PageBreadcrumb currentPage="Cart" />
          </div>
        </div>

        <main className="pb-16">
          <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
            <div className="bg-[#5BAFA8] text-white px-6 py-5 flex items-center gap-3 mb-8">
              <Info className="h-5 w-5 flex-shrink-0" strokeWidth={2} />
              <span className="font-nav text-base">Your cart is currently empty.</span>
            </div>
            <Button
              asChild
              className="bg-[#C75B2A] hover:bg-[#a84a20] text-white rounded-none uppercase tracking-wider font-nav font-medium px-8 py-6 text-sm"
            >
              <Link to="/books">Return to shop</Link>
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const formatLabel = (f: string) =>
    f === "ebook" ? "Ebook" : f === "paperback" ? "Paperback" : "Hardback";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Cart</h1>
          <PageBreadcrumb currentPage="Cart" />
        </div>
      </div>

      <main className="pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 bg-white">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_120px_180px_140px_60px] gap-6 pb-5 border-b border-border items-center">
            <div className="text-sm font-semibold tracking-wider uppercase text-foreground">Product</div>
            <div className="text-sm font-semibold tracking-wider uppercase text-foreground">Price</div>
            <div className="text-sm font-semibold tracking-wider uppercase text-foreground">Quantity</div>
            <div className="text-sm font-semibold tracking-wider uppercase text-foreground">Total</div>
            <div></div>
          </div>

          {/* Items */}
          <div className="border-x border-b border-border">
            {items.map((item) => (
              <div
                key={`${item.id}_${item.format}`}
                className="grid grid-cols-[1fr_120px_180px_140px_60px] gap-6 items-center px-6 py-6 border-t border-border"
              >
                {/* Product */}
                <div className="flex items-center gap-5 min-w-0">
                  <Link to={`/books/${item.id}`} className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-28 object-cover hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="min-w-0">
                    <Link to={`/books/${item.id}`}>
                      <h3 className="font-serif transition-colors leading-snug text-base text-[#6e6e6e]">
                        {item.title} - {formatLabel(item.format)}
                      </h3>
                    </Link>
                    {item.isbn && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <span className="font-semibold text-foreground">ISBN:</span> {item.isbn}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="text-base text-muted-foreground">
                  ${item.price.toFixed(2)}
                </div>

                {/* Quantity */}
                <div className="flex items-center border border-border w-fit">
                  <button
                    onClick={() => updateQuantity(item.id, item.format, item.quantity - 1)}
                    aria-label="Decrease quantity"
                    className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-12 text-center text-foreground">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.format, item.quantity + 1)}
                    aria-label="Increase quantity"
                    className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Total */}
                <div className="text-base text-[#6e6e6e]">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id, item.format)}
                  aria-label="Remove item"
                  className="w-10 h-10 border border-border flex items-center justify-center hover:bg-secondary transition-colors justify-self-end"
                >
                  <X className="h-4 w-4 text-foreground" />
                </button>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-end items-center gap-12 mt-8 pr-6">
            <span className="text-base text-muted-foreground">Total</span>
            <span className="text-xl font-semibold text-foreground">
              ${cartTotal.toFixed(2)}
            </span>
          </div>

          <div className="border-t border-border mt-6"></div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-6 mt-8">
            <Button
              asChild
              variant="outline"
              className="rounded-none uppercase tracking-wider font-nav font-medium px-8 py-6 text-sm border-border hover:bg-secondary self-start"
            >
              <Link to="/books" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>

            <div className="flex flex-col gap-4 sm:items-end">
              <button
                onClick={() => window.location.reload()}
                className="bg-[#E89B7A] hover:bg-[#d88863] text-white rounded-none uppercase tracking-wider font-nav font-medium px-10 py-4 text-sm transition-colors"
              >
                Update Cart
              </button>
              <Button
                asChild
                className="bg-[#C75B2A] hover:bg-[#a84a20] text-white rounded-none uppercase tracking-wider font-nav font-medium px-10 py-4 text-sm h-auto"
              >
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
