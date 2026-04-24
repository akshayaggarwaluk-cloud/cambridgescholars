import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Minus, Plus, X, Info, ShoppingCart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { showCartNotification } from "@/components/cart/CartBanner";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

  // Snapshot of quantities at last "save" (initial load or after Update Cart)
  const [savedQuantities, setSavedQuantities] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    items.forEach((i) => {
      map[`${i.id}_${i.format}`] = i.quantity;
    });
    return map;
  });

  // When items are added/removed externally, refresh the baseline for new/removed keys
  useEffect(() => {
    setSavedQuantities((prev) => {
      const next: Record<string, number> = {};
      items.forEach((i) => {
        const key = `${i.id}_${i.format}`;
        next[key] = key in prev ? prev[key] : i.quantity;
      });
      return next;
    });
  }, [items.map((i) => `${i.id}_${i.format}`).join("|")]);

  const hasChanges = useMemo(
    () => items.some((i) => savedQuantities[`${i.id}_${i.format}`] !== i.quantity),
    [items, savedQuantities]
  );

  const handleUpdateCart = () => {
    const map: Record<string, number> = {};
    items.forEach((i) => {
      map[`${i.id}_${i.format}`] = i.quantity;
    });
    setSavedQuantities(map);
    showCartNotification("Cart updated.");
  };

  const formatIsbn = (isbn: string) => {
    const digits = isbn.replace(/[^0-9Xx]/g, "");
    if (digits.length === 13) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}-${digits.slice(12)}`;
    }
    if (digits.length === 10) {
      return `${digits.slice(0, 1)}-${digits.slice(1, 5)}-${digits.slice(5, 9)}-${digits.slice(9)}`;
    }
    return isbn;
  };

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
          <div className="container-wide py-12">
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

       <main className="pb-16 bg-white">
        <div className="container-wide py-12 bg-white">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_120px_180px_140px_60px] gap-6 pb-5 border-b border-border items-center">
            <div className="uppercase text-[#333333] font-baskerville tracking-wider text-sm font-semibold">Product</div>
            <div className="uppercase text-[#333333] font-baskerville tracking-wider text-sm font-semibold text-right">Price</div>
            <div className="uppercase text-[#333333] font-baskerville tracking-wider text-sm font-semibold text-center">Quantity</div>
            <div className="uppercase text-[#333333] font-baskerville tracking-wider text-sm font-semibold text-right">Total</div>
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
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-20 h-28 object-cover hover:opacity-80 transition-opacity"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </Link>
                  <div className="min-w-0">
                    <Link to={`/books/${item.id}`}>
                    <h3 className="font-sans transition-colors leading-snug text-base text-black font-light" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                        {item.title} - {formatLabel(item.format)}
                      </h3>
                    </Link>
                    {item.isbn && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <span className="font-semibold text-foreground">ISBN:</span> {formatIsbn(item.isbn)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="text-base text-[#ababab] text-left">
                  £{item.price.toFixed(2)}
                </div>

                {/* Quantity */}
                <div className="flex items-center border border-border w-fit mx-auto">
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
                <div className="text-base text-black font-light text-left">
                  £{(item.price * item.quantity).toFixed(2)}
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
          <div className="flex justify-end items-center gap-12 mt-10 pr-6">
            <span className="text-base text-muted-foreground">Total</span>
            <span className="text-foreground font-normal text-lg">
              £{cartTotal.toFixed(2)}
            </span>
          </div>

          <div className="border-t border-border mt-8"></div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-6 mt-8 pb-8 border-b border-border">
            <Button
              asChild
              variant="outline"
              className="rounded-none font-serif tracking-wider normal-case text-sm font-semibold px-8 py-4 border border-[#e5573e] text-[#e5573e] bg-transparent hover:bg-[#e5573e] hover:text-white self-start h-auto"
            >
              <Link to="/books" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                CONTINUE SHOPPING
              </Link>
            </Button>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <button
                onClick={handleUpdateCart}
                disabled={!hasChanges}
                className="bg-[#C75B2A] hover:bg-white text-white hover:text-[#C75B2A] border border-[#C75B2A] rounded-none uppercase font-serif tracking-wider normal-case text-sm px-10 py-4 transition-colors font-semibold disabled:bg-[#E89B7A] disabled:border-[#E89B7A] disabled:cursor-not-allowed disabled:hover:bg-[#E89B7A] disabled:hover:text-white"
              >
                UPDATE CART
              </button>
              <Button
                asChild
                className="rounded-none font-serif tracking-wider normal-case text-sm font-semibold px-10 py-4 h-auto bg-[#e5573e] text-white border border-[#e5573e] hover:bg-white hover:text-[#e5573e]"
              >
                <Link to="/checkout">PROCEED TO CHECKOUT</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
