import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { getOrder, type OrderDetail } from "@/services/accountService";
import { checkoutPay, type CheckoutPayRequest, type OpayoCardType } from "@/services/cartService";
import { toast } from "sonner";
const ORANGE = "#E4573D";

function fmt(v?: number | null) {
  return `£${(Number(v) || 0).toFixed(2)}`;
}

function CardBadges() {
  return (
    <div className="flex items-center gap-2">
      {[
        { label: "MasterCard", bg: "#fff", color: "#000", border: true },
        { label: "VISA", bg: "#1a1f71", color: "#fff" },
        { label: "DISCOVER", bg: "#f68121", color: "#fff" },
        { label: "AMERICAN\nEXPRESS", bg: "#2557D6", color: "#fff" },
      ].map((c) => (
        <div
          key={c.label}
          className={`h-9 px-3 flex items-center justify-center text-[10px] font-bold leading-tight whitespace-pre text-center ${
            c.border ? "border border-[#e5e5e5]" : ""
          }`}
          style={{ background: c.bg, color: c.color, minWidth: 56 }}
        >
          {c.label}
        </div>
      ))}
    </div>
  );
}

export default function PayOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [method, setMethod] = useState<"card">("card");
  const [card, setCard] = useState({ holder: "", number: "", expiry: "", cvc: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const d = await getOrder(id);
        if (!cancelled) setDetail(d);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load order");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const subtotal = detail
    ? detail.items.reduce(
        (s, it) =>
          s + (Number(it.subtotal) || (Number(it.unit_price) || 0) * (Number(it.quantity) || 0)),
        0,
      )
    : 0;

  const detectCardType = (raw: string): OpayoCardType => {
    const n = raw.replace(/\D/g, "");
    if (/^4/.test(n)) return "VISA";
    if (/^(5[1-5]|2[2-7])/.test(n)) return "MC";
    if (/^3[47]/.test(n)) return "AMEX";
    if (/^(6011|65|64[4-9])/.test(n)) return "DISCOVER";
    if (/^(50|56|57|58|6[0-9])/.test(n)) return "MAESTRO";
    if (/^(30|36|38|39)/.test(n)) return "DC";
    return "VISA";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (method === "card") {
      if (!card.holder.trim()) {
        toast.error("Please enter the cardholder name");
        return;
      }
      if (!/^[\d\s]{12,23}$/.test(card.number.trim())) {
        toast.error("Please enter a valid card number");
        return;
      }
      if (!/^\d{2}\s*\/\s*\d{2}$/.test(card.expiry.trim())) {
        toast.error("Please enter expiry as MM/YY");
        return;
      }
      if (!/^\d{3,4}$/.test(card.cvc.trim())) {
        toast.error("Please enter a valid CVC");
        return;
      }
    }

    if (!detail) return;
    setSubmitting(true);
    try {
      const b = detail.billing || {};
      const cardNumberDigits = card.number.replace(/\D/g, "");
      const payload: CheckoutPayRequest = {
        card_holder: card.holder.trim(),
        card_number: cardNumberDigits,
        card_expiry: card.expiry.replace(/\D/g, "").slice(0, 4),
        card_cv2: card.cvc.replace(/\D/g, ""),
        card_type: detectCardType(cardNumberDigits),
        billing_first_name: b.first_name || "",
        billing_last_name: b.last_name || "",
        billing_address_1: b.address_1 || "",
        billing_city: b.city || "",
        billing_postcode: b.postcode || "",
        billing_country: (b.country || "GB").toUpperCase().slice(0, 2),
      };
      const res = await checkoutPay(payload);

      if (res.status === "3ds_required") {
        const acsUrl = res.acs_url;
        if (!acsUrl) throw new Error("3DS authentication data missing.");
        let fields: Record<string, string>;
        if (res.c_req) {
          fields = { creq: res.c_req };
          if (res.three_ds_session_data) fields.threeDSSessionData = res.three_ds_session_data;
        } else if (res.pa_req && res.md && res.term_url) {
          fields = { PaReq: res.pa_req, MD: res.md, TermUrl: res.term_url };
        } else {
          throw new Error("3DS authentication data missing.");
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
        return;
      }

      if (res.status === "success") {
        toast.success("Payment received. Thank you!");
        navigate(
          res.order_id != null
            ? `/orders?new=${encodeURIComponent(String(res.order_id))}`
            : "/orders",
          { replace: true },
        );
        return;
      }

      throw new Error(res.reason || res.message || "Payment was not authorised.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">
            Checkout
          </h1>
          <PageBreadcrumb currentPage="Checkout" />
        </div>
      </div>

      <main className="container-wide py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !detail ? null : (
          <>
            {/* Order summary table */}
            <div className="border border-[#e5e5e5]">
              <div className="grid grid-cols-[1fr_auto_auto] gap-8 px-8 py-5 text-[14px] font-bold uppercase tracking-wider text-[#333333] border-b border-[#e5e5e5]">
                <div>Product</div>
                <div className="w-24 text-center">Qty</div>
                <div className="w-32 text-right">Totals</div>
              </div>

              {detail.items.map((it, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_auto_auto] gap-8 px-8 py-6 border-b border-[#e5e5e5] items-start"
                >
                  <div className="text-[16px] text-[#333333] space-y-2">
                    <div className="text-[#333333]">{it.name.split(":")[0].trim()}</div>
                    {it.isbn && (
                      <div className="text-[#696969]">
                        <span className="font-bold text-[#333333]">ISBN:</span> {it.isbn}
                      </div>
                    )}
                  </div>
                  <div className="w-24 text-center text-[#696969] text-[16px]">× {it.quantity}</div>
                  <div className="w-32 text-right text-[#333333] text-[16px]">
                    {fmt(Number(it.total) || Number(it.subtotal) || (Number(it.unit_price) || 0) * (Number(it.quantity) || 0))}
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-[1fr_auto] px-8 py-5 border-b border-[#e5e5e5] text-[16px]">
                <div className="font-bold text-[#333333]">Subtotal:</div>
                <div className="text-right text-[#333333]">{fmt(subtotal)}</div>
              </div>
              <div className="grid grid-cols-[1fr_auto] px-8 py-5 border-b border-[#e5e5e5] text-[16px]">
                <div className="font-bold text-[#333333]">Shipping:</div>
                <div className="text-right text-[#333333]">{fmt(detail.shipping_total_amount ?? 0)}</div>
              </div>
              <div className="grid grid-cols-[1fr_auto] px-8 py-5 border-b border-[#e5e5e5] text-[16px]">
                <div className="font-bold text-[#333333]">Total:</div>
                <div className="text-right text-[#333333]">{fmt(detail.total_amount)}</div>
              </div>
              <div className="grid grid-cols-[1fr_auto] px-8 py-5 text-[16px]">
                <div className="font-bold text-[#333333]">Payment method:</div>
                <div className="text-right text-[#696969]">
                  {detail.payment_method_title || "Credit/Debit Card"}
                </div>
              </div>
            </div>

            {/* Payment method selector */}
            <form onSubmit={handleSubmit} className="mt-10 border border-[#e5e5e5]">
              {/* Credit/Debit option */}
              <button
                type="button"
                onClick={() => setMethod("card")}
                className="w-full flex items-center justify-between px-6 py-5 border-b border-[#e5e5e5] bg-white"
              >
                <div className="flex items-center gap-4">
                  <span
                    className="w-5 h-5 border border-[#999] flex items-center justify-center"
                    style={{ borderColor: method === "card" ? ORANGE : "#999" }}
                  >
                    {method === "card" && <Check className="w-4 h-4" style={{ color: ORANGE }} strokeWidth={3} />}
                  </span>
                  <span className="text-[14px] font-bold uppercase tracking-wider text-[#333333]">
                    Credit/Debit Card
                  </span>
                </div>
                <CardBadges />
              </button>

              {method === "card" && (
                <div className="bg-[#f4f3ec] px-8 py-8 relative border-b border-[#e5e5e5]">
                  {/* Caret */}
                  <div
                    className="absolute -top-2 left-10 w-4 h-4 bg-[#f4f3ec] rotate-45"
                    style={{ borderLeft: "1px solid #e5e5e5", borderTop: "1px solid #e5e5e5" }}
                  />
                  <p className="text-[15px] text-[#333333] mb-6">Pay securely using your credit card.</p>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-[13px] font-bold uppercase tracking-wider text-[#333333] mb-2">
                        Cardholder Name <span style={{ color: ORANGE }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={card.holder}
                        onChange={(e) => setCard({ ...card, holder: e.target.value })}
                        placeholder="Name on card"
                        className="w-full bg-white border border-[#e5e5e5] px-4 py-4 text-[16px] text-[#333333] focus:outline-none focus:border-[#E4573D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold uppercase tracking-wider text-[#333333] mb-2">
                        Card Number <span style={{ color: ORANGE }}>*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={card.number}
                        onChange={(e) => setCard({ ...card, number: e.target.value })}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full bg-white border border-[#e5e5e5] px-4 py-4 text-[16px] text-[#333333] focus:outline-none focus:border-[#E4573D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold uppercase tracking-wider text-[#333333] mb-2">
                        Expiry (MM/YY) <span style={{ color: ORANGE }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                        placeholder="MM / YY"
                        className="w-full bg-white border border-[#e5e5e5] px-4 py-4 text-[16px] text-[#333333] focus:outline-none focus:border-[#E4573D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold uppercase tracking-wider text-[#333333] mb-2">
                        CVC <span style={{ color: ORANGE }}>*</span>{" "}
                        <span className="ml-2 text-[12px] uppercase" style={{ color: ORANGE }}>
                          What is this?
                        </span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={card.cvc}
                        onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                        placeholder="CVC"
                        className="w-full bg-white border border-[#e5e5e5] px-4 py-4 text-[16px] text-[#333333] focus:outline-none focus:border-[#E4573D]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-[#e5e5e5] px-8 py-8 bg-white flex items-center justify-between gap-6 flex-wrap">
                <p className="text-[14px] text-[#696969] max-w-3xl">
                  Your personal data will be used to process your order, support your experience throughout this
                  website, and for other purposes described in our{" "}
                  <a href="/privacy" style={{ color: ORANGE }} className="underline">
                    privacy policy
                  </a>
                  .
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="text-white text-[14px] font-bold uppercase tracking-wider px-10 py-4 transition-colors disabled:opacity-60"
                  style={{ background: ORANGE }}
                >
                  {submitting ? "Processing…" : `Pay for Order`}
                </button>
              </div>
            </form>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}