const PENDING_PAYMENT_ORDER_KEY = "cspPendingPaymentOrder";
const PENDING_PAYMENT_TTL_MS = 45 * 60 * 1000;

type PendingPaymentOrder = {
  orderId: string;
  createdAt: number;
};

export function buildAccountOrdersPath(orderId?: string | number | null) {
  return orderId != null && String(orderId).trim()
    ? `/profile?tab=orders&new=${encodeURIComponent(String(orderId))}`
    : "/profile?tab=orders";
}

export function rememberPendingPaymentOrder(orderId?: string | number | null) {
  if (orderId == null || !String(orderId).trim()) return;
  try {
    localStorage.setItem(
      PENDING_PAYMENT_ORDER_KEY,
      JSON.stringify({ orderId: String(orderId), createdAt: Date.now() } satisfies PendingPaymentOrder),
    );
  } catch {
    // Ignore storage failures; normal redirects still work.
  }
}

export function readPendingPaymentOrder() {
  try {
    const raw = localStorage.getItem(PENDING_PAYMENT_ORDER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PendingPaymentOrder>;
    if (!parsed.orderId || !parsed.createdAt || Date.now() - parsed.createdAt > PENDING_PAYMENT_TTL_MS) {
      localStorage.removeItem(PENDING_PAYMENT_ORDER_KEY);
      return null;
    }
    return parsed.orderId;
  } catch {
    return null;
  }
}

export function clearPendingPaymentOrder() {
  try {
    localStorage.removeItem(PENDING_PAYMENT_ORDER_KEY);
  } catch {
    // Ignore storage failures.
  }
}