import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, AlertCircle, PackageCheck } from "lucide-react";

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const API_BASE =
        (import.meta.env.VITE_CSP_API_BASE as string | undefined) ||
        "https://api.cambridgescholars.com/api/website";

      const res = await fetch(
        `${API_BASE}/orders/track`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderId.trim(),
            billing_email: billingEmail.trim(),
          }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        setResult({
          success: true,
          message:
            data.message ||
            "Order found. Please check your email for tracking details or sign in to your account to view full order information.",
        });
      } else {
        const text = await res.text().catch(() => "");
        let msg = "We could not find an order matching those details. Please check your Order ID and billing email, or contact us at orders@cambridgescholars.com for assistance.";
        try {
          const parsed = JSON.parse(text);
          if (parsed.error || parsed.detail || parsed.message) {
            msg = parsed.error || parsed.detail || parsed.message;
          }
        } catch { /* ignore */ }
        setResult({ success: false, message: msg });
      }
    } catch {
      setResult({
        success: false,
        message:
          "We could not connect to the tracking service. Please try again later or contact us at orders@cambridgescholars.com for assistance.",
      });
    } finally {
      setLoading(false);
    }
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
          {result && (
            <div
              className={`mb-10 p-5 border ${
                result.success
                  ? "bg-[#f6fef9] border-[#86efac]"
                  : "bg-[#fde8e6] border-[#f5b5ad]"
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <PackageCheck className="h-5 w-5 text-[#16a34a] mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-[#C75B2A] mt-0.5 flex-shrink-0" />
                )}
                <p
                  className={`text-[16px] leading-[1.6] font-nav ${
                    result.success ? "text-[#166534]" : "text-[#333333]"
                  }`}
                >
                  {result.message}
                </p>
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
                className="h-12 rounded-none border-[#e5e5e5] bg-white text-[#333333] focus-visible:ring-[#C75B2A]"
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
                className="h-12 rounded-none border-[#e5e5e5] bg-white text-[#333333] focus-visible:ring-[#C75B2A]"
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
