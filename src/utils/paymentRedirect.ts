export function buildAccountOrdersPath(orderId?: string | number | null) {
  return orderId != null && String(orderId).trim()
    ? `/profile?tab=orders&new=${encodeURIComponent(String(orderId))}`
    : "/profile?tab=orders";
}