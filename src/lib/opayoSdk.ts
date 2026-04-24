/**
 * Opayo (Sage Pay) Pi Drop-in SDK loader and tokenisation helper.
 *
 * Loads the Opayo "sagepay.js" client SDK on demand and exposes a thin
 * promise-based `tokeniseCard()` wrapper around the global `sagepayOwnForm`
 * API documented at:
 *   https://developer.elavon.com/products/opayo/en-us/api/post-cardidentifiers
 *
 * Card details never touch our server: we send them straight from the browser
 * to Opayo using the short-lived Merchant Session Key (MSK) returned by our
 * `/api/website/checkout/merchant-session-key` endpoint, and only the resulting
 * `cardIdentifier` string is forwarded to `/api/website/checkout/pay`.
 */

const SDK_URL =
  (import.meta.env.VITE_OPAYO_SDK_URL as string | undefined) ||
  // Default to Opayo's TEST sandbox SDK. Override via VITE_OPAYO_SDK_URL in
  // production (e.g. https://live.opayo.eu.elavon.com/api/v1/js/sdk-3-2-0.js).
  "https://pi-test.sagepay.com/api/v1/js/sdk-3-2-0.js";

export interface OpayoCardDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string; // MMYY
  securityCode: string;
}

export interface OpayoTokenisationSuccess {
  success: true;
  cardIdentifier: string;
}

export interface OpayoTokenisationFailure {
  success: false;
  message: string;
  raw?: unknown;
}

interface SagepayResult {
  success?: boolean;
  cardIdentifier?: string;
  errors?: Array<{ message?: string; clientMessage?: string; property?: string }>;
  status?: string;
  statusDetail?: string;
}

interface SagepayOwnForm {
  tokeniseCardDetails: (args: {
    cardDetails: {
      cardholderName: string;
      cardNumber: string;
      expiryDate: string;
      securityCode: string;
    };
    onTokenised: (result: SagepayResult) => void;
  }) => void;
}

declare global {
  interface Window {
    sagepayOwnForm?: (opts: { merchantSessionKey: string }) => SagepayOwnForm;
  }
}

let loaderPromise: Promise<void> | null = null;

/** Idempotently inject the Opayo SDK <script> tag and resolve when ready. */
export function loadOpayoSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (window.sagepayOwnForm) return Promise.resolve();
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SDK_URL}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Opayo SDK")),
        { once: true },
      );
      return;
    }
    const s = document.createElement("script");
    s.src = SDK_URL;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loaderPromise = null;
      reject(new Error("Failed to load Opayo SDK"));
    };
    document.head.appendChild(s);
  });

  return loaderPromise;
}

/** Strip spaces and dashes; keep only digits/X for card numbers. */
function digits(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

/** Convert "MM/YY", "MM-YY" or "MMYY" → "MMYY" as required by Opayo. */
export function normaliseExpiry(input: string): string {
  const d = digits(input);
  return d.slice(0, 4);
}

/**
 * Tokenise card details using a freshly-issued MSK. Resolves with a
 * `cardIdentifier` on success; never throws on validation errors — instead
 * returns `{ success: false, message }` so the UI can surface them inline.
 */
export async function tokeniseCard(
  merchantSessionKey: string,
  details: OpayoCardDetails,
): Promise<OpayoTokenisationSuccess | OpayoTokenisationFailure> {
  await loadOpayoSdk();
  if (!window.sagepayOwnForm) {
    return { success: false, message: "Card processor unavailable. Please try again." };
  }

  return new Promise((resolve) => {
    const form = window.sagepayOwnForm!({ merchantSessionKey });
    form.tokeniseCardDetails({
      cardDetails: {
        cardholderName: details.cardholderName.trim(),
        cardNumber: digits(details.cardNumber),
        expiryDate: normaliseExpiry(details.expiryDate),
        securityCode: digits(details.securityCode),
      },
      onTokenised: (result) => {
        if (result?.success && result.cardIdentifier) {
          resolve({ success: true, cardIdentifier: result.cardIdentifier });
        } else {
          const message =
            result?.errors?.[0]?.clientMessage ||
            result?.errors?.[0]?.message ||
            result?.statusDetail ||
            "We could not validate your card. Please check the details and try again.";
          resolve({ success: false, message, raw: result });
        }
      },
    });
  });
}
