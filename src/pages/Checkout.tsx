import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, ChevronUp } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import { toast } from "sonner";

type AddressData = {
  firstName: string;
  lastName: string;
  country: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
};

const emptyAddress: AddressData = {
  firstName: "",
  lastName: "",
  country: "United Kingdom",
  street1: "",
  street2: "",
  city: "",
  state: "",
  postcode: "",
  phone: "",
};

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "India",
  "Australia",
  "Canada",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Ireland",
  "New Zealand",
  "Singapore",
  "South Africa",
  "United Arab Emirates",
];

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <Label
      htmlFor={htmlFor}
      className="block text-[13px] font-semibold tracking-[0.18em] uppercase text-[#333333] mb-2"
    >
      {children}
      {required && <span className="text-[#C75B2A] ml-1">*</span>}
    </Label>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-baskerville text-[32px] leading-tight text-[#333333] mb-6">
      {children}
    </h2>
  );
}

function AddressFields({
  idPrefix,
  data,
  onChange,
  phoneRequired = true,
  showEmail = false,
  email,
  onEmailChange,
}: {
  idPrefix: string;
  data: AddressData;
  onChange: (next: AddressData) => void;
  phoneRequired?: boolean;
  showEmail?: boolean;
  email?: string;
  onEmailChange?: (v: string) => void;
}) {
  const set = <K extends keyof AddressData>(key: K, value: AddressData[K]) =>
    onChange({ ...data, [key]: value });

  const inputCls =
    "h-12 rounded-none border-[#d8d6cd] bg-white focus-visible:ring-0 focus-visible:border-[#C75B2A] text-base text-[#333333]";

  return (
    <div className="space-y-6">
      <div>
        <FieldLabel htmlFor={`${idPrefix}-firstName`} required>First Name</FieldLabel>
        <Input id={`${idPrefix}-firstName`} className={inputCls} value={data.firstName} onChange={(e) => set("firstName", e.target.value)} required />
      </div>
      <div>
        <FieldLabel htmlFor={`${idPrefix}-lastName`} required>Last Name</FieldLabel>
        <Input id={`${idPrefix}-lastName`} className={inputCls} value={data.lastName} onChange={(e) => set("lastName", e.target.value)} required />
      </div>
      <div>
        <FieldLabel htmlFor={`${idPrefix}-country`} required>Country / Region</FieldLabel>
        <Select value={data.country} onValueChange={(v) => set("country", v)}>
          <SelectTrigger id={`${idPrefix}-country`} className={inputCls}>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <FieldLabel htmlFor={`${idPrefix}-street1`} required>Street Address</FieldLabel>
        <Input id={`${idPrefix}-street1`} className={`${inputCls} mb-3`} placeholder="House number and street name" value={data.street1} onChange={(e) => set("street1", e.target.value)} required />
        <Input id={`${idPrefix}-street2`} className={inputCls} placeholder="Apartment, suite, unit, etc. (optional)" value={data.street2} onChange={(e) => set("street2", e.target.value)} />
      </div>
      <div>
        <FieldLabel htmlFor={`${idPrefix}-city`} required>Town / City</FieldLabel>
        <Input id={`${idPrefix}-city`} className={inputCls} value={data.city} onChange={(e) => set("city", e.target.value)} required />
      </div>
      <div>
        <FieldLabel htmlFor={`${idPrefix}-state`} required>State / County</FieldLabel>
        <Input id={`${idPrefix}-state`} className={inputCls} placeholder="Select an option..." value={data.state} onChange={(e) => set("state", e.target.value)} required />
      </div>
      <div>
        <FieldLabel htmlFor={`${idPrefix}-postcode`} required>Postcode / ZIP</FieldLabel>
        <Input id={`${idPrefix}-postcode`} className={inputCls} value={data.postcode} onChange={(e) => set("postcode", e.target.value)} required />
      </div>
      <div>
        <FieldLabel htmlFor={`${idPrefix}-phone`} required={phoneRequired}>
          {phoneRequired ? "Phone" : "Phone (optional)"}
        </FieldLabel>
        <Input id={`${idPrefix}-phone`} type="tel" className={inputCls} value={data.phone} onChange={(e) => set("phone", e.target.value)} required={phoneRequired} />
      </div>
      {showEmail && (
        <div>
          <FieldLabel htmlFor={`${idPrefix}-email`} required>Email Address</FieldLabel>
          <Input id={`${idPrefix}-email`} type="email" className={inputCls} value={email || ""} onChange={(e) => onEmailChange?.(e.target.value)} required />
        </div>
      )}
    </div>
  );
}

