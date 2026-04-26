import { useEffect, useState } from "react";
import { Check, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";

type BannerVariant = "added" | "removed";

interface BannerData {
  message: string;
  id: number;
  variant: BannerVariant;
  undoLabel?: string;
  undoEvent?: string;
}

export function CartBanner() {
  const [banner, setBanner] = useState<BannerData | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{
        message: string;
        variant?: BannerVariant;
        undoLabel?: string;
        undoEvent?: string;
      }>).detail;
      const id = Date.now();
      setBanner({
        message: detail.message,
        id,
        variant: detail.variant ?? "added",
        undoLabel: detail.undoLabel,
        undoEvent: detail.undoEvent,
      });
      setTimeout(() => {
        setBanner((curr) => (curr?.id === id ? null : curr));
      }, 5000);
    };
    window.addEventListener("cart:notification", handler);
    return () => window.removeEventListener("cart:notification", handler);
  }, []);

  if (!banner) return null;

  return (
    <div
      className="fixed left-0 right-0 z-[100] flex justify-center px-4"
      style={{ top: "var(--cart-banner-top, 96px)" }}
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-7xl bg-[#a4c14a] text-white flex items-center justify-between gap-4 px-6 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <Check className="h-5 w-5 flex-shrink-0" strokeWidth={3} />
          <span
            className="text-base"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            dangerouslySetInnerHTML={{ __html: banner.message }}
          />
          {banner.variant === "removed" && banner.undoEvent && (
            <button
              type="button"
              onClick={() => {
                if (banner.undoEvent) {
                  window.dispatchEvent(new CustomEvent(banner.undoEvent));
                }
                setBanner(null);
              }}
              className="ml-2 underline text-base hover:opacity-90"
              style={{ fontFamily: '"Nunito Sans", sans-serif' }}
            >
              {banner.undoLabel ?? "Undo?"}
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          {banner.variant === "added" && (
            <Link
              to="/cart"
              className="flex items-center gap-2 text-base font-medium hover:underline whitespace-nowrap"
              style={{ fontFamily: '"Nunito Sans", sans-serif' }}
              onClick={() => setBanner(null)}
            >
              View cart <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <button
            onClick={() => setBanner(null)}
            aria-label="Dismiss notification"
            className="hover:opacity-80"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function showCartNotification(
  message: string,
  options?: { variant?: BannerVariant; undoLabel?: string; undoEvent?: string },
) {
  window.dispatchEvent(
    new CustomEvent("cart:notification", {
      detail: {
        message,
        variant: options?.variant ?? "added",
        undoLabel: options?.undoLabel,
        undoEvent: options?.undoEvent,
      },
    }),
  );
}
