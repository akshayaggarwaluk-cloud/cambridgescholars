import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const params = new URLSearchParams(window.location.search);
const pathOrderId = window.location.pathname.match(/^\/orders\/([^/]+)/)?.[1];
const checkoutOrderReceivedId = window.location.pathname.match(/^\/checkout\/order-received\/([^/]+)/)?.[1];
const checkoutReturnOrderId =
  params.get("order_id") ||
  params.get("orderId") ||
  params.get("order") ||
  params.get("order-received") ||
  params.get("new") ||
  checkoutOrderReceivedId;
const isLegacyOrderPath =
  window.location.pathname === "/orders" ||
  (/^\/orders\//.test(window.location.pathname) && !/^\/orders\/[^/]+\/pay\/?$/.test(window.location.pathname));
const isPaymentReturnPath =
  window.location.pathname.startsWith("/checkout/order-received") ||
  (window.location.pathname === "/checkout" && (
    Boolean(checkoutReturnOrderId) ||
    ["success", "ok", "completed", "complete"].includes((params.get("status") || "").toLowerCase())
  ));

if (isLegacyOrderPath || isPaymentReturnPath) {
  const newOrderId = checkoutReturnOrderId || pathOrderId;
  window.history.replaceState(
    null,
    "",
    newOrderId ? `/profile?tab=orders&new=${encodeURIComponent(newOrderId)}` : "/profile?tab=orders",
  );
}

createRoot(document.getElementById("root")!).render(<App />);
