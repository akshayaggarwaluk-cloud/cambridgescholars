export function buildAccountOrdersPath(orderId?: string | number | null) {
  return orderId != null && String(orderId).trim()
    ? `/my-account?tab=orders&new=${encodeURIComponent(String(orderId))}`
    : "/my-account?tab=orders";
}