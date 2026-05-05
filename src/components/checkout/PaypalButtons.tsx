import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  paypalCreateOrder,
  paypalCaptureOrder,
} from "@/services/cartService";
import type { PaypalCreateOrderRequest } from "@/services/cartService";

const PAYPAL_CLIENT_ID =
  (import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined) || "sb";

let sdkPromise: Promise<unknown> | null = null;

function loadPaypalSdk(): Promise<unknown> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  // @ts-expect-error injected by SDK
  if (window.paypal) return Promise.resolve(window.paypal);
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      PAYPAL_CLIENT_ID,
    )}&currency=GBP&intent=capture`;
    script.async = true;
    // @ts-expect-error injected by SDK
    script.onload = () => resolve(window.paypal);
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error("Failed to load PayPal SDK"));
    };
    document.head.appendChild(script);
  });
  return sdkPromise;
}

interface Props {
  onSuccess: (orderId: string | number | undefined, transactionId?: string) => void;
  onError?: (message: string) => void;
  /**
   * Builds the create-order payload (billing address + customer note).
   * Throw to abort the PayPal flow (e.g. validation error).
   */
  buildCreateOrderPayload: () => PaypalCreateOrderRequest;
}

export default function PaypalButtons({ onSuccess, onError, buildCreateOrderPayload }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const buildPayloadRef = useRef(buildCreateOrderPayload);
  useEffect(() => { onSuccessRef.current = onSuccess; }, [onSuccess]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);
  useEffect(() => { buildPayloadRef.current = buildCreateOrderPayload; }, [buildCreateOrderPayload]);

  useEffect(() => {
    let cancelled = false;
    if (containerRef.current) containerRef.current.innerHTML = "";
    loadPaypalSdk()
      .then((paypal) => {
        if (cancelled || !containerRef.current) return;
        // @ts-expect-error PayPal SDK
        const buttons = paypal.Buttons({
          style: { layout: "horizontal", color: "gold", shape: "rect", label: "paypal", tagline: false },
          createOrder: async () => {
            try {
              const payload = buildPayloadRef.current();
              const res = await paypalCreateOrder(payload);
              return res.paypal_order_id;
            } catch (e) {
              const msg = e instanceof Error ? e.message : "Failed to create PayPal order";
              onErrorRef.current?.(msg);
              throw e;
            }
          },
          onApprove: async (data: { orderID: string }) => {
            try {
              const res = await paypalCaptureOrder(data.orderID);
              if (res.status === "success") {
                onSuccessRef.current(res.order_id, res.transaction_id);
              } else {
                onErrorRef.current?.(res.reason || "PayPal payment was not completed.");
              }
            } catch (e) {
              onErrorRef.current?.(e instanceof Error ? e.message : "PayPal capture failed");
            }
          },
          onError: (err: unknown) => {
            const msg = err instanceof Error ? err.message : "PayPal error";
            onErrorRef.current?.(msg);
          },
        });
        if (buttons.isEligible && !buttons.isEligible()) {
          setError("PayPal is not available.");
          setLoading(false);
          return;
        }
        buttons
          .render(containerRef.current)
          .then(() => !cancelled && setLoading(false))
          .catch((e: unknown) => {
            if (cancelled) return;
            setError(e instanceof Error ? e.message : "Failed to render PayPal");
            setLoading(false);
          });
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load PayPal");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {loading && (
        <div className="flex items-center gap-2 text-[13px] text-[#696969] py-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading PayPal…
        </div>
      )}
      {error && <div className="text-[13px] text-red-600 py-2">{error}</div>}
      <div ref={containerRef} />
    </div>
  );
}