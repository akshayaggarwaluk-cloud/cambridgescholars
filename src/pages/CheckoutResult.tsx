import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

/**
 * Browser-facing 3DS result page.
 *
 * The CSP backend's `/checkout/3ds-callback/{order_id}` endpoint receives the
 * ACS POST from the bank, finalises the Opayo transaction, then 302-redirects
 * the customer's browser here with `?order_id=X&status=success|failed`.
 */
export default function CheckoutResult() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const ranRef = useRef(false);
  const [working, setWorking] = useState(true);

  const status = (params.get("status") || "").toLowerCase();
  const orderId = params.get("order_id") || "";
  const isSuccess = status === "success" || status === "ok";

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    (async () => {
      if (isSuccess) {
        try { await clearCart(); } catch { /* ignore */ }
        // Skip confirmation screen — go directly to the orders page.
        navigate(orderId ? `/profile?tab=orders&new=${encodeURIComponent(orderId)}` : "/profile?tab=orders", { replace: true });
        return;
      }
      setWorking(false);
    })();
  }, [isSuccess, orderId, clearCart, navigate]);

  if (isSuccess) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container-wide max-w-lg mx-auto text-center">
          {working ? (
            <>
              <Loader2 className="h-12 w-12 mx-auto mb-6 animate-spin text-[#C75B2A]" />
              <h1 className="font-baskerville text-[32px] text-[#333333] mb-3">Confirming payment</h1>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#fdecea] mb-6">
                <AlertCircle className="h-10 w-10 text-[#C75B2A]" />
              </div>
              <h1 className="font-baskerville text-[32px] text-[#333333] mb-3">
                Payment not completed
              </h1>
              <p className="text-[15px] text-[#696969] mb-8">
                Your payment was not authorised. Please try a different card.
              </p>
              <Button
                onClick={() => navigate("/checkout", { replace: true })}
                className="h-12 px-8 rounded-none uppercase tracking-[0.22em] bg-[#C75B2A] hover:bg-[#a84a22] text-white"
              >
                Return to Checkout
              </Button>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
