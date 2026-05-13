import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Orders() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pathOrderId = location.pathname.match(/^\/orders\/([^/]+)/)?.[1];
    const newOrderId = params.get("new") || params.get("order_id") || params.get("orderId") || pathOrderId;
    navigate(
      newOrderId ? `/my-account?tab=orders&new=${encodeURIComponent(newOrderId)}` : "/my-account?tab=orders",
      { replace: true },
    );
  }, [location.pathname, location.search, navigate]);

  return null;
}