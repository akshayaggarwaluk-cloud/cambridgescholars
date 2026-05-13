import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, AlertCircle, PackageCheck } from "lucide-react";
import { trackOrder, type OrderDetail } from "@/services/accountService";

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderDetail | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const detail = await trackOrder({
        order_id: orderId.trim(),
        billing_email: billingEmail.trim(),
      });
      setOrder(detail);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We could not connect to the tracking service. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fmtMoney = (amount?: number | null, currency?: string | null) => {
    if (amount == null) return "—";
    try {
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: currency || "GBP",
      }).format(amount);
    } catch {
      return `${currency || ""} ${amount.toFixed(2)}`.trim();
    }
  };

  const fmtDate = (iso?: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      <Header />

      {/* Header Banner */}
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">
            Order Tracking
          </h1>
          <PageBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "My account", href: "/my-account" },
            ]}
            currentPage="Order Tracking"
          />
        </div>
      </div>

      <main className="flex-1 py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-10 p-5 border bg-[#fde8e6] border-[#f5b5ad]">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-[#C75B2A] mt-0.5 flex-shrink-0" />
                <p className="text-[16px] leading-[1.6] font-nav text-[#333333]">
                  {error}
                </p>
              </div>
            </div>
          )}

          {order && (
            <div className="mb-10 border border-[#e5e5e5] bg-white">
              <div className="flex items-center gap-3 px-6 py-4 bg-[#f6fef9] border-b border-[#86efac]">
                <PackageCheck className="h-5 w-5 text-[#16a34a] flex-shrink-0" />
                <p className="text-[16px] font-nav text-[#166534]">
                  Order <strong>#{order.id}</strong> — Status:{" "}
                  <strong className="uppercase">{order.status}</strong>
                </p>
              </div>
              <div className="p-6 space-y-6 text-[15px] font-nav text-[#333333]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[12px] uppercase tracking-wider text-[#696969] mb-1">
                      Order date
                    </div>
                    <div>{fmtDate(order.created_at)}</div>
                  </div>
                  <div>
                    <div className="text-[12px] uppercase tracking-wider text-[#696969] mb-1">
                      Payment method
                    </div>
                    <div>{order.payment_method_title || order.payment_method || "—"}</div>
                  </div>
                  {order.date_paid_gmt && (
                    <div>
                      <div className="text-[12px] uppercase tracking-wider text-[#696969] mb-1">
                        Paid on
                      </div>
                      <div>{fmtDate(order.date_paid_gmt)}</div>
                    </div>
                  )}
                  {order.date_completed_gmt && (
                    <div>
                      <div className="text-[12px] uppercase tracking-wider text-[#696969] mb-1">
                        Completed on
                      </div>
                      <div>{fmtDate(order.date_completed_gmt)}</div>
                    </div>
                  )}
                </div>

                {order.items && order.items.length > 0 && (
                  <div>
                    <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#333333] mb-3">
                      Items
                    </h2>
                    <div className="border border-[#e5e5e5]">
                      <table className="w-full text-left">
                        <thead className="bg-[#f4f3ec] text-[12px] uppercase tracking-wider text-[#696969]">
                          <tr>
                            <th className="px-4 py-2 font-bold">Product</th>
                            <th className="px-4 py-2 font-bold text-center">Qty</th>
                            <th className="px-4 py-2 font-bold text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((it, i) => (
                            <tr key={i} className="border-t border-[#e5e5e5]">
                              <td className="px-4 py-3">
                                <div>{it.name}</div>
                                {it.isbn && (
                                  <div className="text-[12px] text-[#696969]">
                                    ISBN: {it.isbn}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">{it.quantity}</td>
                              <td className="px-4 py-3 text-right">
                                {fmtMoney(it.total ?? it.subtotal, order.currency)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {order.shipping_total_amount != null && (
                    <div className="flex justify-between">
                      <span className="text-[#696969]">Shipping</span>
                      <span>{fmtMoney(order.shipping_total_amount, order.currency)}</span>
                    </div>
                  )}
                  {order.tax_amount != null && (
                    <div className="flex justify-between">
                      <span className="text-[#696969]">Tax</span>
                      <span>{fmtMoney(order.tax_amount, order.currency)}</span>
                    </div>
                  )}
                  {order.discount_total_amount != null && order.discount_total_amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#696969]">Discount</span>
                      <span>−{fmtMoney(order.discount_total_amount, order.currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between sm:col-span-2 pt-3 border-t border-[#e5e5e5]">
                    <span className="font-bold uppercase tracking-wider text-[13px]">Total</span>
                    <span className="font-bold">{fmtMoney(order.total_amount, order.currency)}</span>
                  </div>
                </div>

                {(order.billing || order.shipping) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#e5e5e5]">
                    {order.billing && (
                      <div>
                        <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#333333] mb-2">
                          Billing address
                        </h3>
                        <address className="not-italic text-[14px] leading-[1.6]">
                          {[order.billing.first_name, order.billing.last_name].filter(Boolean).join(" ")}
                          {order.billing.company && <><br />{order.billing.company}</>}
                          {order.billing.address_1 && <><br />{order.billing.address_1}</>}
                          {order.billing.address_2 && <><br />{order.billing.address_2}</>}
                          {(order.billing.city || order.billing.postcode) && (
                            <><br />{[order.billing.city, order.billing.postcode].filter(Boolean).join(", ")}</>
                          )}
                          {order.billing.country && <><br />{order.billing.country}</>}
                          {order.billing.email && <><br />{order.billing.email}</>}
                        </address>
                      </div>
                    )}
                    {order.shipping && (
                      <div>
                        <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#333333] mb-2">
                          Shipping address
                        </h3>
                        <address className="not-italic text-[14px] leading-[1.6]">
                          {[order.shipping.first_name, order.shipping.last_name].filter(Boolean).join(" ")}
                          {order.shipping.company && <><br />{order.shipping.company}</>}
                          {order.shipping.address_1 && <><br />{order.shipping.address_1}</>}
                          {order.shipping.address_2 && <><br />{order.shipping.address_2}</>}
                          {(order.shipping.city || order.shipping.postcode) && (
                            <><br />{[order.shipping.city, order.shipping.postcode].filter(Boolean).join(", ")}</>
                          )}
                          {order.shipping.country && <><br />{order.shipping.country}</>}
                        </address>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="leading-[1.7] text-[#333333] text-[16px] font-nav mb-10 text-center">
            To track your order please enter your Order ID in the box below and
            press the "Track" button. This was given to you on your receipt and
            in the confirmation email you should have received.
          </p>

          <form onSubmit={handleTrack} className="space-y-6">
            <div className="text-center">
              <Label
                htmlFor="order-id"
                className="text-[13px] font-bold uppercase tracking-wider text-[#333333] mb-3 block"
              >
                Order ID
              </Label>
              <Input
                id="order-id"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Found in your order confirmation email."
                required
                className="h-12 rounded-none border-[#e5e5e5] bg-white text-[#333333] text-center placeholder:text-center focus-visible:ring-[#C75B2A]"
              />
            </div>

            <div className="text-center">
              <Label
                htmlFor="billing-email"
                className="text-[13px] font-bold uppercase tracking-wider text-[#333333] mb-3 block"
              >
                Billing email
              </Label>
              <Input
                id="billing-email"
                type="email"
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                placeholder="Email you used during checkout."
                required
                className="h-12 rounded-none border-[#e5e5e5] bg-white text-[#333333] text-center placeholder:text-center focus-visible:ring-[#C75B2A]"
              />
            </div>

            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="h-12 px-10 rounded-none uppercase tracking-[0.22em] bg-[#C75B2A] hover:bg-[#a84a22] text-white font-semibold text-[14px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Track
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[15px] text-[#696969] font-nav leading-[1.6]">
              If you have any questions about your order, please contact us at{" "}
              <a
                href="mailto:orders@cambridgescholars.com"
                className="text-[#C75B2A] hover:underline"
              >
                orders@cambridgescholars.com
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