export default function Checkout() {
  const { items, cartTotal, couponCode, discount, applyCoupon } = useCart();
  const { user } = useExternalAuth();
  const navigate = useNavigate();

  const [isComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showCoupon, setShowCoupon] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  const [shipping, setShipping] = useState<AddressData>({
    ...emptyAddress,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  const [useShippingForBilling, setUseShippingForBilling] = useState(false);
  const [billing, setBilling] = useState<AddressData>(emptyAddress);

  const [email, setEmail] = useState(user?.email || "");
  const [orderNotes, setOrderNotes] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items],
  );
  const shippingCost = items.length > 0 ? 19.5 : 0;
  const total = (cartTotal || subtotal) + shippingCost;

  if (items.length === 0 && !isComplete) {
    navigate("/cart");
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-16">
          <div className="container-wide text-center max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/20 mb-6">
              <AlertCircle className="h-12 w-12 text-accent" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
              Sign In Required
            </h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to complete your checkout and save your order history.
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
            </p>
            <Button asChild variant="gold" size="lg">
              <Link to="/orders">View Orders</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      await applyCoupon(couponInput.trim());
      setCouponInput("");
    } catch {
      /* toast handled by context */
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.info("Online checkout is coming soon. Please contact us to place an order.");
      setLoading(false);
    }, 400);
  };

  const moneyGBP = (n: number) =>
    `£${n.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page banner */}
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">
            Checkout
          </h1>
          <PageBreadcrumb items={[{ label: "Bookshop", href: "/cart" }]} currentPage="Checkout" />
        </div>
      </div>

      <main className="bg-white pb-20">
        <div className="container-wide pt-10">
          {/* Coupon bar */}
          <div className="mb-10">
            <p className="text-[15px] text-[#333333]">
              Have a coupon?{" "}
              <button
                type="button"
                onClick={() => setShowCoupon((s) => !s)}
                className="font-semibold text-[#333333] hover:text-[#C75B2A] underline-offset-2 hover:underline"
              >
                Click here to enter your code
              </button>
            </p>
            {showCoupon && (
              <div className="mt-4 flex flex-col sm:flex-row gap-3 max-w-xl">
                <Input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code"
                  className="h-12 rounded-none border-[#d8d6cd] bg-white focus-visible:ring-0 focus-visible:border-[#C75B2A]"
                />
                <Button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="h-12 rounded-none uppercase tracking-[0.2em] bg-[#C75B2A] hover:bg-[#a84a22] text-white"
                >
                  Apply Coupon
                </Button>
              </div>
            )}
            {couponCode && (
              <p className="mt-3 text-sm text-[#0a7a3b]">
                Coupon <strong>{couponCode}</strong> applied
                {discount ? ` (−${moneyGBP(discount)})` : ""}.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-x-12 xl:gap-x-16 gap-y-10">
            {/* LEFT — Shipping + Billing */}
            <div>
              <SectionHeading>Shipping details</SectionHeading>
              <AddressFields
                idPrefix="ship"
                data={shipping}
                onChange={setShipping}
                phoneRequired
              />

              {/* Use shipping as billing toggle */}
              <div className="mt-10 flex items-center gap-3">
                <Checkbox
                  id="use-shipping"
                  checked={useShippingForBilling}
                  onCheckedChange={(v) => setUseShippingForBilling(Boolean(v))}
                  className="rounded-none border-[#333333] data-[state=checked]:bg-[#C75B2A] data-[state=checked]:border-[#C75B2A]"
                />
                <Label
                  htmlFor="use-shipping"
                  className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#333333] cursor-pointer"
                >
                  Use shipping address as billing address
                </Label>
              </div>

              {/* Billing details */}
              {!useShippingForBilling && (
                <div className="mt-12">
                  <SectionHeading>Billing details</SectionHeading>
                  <AddressFields
                    idPrefix="bill"
                    data={billing}
                    onChange={setBilling}
                    phoneRequired={false}
                    showEmail
                    email={email}
                    onEmailChange={setEmail}
                  />
                </div>
              )}

              {/* Email + order notes (when using shipping as billing, still need email) */}
              {useShippingForBilling && (
                <div className="mt-10 space-y-6">
                  <div>
                    <FieldLabel htmlFor="contact-email" required>Email Address</FieldLabel>
                    <Input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-none border-[#d8d6cd] bg-white focus-visible:ring-0 focus-visible:border-[#C75B2A]"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="mt-8">
                <FieldLabel htmlFor="order-notes">Order Notes (optional)</FieldLabel>
                <Textarea
                  id="order-notes"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={5}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  className="rounded-none border-[#d8d6cd] bg-white focus-visible:ring-0 focus-visible:border-[#C75B2A] text-base"
                />
              </div>
            </div>

            {/* RIGHT — Order summary */}
            <aside>
              <div className="md:sticky md:top-28">
                <SectionHeading>Your order</SectionHeading>

                <div className="border-t border-[#e3e1d8]">
                  {items.map((item) => (
                    <div
                      key={`${item.id}_${item.format}`}
                      className="flex items-start justify-between py-4 border-b border-[#e3e1d8] gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] text-[#333333] leading-snug">
                          <span className="text-[#7a7a7a]">{item.title}</span>
                          {" — "}
                          <span>
                            {item.format === "ebook"
                              ? "Ebook"
                              : item.format === "paperback"
                              ? "Paperback"
                              : "Hardback"}
                          </span>
                          <span className="text-[#7a7a7a]"> × </span>
                          <strong>{item.quantity}</strong>
                        </p>
                        {item.isbn && (
                          <p className="text-[13px] text-[#333333] mt-1">
                            <strong>ISBN:</strong> {item.isbn}
                          </p>
                        )}
                      </div>
                      <div className="text-[15px] text-[#7a7a7a] whitespace-nowrap">
                        {moneyGBP(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between py-4 border-b border-[#e3e1d8]">
                    <span className="text-[15px] text-[#333333]">Subtotal</span>
                    <span className="text-[15px] text-[#333333]">{moneyGBP(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-[#e3e1d8]">
                    <span className="text-[15px] text-[#333333]">Shipping</span>
                    <span className="text-[15px] text-[#333333]">{moneyGBP(shippingCost)}</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-[#e3e1d8]">
                    <span className="text-[15px] text-[#333333]">Delivery Method</span>
                    <span className="text-[15px] font-semibold text-[#333333]">Standard Post</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-[#e3e1d8]">
                    <span className="text-[15px] text-[#333333]">Delivery Time</span>
                    <span className="text-[15px] font-semibold text-[#333333]">4–5 weeks</span>
                  </div>
                  <div className="flex items-center justify-between py-5">
                    <span className="text-[18px] text-[#333333]">Total</span>
                    <span className="text-[22px] font-semibold text-[#C75B2A]">
                      {moneyGBP(total)}
                    </span>
                  </div>
                </div>

                {/* Payment methods */}
                <div className="mt-6 border-t border-[#e3e1d8] pt-6 space-y-4">
                  {/* Card */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className="flex items-center gap-3 w-full"
                    >
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 border ${
                          paymentMethod === "card" ? "border-[#C75B2A]" : "border-[#999]"
                        }`}
                      >
                        {paymentMethod === "card" && (
                          <span className="block w-3 h-3 bg-[#C75B2A]" />
                        )}
                      </span>
                      <span className="text-[14px] font-semibold text-[#333333]">Credit/Debit Card</span>
                      <span className="ml-auto flex items-center gap-1.5">
                        <span className="px-2 py-1 text-[10px] font-bold bg-[#eb001b] text-white rounded-sm">MC</span>
                        <span className="px-2 py-1 text-[10px] font-bold bg-[#1a1f71] text-white rounded-sm">VISA</span>
                        <span className="px-2 py-1 text-[10px] font-bold bg-[#231f20] text-white rounded-sm">DISC</span>
                        <span className="px-2 py-1 text-[10px] font-bold bg-[#006fcf] text-white rounded-sm">AMEX</span>
                      </span>
                    </button>

                    {paymentMethod === "card" && (
                      <div className="mt-4 bg-[#f4f3ec] p-5 space-y-4">
                        <p className="text-[13px] text-[#666]">
                          Pay securely using your credit card.
                        </p>
                        <div>
                          <FieldLabel htmlFor="card-number" required>Card Number</FieldLabel>
                          <Input
                            id="card-number"
                            value={card.number}
                            onChange={(e) => setCard({ ...card, number: e.target.value })}
                            placeholder="•••• •••• •••• ••••"
                            className="h-12 rounded-none border-[#d8d6cd] bg-white focus-visible:ring-0 focus-visible:border-[#C75B2A]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <FieldLabel htmlFor="card-expiry" required>Expiry (MM/YY)</FieldLabel>
                            <Input
                              id="card-expiry"
                              value={card.expiry}
                              onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                              placeholder="MM / YY"
                              className="h-12 rounded-none border-[#d8d6cd] bg-white focus-visible:ring-0 focus-visible:border-[#C75B2A]"
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="card-cvc" required>CVC</FieldLabel>
                            <Input
                              id="card-cvc"
                              value={card.cvc}
                              onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                              placeholder="CVC"
                              className="h-12 rounded-none border-[#d8d6cd] bg-white focus-visible:ring-0 focus-visible:border-[#C75B2A]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PayPal */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className="flex items-center gap-3 w-full"
                  >
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 border ${
                        paymentMethod === "paypal" ? "border-[#C75B2A]" : "border-[#999]"
                      }`}
                    >
                      {paymentMethod === "paypal" && (
                        <span className="block w-3 h-3 bg-[#C75B2A]" />
                      )}
                    </span>
                    <span className="text-[14px] font-semibold text-[#003087]">PayPal</span>
                    <span className="ml-auto flex items-center gap-1.5">
                      <span className="px-2 py-1 text-[10px] font-bold bg-[#1a1f71] text-white rounded-sm">VISA</span>
                      <span className="px-2 py-1 text-[10px] font-bold bg-[#eb001b] text-white rounded-sm">MC</span>
                      <span className="px-2 py-1 text-[10px] font-bold bg-[#006fcf] text-white rounded-sm">AMEX</span>
                      <span className="px-2 py-1 text-[10px] font-bold bg-[#231f20] text-white rounded-sm">DISC</span>
                    </span>
                  </button>
                </div>

                <p className="text-[13px] text-[#555] leading-relaxed mt-6">
                  Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{" "}
                  <Link to="/privacy-policy" className="text-[#C75B2A] hover:underline">
                    privacy policy
                  </Link>
                  .
                </p>

                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-6 h-14 px-10 rounded-none uppercase tracking-[0.22em] text-[14px] font-semibold bg-[#C75B2A] hover:bg-[#a84a22] text-white"
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </aside>
          </form>
        </div>

        {/* Back-to-top floating button */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-40 h-12 w-12 bg-white border border-[#d8d6cd] shadow-md flex items-center justify-center hover:bg-[#f4f3ec]"
        >
          <ChevronUp className="h-5 w-5 text-[#333]" />
        </button>
      </main>

      <Footer />
    </div>
  );
}