import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkout3dsComplete } from "@/services/cartService";
import { useCart } from "@/contexts/CartContext";

/**
 * 3DS return target. Opayo's ACS posts back to this URL with
 * `cres` (3DS v2) or `PaRes` + `MD` (3DS v1) in either the form body
 * or query string. We forward them to /api/website/checkout/3ds-complete
 * and route the user to the orders page on success.
 *
 * The transaction id is stashed in sessionStorage by the Checkout page
 * before the redirect so we can correlate the response.
 */
export default function Checkout3dsReturn() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"working" | "error">("working");
  const [message, setMessage] = useState("Completing your payment…");
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const cres = params.get("cres") || params.get("CRes") || undefined;
    const pares = params.get("PaRes") || params.get("pares") || undefined;
    const transactionId =
      sessionStorage.getItem("opayo_pending_transaction_id") ||
      params.get("transaction_id") ||
      params.get("MD") ||
      "";

    if (!transactionId) {
      setStatus("error");
      setMessage("Missing payment reference. Please try checkout again.");
      return;
    }

    (async () => {
      try {
        const res = await checkout3dsComplete({
          transaction_id: transactionId,
          cres,
          pares,
        });
        sessionStorage.removeItem("opayo_pending_transaction_id");

        if (res.status === "ok" || (res as { status?: string }).status === "success") {
          try { await clearCart(); } catch { /* ignore */ }
          const orderId = res.order_id ? String(res.order_id) : "";
          navigate(orderId ? `/orders?new=${encodeURIComponent(orderId)}` : "/orders", {
            replace: true,
          });
        } else {
          setStatus("error");
          setMessage(res.message || "Payment was not authorised. Please try a different card.");
        }
      } catch (err) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Failed to complete payment.");
      }
    })();
  }, [navigate, clearCart]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container-wide max-w-lg mx-auto text-center">
          {status === "working" ? (
            <>
              <Loader2 className="h-12 w-12 mx-auto mb-6 animate-spin text-[#C75B2A]" />
              <h1 className="font-baskerville text-[32px] text-[#333333] mb-3">
                Confirming payment
              </h1>
              <p className="text-[15px] text-[#696969]">{message}</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#fdecea] mb-6">
                <AlertCircle className="h-10 w-10 text-[#C75B2A]" />
              </div>
              <h1 className="font-baskerville text-[32px] text-[#333333] mb-3">
                Payment not completed
              </h1>
              <p className="text-[15px] text-[#696969] mb-8">{message}</p>
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
