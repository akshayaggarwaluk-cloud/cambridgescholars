import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, Tablet, Book } from "lucide-react";
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
        <main className="pt-32 pb-16">
          <div className="container-wide text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like you haven't added any books yet. Explore our collection
              and find your next read.
            </p>
            <Button asChild variant="gold" size="lg">
              <Link to="/books">Browse Books</Link>
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
        <div className="container-wide">
          {/* Breadcrumb */}
          <div className="py-6">
            <PageBreadcrumb currentPage="Cart" />
          </div>

          <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
            Your Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.id}_${item.format}`}
                  className="flex gap-6 p-6 bg-card rounded-xl shadow-card"
                >
                  <Link
                    to={`/books/${item.id}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-32 object-cover rounded-lg"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/books/${item.id}`}>
                      <h3 className="font-serif text-lg font-semibold text-foreground hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-2">
                      {item.author}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="inline-flex items-center gap-1 text-xs text-accent font-medium">
                        {item.format === "ebook" ? (
                          <>
                            <Tablet className="h-3 w-3" />
                            eBook
                          </>
                        ) : (
                          <>
                            <Book className="h-3 w-3" />
                            Hardbook
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.format, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium text-foreground w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.format, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-serif text-lg font-bold text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.id, item.format)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl shadow-card p-6 sticky top-28">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-foreground/80">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/80">
                    <span>Shipping</span>
                    <span className="text-accent">Free</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between font-semibold text-lg text-foreground">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button asChild variant="gold" size="lg" className="w-full">
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>

                <p className="text-center text-muted-foreground text-sm mt-4">
                  Free shipping on all orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
