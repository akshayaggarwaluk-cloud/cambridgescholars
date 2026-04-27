import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

type Endpoint = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  integrated: boolean;
  note?: string;
};

type Group = {
  name: string;
  endpoints: Endpoint[];
};

const GROUPS: Group[] = [
  {
    name: "Books",
    endpoints: [
      { method: "GET", path: "/books", description: "List books with filters", integrated: true },
      { method: "GET", path: "/books/{id}", description: "Book details by ID/slug", integrated: true },
      { method: "GET", path: "/books/forthcoming", description: "Forthcoming titles", integrated: true },
    ],
  },
  {
    name: "Categories",
    endpoints: [
      { method: "GET", path: "/categories", description: "Hierarchical category tree", integrated: true },
    ],
  },
  {
    name: "Series",
    endpoints: [
      { method: "GET", path: "/series", description: "List of book series", integrated: true },
    ],
  },
  {
    name: "Search",
    endpoints: [
      { method: "GET", path: "/search/autocomplete", description: "Header search autocomplete", integrated: true },
    ],
  },
  {
    name: "Homepage",
    endpoints: [
      { method: "GET", path: "/homepage/hero", description: "Hero carousel slides", integrated: true },
      { method: "GET", path: "/homepage/featured-books", description: "Featured books section", integrated: true },
      { method: "GET", path: "/homepage/featured-reviews", description: "Author reviews carousel", integrated: true },
      { method: "GET", path: "/homepage/news", description: "Latest news posts", integrated: true },
    ],
  },
  {
    name: "Newsletter",
    endpoints: [
      { method: "POST", path: "/newsletter/subscribe", description: "Subscribe email", integrated: true },
    ],
  },
  {
    name: "Auth",
    endpoints: [
      { method: "POST", path: "/auth/register/send-otp", description: "Send registration OTP", integrated: true },
      { method: "POST", path: "/auth/register/verify", description: "Verify OTP and register", integrated: true },
      { method: "POST", path: "/auth/login", description: "User login", integrated: true },
      { method: "POST", path: "/auth/logout", description: "User logout", integrated: true },
      { method: "POST", path: "/auth/forgot-password", description: "Send reset link", integrated: true },
      { method: "POST", path: "/auth/reset-password", description: "Set new password via token", integrated: true },
    ],
  },
  {
    name: "Account",
    endpoints: [
      { method: "GET", path: "/account/profile", description: "Get user profile", integrated: true },
      { method: "PUT", path: "/account/profile", description: "Update profile", integrated: true },
      { method: "PUT", path: "/account/password", description: "Change password (logged-in user)", integrated: false, note: "UI not wired up" },
      { method: "GET", path: "/account/orders", description: "List user orders", integrated: true },
      { method: "GET", path: "/account/orders/{order_id}", description: "Order detail", integrated: false, note: "Order detail page missing" },
      { method: "GET", path: "/account/ebooks", description: "VitalSource ebook library", integrated: false, note: "Ebook library page missing" },
    ],
  },
  {
    name: "Cart",
    endpoints: [
      { method: "GET", path: "/cart", description: "Get current cart (incl. shipping by country)", integrated: true, note: "Now passes ?country= and reads shipping_gbp / shipping_requires_quote" },
      { method: "POST", path: "/cart/items", description: "Add item to cart", integrated: true },
      { method: "PUT", path: "/cart/items/{isbn}", description: "Update cart item quantity", integrated: true },
      { method: "DELETE", path: "/cart/items/{isbn}", description: "Remove cart item", integrated: true },
      { method: "POST", path: "/cart/coupon", description: "Apply coupon code", integrated: true },
      { method: "DELETE", path: "/cart/coupon", description: "Remove coupon", integrated: true },
      { method: "POST", path: "/cart/merge", description: "Merge guest cart on login", integrated: true },
    ],
  },
  {
    name: "Checkout",
    endpoints: [
      { method: "GET", path: "/checkout/merchant-session-key", description: "Opayo merchant session key", integrated: true },
      { method: "POST", path: "/checkout/pay", description: "Create order and process payment via Opayo Pi", integrated: true },
      { method: "POST", path: "/checkout/3ds-complete", description: "Complete 3DS challenge", integrated: true },
    ],
  },
  {
    name: "Wishlist",
    endpoints: [
      { method: "GET", path: "/wishlist", description: "List wishlist items", integrated: true },
      { method: "POST", path: "/wishlist", description: "Add to wishlist", integrated: true },
      { method: "DELETE", path: "/wishlist/{id}", description: "Remove from wishlist", integrated: true },
    ],
  },
  {
    name: "CMS (Admin)",
    endpoints: [
      { method: "GET", path: "/admin/cms", description: "List CMS entries", integrated: true },
      { method: "POST", path: "/admin/cms", description: "Create CMS entry", integrated: true },
      { method: "PUT", path: "/admin/cms/{id}", description: "Update CMS entry", integrated: true },
      { method: "DELETE", path: "/admin/cms/{id}", description: "Delete CMS entry", integrated: true },
    ],
  },
  {
    name: "Coupons (Admin)",
    endpoints: [
      { method: "GET", path: "/admin/coupons", description: "List coupons", integrated: true },
      { method: "POST", path: "/admin/coupons", description: "Create coupon", integrated: true },
      { method: "PUT", path: "/admin/coupons/{id}", description: "Update coupon", integrated: true },
      { method: "DELETE", path: "/admin/coupons/{id}", description: "Delete coupon", integrated: true },
    ],
  },
  {
    name: "System",
    endpoints: [
      { method: "GET", path: "/health", description: "System health check", integrated: false, note: "Not used by UI" },
    ],
  },
];

