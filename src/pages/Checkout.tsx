import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsComplete(true);
    clearCart();
    toast.success("Order placed successfully!");
  };

  if (items.length === 0 && !isComplete) {
    navigate("/cart");
    return null;
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-16">
          <div className="container-wide text-center max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/20 mb-6">
              <CheckCircle className="h-12 w-12 text-accent" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your purchase. Your books will be on their way soon.
              We've sent a confirmation email with your order details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="gold" size="lg">
                <Link to="/books">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/">Go Home</Link>
              </Button>
            </div>
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
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Link>
          </div>

          <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div className="bg-card rounded-xl shadow-card p-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-card rounded-xl shadow-card p-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                    Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="New York" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="10001" required />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-card rounded-xl shadow-card p-6">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                    Payment Method
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" required />
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="gold" size="xl" className="w-full">
                  Place Order - ${cartTotal.toFixed(2)}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl shadow-card p-6 sticky top-28">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Qty: {item.quantity}
                        </p>
                        <p className="font-semibold text-foreground text-sm mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-foreground/80">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/80">
                    <span>Shipping</span>
                    <span className="text-accent">Free</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg text-foreground pt-2 border-t border-border">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
