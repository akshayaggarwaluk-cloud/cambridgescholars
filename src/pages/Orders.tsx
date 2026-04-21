import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Calendar, ArrowRight, Info, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import {
  listOrders,
  getOrder,
  type OrderSummary,
  type OrderDetail,
} from "@/services/accountService";

const CURRENCY_SYMBOL: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

function formatMoney(amount: number | null | undefined, currency?: string | null) {
  const value = typeof amount === "number" ? amount : 0;
  const symbol = currency ? CURRENCY_SYMBOL[currency.toUpperCase()] || `${currency} ` : "";
  return `${symbol}${value.toFixed(2)}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

function statusLabel(status: string) {
  return status.replace(/^wc-/, "").replace(/[-_]/g, " ");
}

function statusColor(status: string) {
  const s = status.toLowerCase().replace(/^wc-/, "");
  if (s.includes("completed")) return "bg-green-100 text-green-800";
  if (s.includes("processing")) return "bg-blue-100 text-blue-800";
  if (s.includes("pending") || s.includes("on-hold")) return "bg-yellow-100 text-yellow-800";
  if (s.includes("cancel") || s.includes("fail") || s.includes("refund"))
    return "bg-red-100 text-red-800";
  return "bg-muted text-muted-foreground";
}

export default function Orders() {
  const { isAuthenticated } = useExternalAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Per-order expanded detail
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [detailCache, setDetailCache] = useState<Record<number, OrderDetail>>({});
  const [detailLoadingId, setDetailLoadingId] = useState<number | null>(null);
  const [detailError, setDetailError] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await listOrders(1, 50);
        if (cancelled) return;
        setOrders(res?.orders || []);
      } catch (e) {
        if (cancelled) return;
        console.error("Error loading orders:", e);
        setError(e instanceof Error ? e.message : "Failed to load orders.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const handleToggleDetail = async (orderId: number) => {
    if (expandedId === orderId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(orderId);
    if (detailCache[orderId]) return;

    setDetailLoadingId(orderId);
    setDetailError((prev) => {
      const { [orderId]: _omit, ...rest } = prev;
      return rest;
    });
    try {
      const detail = await getOrder(orderId);
      setDetailCache((prev) => ({ ...prev, [orderId]: detail }));
    } catch (e) {
      console.error("Error loading order detail:", e);
      setDetailError((prev) => ({
        ...prev,
        [orderId]: e instanceof Error ? e.message : "Failed to load order details.",
      }));
    } finally {
      setDetailLoadingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-16">
          <div className="container-wide text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Sign in to view orders
            </h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to view your order history.
            </p>
            <Button asChild variant="gold" size="lg">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Order History</h1>
          <PageBreadcrumb currentPage="Orders" />
        </div>
      </div>

      <main className="pb-16">
        <div className="container-wide py-8">
          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-teal-600 text-white p-4 rounded flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5" />
                <span>No order has been made yet.</span>
              </div>
              <Link to="/books" className="flex items-center gap-2 hover:underline">
                Browse products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const isOpen = expandedId === order.id;
                const detail = detailCache[order.id];
                const dErr = detailError[order.id];
                return (
                  <div
                    key={order.id}
                    className="bg-card rounded-xl shadow-card overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="p-6 border-b border-border">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6 flex-wrap">
                          <div>
                            <p className="text-sm text-muted-foreground">Order #</p>
                            <p className="font-mono text-sm text-foreground">
                              {order.id}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">
                              {formatDate(order.created_at)}
                            </span>
                          </div>
                          {order.payment_method_title && (
                            <div className="text-sm text-muted-foreground">
                              {order.payment_method_title}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor(order.status)}`}
                          >
                            {statusLabel(order.status)}
                          </span>
                          <span className="font-serif text-lg font-bold text-foreground">
                            {formatMoney(order.total_amount, order.currency)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleDetail(order.id)}
                          >
                            {isOpen ? (
                              <>
                                Hide <ChevronUp className="h-4 w-4 ml-1" />
                              </>
                            ) : (
                              <>
                                Details <ChevronDown className="h-4 w-4 ml-1" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable detail */}
                    {isOpen && (
                      <div className="p-6 bg-secondary/40">
                        {detailLoadingId === order.id ? (
                          <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        ) : dErr ? (
                          <div className="text-destructive">{dErr}</div>
                        ) : detail ? (
                          <div className="space-y-6">
                            {/* Items */}
                            <div>
                              <h3 className="font-semibold text-foreground mb-3">
                                Items
                              </h3>
                              <div className="space-y-2">
                                {detail.items.map((item, idx) => (
                                  <div
                                    key={`${order.id}-item-${idx}`}
                                    className="flex items-start justify-between gap-4 p-3 bg-card rounded"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <p className="font-medium text-foreground">
                                        {item.name}
                                      </p>
                                      {item.isbn && (
                                        <p className="text-xs text-muted-foreground font-mono">
                                          ISBN {item.isbn}
                                        </p>
                                      )}
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {formatMoney(item.unit_price, detail.currency)} × {item.quantity}
                                      </p>
                                    </div>
                                    <div className="text-right text-sm font-medium text-foreground">
                                      {formatMoney(item.total ?? item.subtotal ?? 0, detail.currency)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Totals */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-1">
                                {typeof detail.shipping_total_amount === "number" && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{formatMoney(detail.shipping_total_amount, detail.currency)}</span>
                                  </div>
                                )}
                                {typeof detail.discount_total_amount === "number" && detail.discount_total_amount > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Discount</span>
                                    <span>− {formatMoney(detail.discount_total_amount, detail.currency)}</span>
                                  </div>
                                )}
                                {typeof detail.tax_amount === "number" && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>{formatMoney(detail.tax_amount, detail.currency)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-semibold pt-2 border-t border-border">
                                  <span>Total</span>
                                  <span>{formatMoney(detail.total_amount, detail.currency)}</span>
                                </div>
                              </div>

                              {/* Addresses */}
                              <div className="space-y-3">
                                {detail.shipping && (detail.shipping.address_1 || detail.shipping.city) && (
                                  <div>
                                    <p className="font-semibold text-foreground mb-1">Shipping address</p>
                                    <p className="text-muted-foreground whitespace-pre-line">
                                      {[
                                        [detail.shipping.first_name, detail.shipping.last_name].filter(Boolean).join(" "),
                                        detail.shipping.company,
                                        detail.shipping.address_1,
                                        detail.shipping.address_2,
                                        [detail.shipping.city, detail.shipping.state, detail.shipping.postcode].filter(Boolean).join(", "),
                                        detail.shipping.country,
                                      ].filter(Boolean).join("\n")}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