const methodColor: Record<Endpoint["method"], string> = {
  GET: "bg-blue-100 text-blue-800 border-blue-200",
  POST: "bg-green-100 text-green-800 border-green-200",
  PUT: "bg-amber-100 text-amber-800 border-amber-200",
  PATCH: "bg-amber-100 text-amber-800 border-amber-200",
  DELETE: "bg-red-100 text-red-800 border-red-200",
};

export default function ApiAudit() {
  const allEndpoints = GROUPS.flatMap((g) => g.endpoints);
  const total = allEndpoints.length;
  const integratedCount = allEndpoints.filter((e) => e.integrated).length;
  const notIntegratedCount = total - integratedCount;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <section className="bg-[#f4f3ec] border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <p className="text-sm uppercase tracking-wider text-foreground/60 mb-3">
              Developer Reference
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
              API Integration Audit
            </h1>
            <p className="text-foreground/70 max-w-2xl">
              An overview of all Cambridge Scholars Publishing API endpoints used by
              ScholarApp, with a clear status of which are integrated into the
              frontend and which remain outstanding.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-border bg-white p-6">
              <p className="text-xs uppercase tracking-wider text-foreground/60">Total endpoints</p>
              <p className="font-serif text-4xl mt-2">{total}</p>
            </div>
            <div className="border border-border bg-white p-6">
              <p className="text-xs uppercase tracking-wider text-foreground/60">Integrated</p>
              <p className="font-serif text-4xl mt-2 text-green-700">{integratedCount}</p>
              <p className="text-sm text-foreground/60 mt-1">
                {Math.round((integratedCount / total) * 100)}% coverage
              </p>
            </div>
            <div className="border border-border bg-white p-6">
              <p className="text-xs uppercase tracking-wider text-foreground/60">Not integrated</p>
              <p className="font-serif text-4xl mt-2 text-red-700">{notIntegratedCount}</p>
              <p className="text-sm text-foreground/60 mt-1">Outstanding work</p>
            </div>
          </div>
        </section>

        {/* Groups */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10">
          {GROUPS.map((group) => {
            const groupIntegrated = group.endpoints.filter((e) => e.integrated).length;
            return (
              <div key={group.name} className="border border-border bg-white">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[#fafaf7]">
                  <h2 className="font-serif text-2xl">{group.name}</h2>
                  <span className="text-sm text-foreground/60">
                    {groupIntegrated}/{group.endpoints.length} integrated
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {group.endpoints.map((ep) => (
                    <div
                      key={ep.method + ep.path}
                      className="flex flex-col md:flex-row md:items-center gap-3 px-6 py-4"
                    >
                      <div className="flex items-center gap-3 md:w-72 shrink-0">
                        <Badge
                          variant="outline"
                          className={`${methodColor[ep.method]} font-mono rounded-none`}
                        >
                          {ep.method}
                        </Badge>
                        <code className="text-sm font-mono text-foreground/90 break-all">
                          {ep.path}
                        </code>
                      </div>
                      <div className="flex-1 text-sm text-foreground/70">
                        {ep.description}
                        {ep.note && (
                          <span className="block text-xs text-foreground/50 mt-1">
                            Note: {ep.note}
                          </span>
                        )}
                      </div>
                      <div className="md:w-44 flex md:justify-end">
                        {ep.integrated ? (
                          <span className="inline-flex items-center gap-1.5 text-sm text-green-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Integrated
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-sm text-red-700">
                            <XCircle className="h-4 w-4" />
                            Not integrated
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </main>
      <Footer />
    </div>
  );
}