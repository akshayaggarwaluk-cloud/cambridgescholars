import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { BookOpen, Minus, Plus, X, Info, ShoppingCart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem, type BookFormat } from "@/contexts/CartContext";
import { showCartNotification } from "@/components/cart/CartBanner";

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    addToCart,
    cartTotal,
    cartSubtotal,
    discount,
  } = useCart();

  // Draft quantities (local edits, only committed when UPDATE CART is pressed).
  const keyOf = (id: string, format: string) => `${id}_${format}`;
  const [draftQuantities, setDraftQuantities] = useState<Record<string, number>>({});

  // Re-sync draft baseline when the cart changes externally (item added/removed,
  // or quantities saved). Preserves any in-progress edits for items still present.
  useEffect(() => {
    setDraftQuantities((prev) => {
      const next: Record<string, number> = {};
      items.forEach((i) => {
        const k = keyOf(i.id, i.format);
        next[k] = k in prev ? prev[k] : i.quantity;
      });
      return next;
    });
  }, [items]);

  const getQty = (item: CartItem) =>
    draftQuantities[keyOf(item.id, item.format)] ?? item.quantity;

  const setQty = (item: CartItem, qty: number) => {
    if (qty < 1) return;
    setDraftQuantities((prev) => ({ ...prev, [keyOf(item.id, item.format)]: qty }));
  };

  const hasChanges = useMemo(
    () => items.some((i) => (draftQuantities[keyOf(i.id, i.format)] ?? i.quantity) !== i.quantity),
    [items, draftQuantities],
  );

  const handleUpdateCart = async () => {
    const changed = items.filter(
      (i) => (draftQuantities[keyOf(i.id, i.format)] ?? i.quantity) !== i.quantity,
    );
    await Promise.all(
      changed.map((i) =>
        updateQuantity(i.id, i.format, draftQuantities[keyOf(i.id, i.format)]),
      ),
    );
    showCartNotification("Cart updated.");
  };

  const handleRemoveItem = (item: CartItem) => {
    const undoEvent = `cart:undo-remove:${item.id}_${item.format}_${Date.now()}`;
    const onUndo = () => {
      window.removeEventListener(undoEvent, onUndo);
      void addToCart(item, item.format as BookFormat);
    };
    window.addEventListener(undoEvent, onUndo, { once: true });
    removeFromCart(item.id, item.format);
    const cleanTitle = item.title.split(":")[0].trim();
    showCartNotification(
      `&ldquo;${cleanTitle}&rdquo; removed.`,
      { variant: "removed", undoLabel: "Undo?", undoEvent },
    );
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
      <div className="min-h-screen bg-white">
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
              <Link to="/product">Return to shop</Link>
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const formatLabel = (f: string) =>
    f === "ebook" ? "Ebook" : f === "paperback" ? "Paperback" : "Hardback";

  const CartCover = ({ item }: { item: CartItem }) => {
    const [hasFailed, setHasFailed] = useState(false);
    const showImage = Boolean(item.image && !hasFailed);
    const showSkeleton = Boolean(item.coverImageLoading && !showImage);

    if (showImage) {
      return (
        <img
          src={item.image}
          alt={item.title}
          className="w-20 h-28 object-cover hover:opacity-80 transition-opacity"
          onError={() => setHasFailed(true)}
        />
      );
    }

    return (
      <div
        className={`w-20 h-28 bg-[#F4F3EC] border border-[#D9D6C8] flex items-center justify-center ${showSkeleton ? "animate-pulse" : ""}`}
        aria-label={`${item.title} cover unavailable`}
      >
        <BookOpen className="h-6 w-6 text-[#777777]" aria-hidden="true" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Cart</h1>
          <PageBreadcrumb currentPage="Cart" />
        </div>
      </div>

       <main className="pb-16 bg-white">
        <div className="container-wide py-8 md:py-12 bg-white">
          {/* Table header — desktop only */}
          <div className="hidden md:grid grid-cols-[1fr_120px_180px_140px_60px] gap-6 pb-5 items-center">
            <div className="uppercase text-[#333333] tracking-wider text-sm" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 800 }}>Product</div>
            <div className="uppercase text-[#333333] tracking-wider text-sm text-center relative -left-5" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 800 }}>Price</div>
            <div className="uppercase text-[#333333] tracking-wider text-sm text-center relative -left-5" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 800 }}>Quantity</div>
            <div className="uppercase text-[#333333] tracking-wider text-sm text-center relative -left-5" style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 800 }}>Total</div>
            <div></div>
          </div>

          {/* Items */}
          <div className="border border-black">
            {items.map((item, idx) => (
              <div
                key={`${item.id}_${item.format}`}
                className={`px-4 py-5 md:px-6 md:py-6 md:grid md:grid-cols-[1fr_120px_180px_140px_60px] md:gap-6 md:items-center ${idx > 0 ? "border-t border-black" : ""}`}
              >
                {/* Product */}
                <div className="flex items-start gap-4 md:items-center md:gap-5 min-w-0">
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <CartCover item={item} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <Link to={`/product/${item.id}`} className="min-w-0 flex-1">
                        <h3
                          className="transition-colors leading-snug text-[15px] text-[#333333] font-normal break-words"
                          style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                        >
                          {item.title.split(":")[0].trim()} - {formatLabel(item.format)}
                        </h3>
                      </Link>
                      {/* Mobile remove */}
                      <button
                        onClick={() => handleRemoveItem(item)}
                        aria-label="Remove item"
                        className="md:hidden w-8 h-8 border border-black flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
                      >
                        <X className="h-3.5 w-3.5 text-foreground" />
                      </button>
                    </div>
                    {item.isbn && (
                      <p
                        className="text-[13px] md:text-[15px] text-[#333333] mt-2 break-all"
                        style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                      >
                        <span className="font-bold">ISBN:</span> {formatIsbn(item.isbn)}
                      </p>
                    )}
                    {/* Mobile price/qty/total stacked under title */}
                    <div className="md:hidden mt-3 flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center border border-black">
                        <button
                          onClick={() => setQty(item, getQty(item) - 1)}
                          aria-label="Decrease quantity"
                          className="w-9 h-9 flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-10 text-center text-foreground text-sm">{getQty(item)}</span>
                        <button
                          onClick={() => setQty(item, getQty(item) + 1)}
                          aria-label="Increase quantity"
                          className="w-9 h-9 flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#7E7E7E] uppercase tracking-wider">Total</div>
                        <div className="text-base text-black font-medium">
                          £{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price (desktop) */}
                <div className="hidden md:block text-base text-[#ababab] text-center">
                  £{item.price.toFixed(2)}
                </div>

                {/* Quantity (desktop) */}
                <div className="hidden md:flex items-center border border-black w-fit mx-auto">
                  <button
                    onClick={() => setQty(item, getQty(item) - 1)}
                    aria-label="Decrease quantity"
                    className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-12 text-center text-foreground">{getQty(item)}</span>
                  <button
                    onClick={() => setQty(item, getQty(item) + 1)}
                    aria-label="Increase quantity"
                    className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Total (desktop) */}
                <div className="hidden md:block text-base text-black font-light text-center">
                  £{(item.price * item.quantity).toFixed(2)}
                </div>

                {/* Remove (desktop) */}
                <button
                  onClick={() => handleRemoveItem(item)}
                  aria-label="Remove item"
                  className="hidden md:flex w-10 h-10 border border-black items-center justify-center hover:bg-secondary transition-colors justify-self-end"
                >
                  <X className="h-4 w-4 text-foreground" />
                </button>
              </div>
            ))}
          </div>

          {/* Totals — reflects committed cart; updates after UPDATE CART */}
          <div className="mt-8 md:mt-10 md:pr-6 md:ml-auto md:max-w-md space-y-3">
            <div className="flex justify-between items-center pt-3">
              <span className="text-base text-foreground">Total</span>
              <span className="text-foreground font-normal text-lg">
                £{cartSubtotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="border-t border-black mt-8"></div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-6 mt-8 pb-8 border-b border-black">
            <Button
              asChild
              variant="outline"
              className="rounded-none tracking-wider normal-case text-sm px-8 py-4 border border-[#e5573e] text-[#e5573e] bg-transparent hover:bg-[#e5573e] hover:text-white self-stretch md:self-start h-auto justify-center"
              style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 700 }}
            >
              <Link to="/product" className="flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                CONTINUE SHOPPING
              </Link>
            </Button>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center">
              <button
                onClick={handleUpdateCart}
                disabled={!hasChanges}
                className="bg-[#C75B2A] hover:bg-white text-white hover:text-[#C75B2A] border border-[#C75B2A] rounded-none uppercase tracking-wider normal-case text-sm px-10 py-4 transition-colors disabled:bg-[#E89B7A] disabled:border-[#E89B7A] disabled:cursor-not-allowed disabled:hover:bg-[#E89B7A] disabled:hover:text-white w-full md:w-auto"
                style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 700 }}
              >
                UPDATE CART
              </button>
              <Button
                asChild
                className="rounded-none tracking-wider normal-case text-sm px-10 py-4 h-auto bg-[#C75B2A] text-white border border-[#C75B2A] hover:bg-white hover:text-[#C75B2A] w-full md:w-auto justify-center"
                style={{ fontFamily: '"Nunito Sans", sans-serif', fontWeight: 700 }}
              >
                <Link to="/checkout" className="text-center">PROCEED TO CHECKOUT</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
