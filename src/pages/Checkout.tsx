import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Check } from "lucide-react";
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
import { checkoutPay, type CheckoutPayRequest } from "@/services/cartService";
import { getProfile } from "@/services/accountService";
import { buildAccountOrdersPath } from "@/utils/paymentRedirect";

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

// Map UI country names → ISO 3166-1 alpha-2 codes used by the cart API.
const COUNTRY_ISO: Record<string, string> = {
  "United Kingdom": "GB",
  "United States": "US",
  "India": "IN",
  "Australia": "AU",
  "Canada": "CA",
  "Germany": "DE",
  "France": "FR",
  "Italy": "IT",
  "Spain": "ES",
  "Netherlands": "NL",
  "Ireland": "IE",
  "New Zealand": "NZ",
  "Singapore": "SG",
  "South Africa": "ZA",
  "United Arab Emirates": "AE",
};

// Reverse map: ISO/upstream country value → UI label used by the <Select>.
const ISO_TO_COUNTRY: Record<string, string> = Object.fromEntries(
  Object.entries(COUNTRY_ISO).map(([name, iso]) => [iso, name]),
);
function normalizeCountry(value?: string | null): string | undefined {
  if (!value) return undefined;
  const v = value.trim();
  if (!v) return undefined;
  if (ISO_TO_COUNTRY[v.toUpperCase()]) return ISO_TO_COUNTRY[v.toUpperCase()];
  // Already a known full name?
  if (COUNTRY_ISO[v]) return v;
  // Loose match against names (case-insensitive)
  const hit = Object.keys(COUNTRY_ISO).find(
    (n) => n.toLowerCase() === v.toLowerCase(),
  );
  return hit;
}

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <Label
      htmlFor={htmlFor}
      className="block uppercase text-[#333333] mb-2"
      style={{
        fontFamily: '"Nunito Sans", sans-serif',
        fontSize: "14px",
        fontWeight: 700,
        letterSpacing: "0.05em",
        lineHeight: 1.4,
      }}
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
        <Input
          id={`${idPrefix}-phone`}
          type="tel"
          inputMode="tel"
          pattern="[0-9+\-\s()]*"
          maxLength={20}
          className={inputCls}
          value={data.phone}
          onChange={(e) => set("phone", e.target.value.replace(/[^0-9+\-\s()]/g, ""))}
          required={phoneRequired}
        />
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
  const {
    items,
    cartTotal,
    cartSubtotal,
    shipping: apiShipping,
    shippingRequiresQuote,
    deliveryEstimate,
    couponCode,
    discount,
    applyCoupon,
    removeCoupon,
    clearCart,
    setShippingCountry,
  } = useCart();
  const { user } = useExternalAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showCoupon, setShowCoupon] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Do not auto-apply a previously-saved coupon when entering checkout.
  // Clear any active coupon once on mount so users must re-enter it explicitly.
  useEffect(() => {
    if (couponCode) {
      void removeCoupon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [shipping, setShipping] = useState<AddressData>({
    ...emptyAddress,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  const [useShippingForBilling, setUseShippingForBilling] = useState(false);
  const [billing, setBilling] = useState<AddressData>(emptyAddress);

  const [email, setEmail] = useState(user?.email || "");
  const [orderNotes, setOrderNotes] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"card">("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [cardholder, setCardholder] = useState("");

  // Pre-fill shipping & billing addresses (and email/phone) from the
  // authenticated customer's saved profile. Falls back silently if the
  // request fails or the user hasn't saved any addresses yet.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const profile = await getProfile();
        if (cancelled) return;
        const ship = profile.shipping || {};
        const bill = profile.billing || {};
        const fallbackFirst = profile.first_name || user.firstName || "";
        const fallbackLast = profile.last_name || user.lastName || "";
        const fallbackPhone = profile.phone || "";

        setShipping((prev) => ({
          ...prev,
          firstName: ship.first_name || fallbackFirst || prev.firstName,
          lastName: ship.last_name || fallbackLast || prev.lastName,
          country: normalizeCountry(ship.country) || prev.country,
          street1: ship.address_1 || prev.street1,
          street2: ship.address_2 || prev.street2,
          city: ship.city || prev.city,
          state: ship.state || prev.state,
          postcode: ship.postcode || prev.postcode,
          phone: ship.phone || fallbackPhone || prev.phone,
        }));
        setBilling((prev) => ({
          ...prev,
          firstName: bill.first_name || fallbackFirst || prev.firstName,
          lastName: bill.last_name || fallbackLast || prev.lastName,
          country: normalizeCountry(bill.country) || prev.country,
          street1: bill.address_1 || prev.street1,
          street2: bill.address_2 || prev.street2,
          city: bill.city || prev.city,
          state: bill.state || prev.state,
          postcode: bill.postcode || prev.postcode,
          phone: bill.phone || fallbackPhone || prev.phone,
        }));
        if (!email) {
          setEmail(bill.email || profile.email || user.email || "");
        }
      } catch (e) {
        // Profile prefill is best-effort; never block checkout.
        console.warn("[checkout] profile prefill failed:", e);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const localSubtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items],
  );
  const subtotal = cartSubtotal || localSubtotal;
  // Ebook-only carts skip shipping entirely.
  const isEbookOnly = useMemo(
    () => items.length > 0 && items.every((it) => it.format === "ebook"),
    [items],
  );
  // Push the active country (shipping for physical orders, billing for
  // ebook-only) to the cart context so the API recalculates `shipping_gbp`.
  const activeCountryName = isEbookOnly ? billing.country : shipping.country;
  useEffect(() => {
    if (isEbookOnly) return; // no shipping recalculation needed
    const iso = COUNTRY_ISO[activeCountryName];
    if (iso) setShippingCountry(iso);
  }, [activeCountryName, isEbookOnly, setShippingCountry]);
  // Shipping comes straight from the API (`shipping_gbp` on /cart).
  const shippingCost = isEbookOnly ? 0 : apiShipping ?? 0;
  const total = cartTotal || subtotal + shippingCost - (discount ?? 0);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
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

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponBusy(true);
    setCouponError(null);
    try {
      await applyCoupon(couponInput.trim());
      setCouponInput("");
      setShowCoupon(false);
    } catch (e) {
      setCouponError(
        e instanceof Error && e.message
          ? e.message
          : "This coupon could not be applied to your cart.",
      );
    } finally {
      setCouponBusy(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponBusy(true);
    setCouponError(null);
    try {
      await removeCoupon();
    } finally {
      setCouponBusy(false);
    }
  };

  /**
   * Detect the Opayo `card_type` enum value from the card number's BIN.
   * The /checkout/pay endpoint requires this — it is NOT optional.
   */
  const detectCardType = (raw: string): "VISA" | "MC" | "AMEX" | "MAESTRO" | "DISCOVER" | "DC" => {
    const n = raw.replace(/\D/g, "");
    if (/^4/.test(n)) return "VISA";
    if (/^(5[1-5]|2[2-7])/.test(n)) return "MC";
    if (/^3[47]/.test(n)) return "AMEX";
    if (/^(50|56|57|58|6[0-9])/.test(n)) return "MAESTRO";
    if (/^(6011|65|64[4-9])/.test(n)) return "DISCOVER";
    if (/^(30|36|38|39)/.test(n)) return "DC";
    return "VISA";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim()) {
      toast.error("Please enter an email address.");
      return;
    }
    if (!card.number || !card.expiry || !card.cvc || !cardholder.trim()) {
      toast.error("Please complete all card details.");
      return;
    }

    setLoading(true);
    try {
      // Build the /checkout/pay payload — flat shape per CSP OpenAPI spec
      // (CheckoutPayRequest). Card details and a SINGLE billing address.
      const billingAddress: AddressData = isEbookOnly
        ? billing
        : useShippingForBilling
          ? shipping
          : billing;
      const cardNumberDigits = card.number.replace(/\D/g, "");
      const payload: CheckoutPayRequest = {
        card_holder: cardholder.trim(),
        card_number: cardNumberDigits,
        card_expiry: card.expiry.replace(/\D/g, "").slice(0, 4),
        card_cv2: card.cvc.replace(/\D/g, ""),
        card_type: detectCardType(cardNumberDigits),
        billing_first_name: billingAddress.firstName,
        billing_last_name: billingAddress.lastName,
        billing_address_1: billingAddress.street1,
        billing_city: billingAddress.city,
        billing_postcode: billingAddress.postcode,
        billing_country: COUNTRY_ISO[billingAddress.country] || "GB",
        customer_note: orderNotes.trim() || undefined,
      };

      // Submit the order. On 3DS we POST a form to the bank's ACS URL.
      const res = await checkoutPay(payload);

      if (res.status === "3ds_required") {
        const acsUrl = res.acs_url;
        if (!acsUrl) {
          throw new Error("3DS authentication data missing from response.");
        }

        // Determine 3DS version based on which fields the backend returned.
        // 3DS v2 (preferred): c_req + optional threeDSSessionData posted to ACS.
        // 3DS v1 (legacy): PaReq + MD + TermUrl posted to ACS.
        let fields: Record<string, string>;
        if (res.c_req) {
          fields = { creq: res.c_req };
          if (res.three_ds_session_data) {
            fields.threeDSSessionData = res.three_ds_session_data;
          }
        } else if (res.pa_req && res.md && res.term_url) {
          fields = {
            PaReq: res.pa_req,
            MD: res.md,
            TermUrl: res.term_url,
          };
        } else {
          throw new Error("3DS authentication data missing from response.");
        }

        const form = document.createElement("form");
        form.method = "POST";
        form.action = acsUrl;
        Object.entries(fields).forEach(([name, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = value;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        return; // page will navigate away
      }

      if (res.status === "success") {
        void clearCart();
        toast.success("Payment received. Thank you for your order!");
        navigate(buildAccountOrdersPath(res.order_id), { replace: true });
        return;
      }

      throw new Error(
        res.reason || res.message || "Payment was not authorised. Please try a different card.",
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Checkout failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const moneyGBP = (n: number) =>
    `£${n.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-white">
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
              <div className="mt-4 border border-[#d8d6cd] bg-white p-6">
                <Input
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    if (couponError) setCouponError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleApplyCoupon();
                    }
                  }}
                  placeholder="Coupon code"
                  aria-label="Coupon code"
                  className={`h-9 rounded-none border bg-white focus-visible:ring-0 focus-visible:border-[#C75B2A] ${
                    couponError ? "border-red-500" : "border-[#1f1f1f]"
                  }`}
                  aria-invalid={Boolean(couponError)}
                  aria-describedby={couponError ? "coupon-error" : undefined}
                />
                {couponError && (
                  <p
                    id="coupon-error"
                    role="alert"
                    className="mt-2 text-[13px] text-red-600 leading-snug"
                  >
                    {couponError}
                  </p>
                )}
                <Button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponBusy || !couponInput.trim()}
                  className="mt-5 h-12 px-8 rounded-none uppercase tracking-[0.2em] bg-[#C75B2A] hover:bg-[#a84a22] text-white font-semibold"
                >
                  {couponBusy ? "Applying..." : "Apply Coupon"}
                </Button>
              </div>
            )}
            {couponCode && (
              <div
                role="status"
                aria-live="polite"
                className="mt-4 flex items-center gap-3 bg-[#8fae3f] text-white px-6 py-4"
              >
                <Check className="h-5 w-5 shrink-0" aria-hidden="true" strokeWidth={3} />
                <span className="text-[16px] font-semibold">
                  Coupon code applied successfully.
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-0 gap-y-10">
            {/* LEFT — Shipping + Billing (ebook-only orders skip shipping) */}
            <div className="pr-10 xl:pr-16">
              {!isEbookOnly && (
                <>
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
                </>
              )}

              {/* Billing details: always shown for ebook-only; shown for physical orders only when not reusing shipping */}
              {(isEbookOnly || !useShippingForBilling) && (
                <div className={isEbookOnly ? "" : "mt-12"}>
                  <SectionHeading>Billing details</SectionHeading>
                  <AddressFields
                    idPrefix="bill"
                    data={billing}
                    onChange={setBilling}
                    phoneRequired={isEbookOnly}
                    showEmail
                    email={email}
                    onEmailChange={setEmail}
                  />
                </div>
              )}

              {/* Email field when reusing shipping as billing (physical orders only) */}
              {!isEbookOnly && useShippingForBilling && (
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
            <aside className="pl-10 xl:pl-16">
              <div>
                <SectionHeading>Your order</SectionHeading>

                <div className="border-t border-[#e3e1d8]">
                  {items.map((item) => (
                    <div
                      key={`${item.id}_${item.format}`}
                      className="py-4 border-b border-[#e3e1d8] space-y-1"
                    >
                      <p className="text-[15px] leading-snug text-[#696969]">
                        {item.title.split(":")[0].trim()}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[14px] text-[#7a7a7a]">
                          <span className="text-[#696969]">
                            {item.format === "ebook"
                              ? "Ebook"
                              : item.format === "paperback"
                              ? "Paperback"
                              : "Hardback"}
                          </span>
                          <span> × </span>
                          <strong className="text-[#333333]">{item.quantity}</strong>
                        </p>
                        <span className="text-[15px] text-[#7a7a7a] whitespace-nowrap">
                          {moneyGBP(item.price * item.quantity)}
                        </span>
                      </div>
                      {item.isbn && (
                        <p className="text-[13px] text-[#333333]">
                          <strong>ISBN:</strong> {item.isbn}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center justify-between py-4 border-b border-[#e3e1d8]">
                    <span className="text-[15px] text-[#696969]">Subtotal</span>
                    <span className="text-[15px] text-[#333333]">{moneyGBP(subtotal)}</span>
                  </div>
                  {!isEbookOnly && (
                    <>
                      <div className="flex items-center justify-between py-4 border-b border-[#e3e1d8]">
                        <span className="text-[15px] text-[#696969]">Shipping</span>
                        <span className="text-[15px] text-[#333333]">
                          {shippingRequiresQuote
                            ? "Quote required"
                            : moneyGBP(shippingCost)}
                        </span>
                      </div>
                      {deliveryEstimate && (
                        <div className="flex items-center justify-between py-4 border-b border-[#e3e1d8]">
                          <span className="text-[15px] text-[#696969]">Delivery method</span>
                          <span className="text-[15px] font-semibold text-[#333333]">Standard Post</span>
                        </div>
                      )}
                      {deliveryEstimate && (
                        <div className="flex items-center justify-between py-4 border-b border-[#e3e1d8]">
                          <span className="text-[15px] text-[#696969]">Delivery time</span>
                          <span className="text-[15px] text-[#333333]">{deliveryEstimate}</span>
                        </div>
                      )}
                    </>
                  )}
                  {couponCode && (
                    <div className="flex items-center justify-between py-4 border-b border-[#e3e1d8]">
                      <span className="text-[15px] text-[#C75B2A] font-semibold">
                        Coupon: {couponCode}
                      </span>
                      <span className="text-[15px] text-[#C75B2A] font-semibold">
                        −{moneyGBP(discount ?? 0)}{" "}
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          disabled={couponBusy}
                          className="ml-1 text-[#C75B2A] hover:underline font-semibold disabled:opacity-60"
                        >
                          [Remove]
                        </button>
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-5 border-b border-[#e3e1d8]">
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
                       <div className="mt-3 -mx-2 px-4 py-3 space-y-3 bg-[#dbd6e1]">
                        <p className="text-[12px] text-[#666]">
                          Pay securely using your credit card.
                        </p>
                        <div>
                          <FieldLabel htmlFor="card-name" required>Name on Card</FieldLabel>
                          <Input
                            id="card-name"
                            value={cardholder}
                            onChange={(e) => setCardholder(e.target.value)}
                            placeholder="As shown on your card"
                            autoComplete="cc-name"
                            className="h-9 rounded-none border-[#d8d6cd] bg-white focus-visible:ring-0 focus-visible:border-[#C75B2A]"
                          />
                        </div>
                        <div>
                          <FieldLabel htmlFor="card-number" required>Card Number</FieldLabel>
                          <Input
                            id="card-number"
                            value={card.number}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                              const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
                              setCard({ ...card, number: formatted });
                            }}
                            placeholder="•••• •••• •••• ••••"
                            autoComplete="cc-number"
                            inputMode="numeric"
                            maxLength={19}
                            className="h-9 rounded-none border-[#d8d6cd] bg-white focus-visible:ring-0 focus-visible:border-[#C75B2A]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <FieldLabel htmlFor="card-expiry" required>Expiry (MM/YY)</FieldLabel>
                            <Input
                              id="card-expiry"
                              value={card.expiry}
                              onChange={(e) => {
                                let digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                                if (digits.length >= 3) {
                                  digits = `${digits.slice(0, 2)}/${digits.slice(2)}`;
                                }
                                setCard({ ...card, expiry: digits });
                              }}
                              placeholder="MM / YY"
                              autoComplete="cc-exp"
                              inputMode="numeric"
                              maxLength={5}
                              className="h-9 rounded-none border-[#d8d6cd] bg-white focus-visible:ring-0 focus-visible:border-[#C75B2A]"
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="card-cvc" required>CVC</FieldLabel>
                            <Input
                              id="card-cvc"
                              value={card.cvc}
                              onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                              placeholder="CVC"
                              autoComplete="cc-csc"
                              inputMode="numeric"
                              maxLength={4}
                              className="h-9 rounded-none border-[#d8d6cd] bg-white focus-visible:ring-0 focus-visible:border-[#C75B2A]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

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
      </main>

      <Footer />
    </div>
  );
}