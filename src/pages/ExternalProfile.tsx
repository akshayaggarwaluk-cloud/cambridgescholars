import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Package,
  MapPin,
  Settings,
  Loader2,
  Info,
  ArrowRight,
  CreditCard,
  Phone,
  Mail,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import { toast } from "sonner";
import {
  getProfile,
  updateProfile,
  changePassword,
  listOrders,
  getOrder,
  type AccountProfile,
  type ProfileUpdatePayload,
  type OrderDetail,
} from "@/services/accountService";

type TabType = "dashboard" | "orders" | "addresses" | "payment" | "account" | "password";

interface Order {
  id: number | string;
  status: string;
  total: number;
  created_at: string;
}

const EMPTY_ADDRESS = {
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postcode: "",
  country: "",
  phone: "",
};

export default function ExternalProfile() {
  const { user, isAuthenticated, logout } = useExternalAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // Upstream profile (source of truth for billing/shipping)
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    display_name: "",
    phone: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Billing form
  const [billingForm, setBillingForm] = useState({
    ...EMPTY_ADDRESS,
    email: "",
  });
  const [billingSaving, setBillingSaving] = useState(false);

  // Shipping form
  const [shippingForm, setShippingForm] = useState({ ...EMPTY_ADDRESS });
  const [shippingSaving, setShippingSaving] = useState(false);

  // Password form
  const [pwForm, setPwForm] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [pwSaving, setPwSaving] = useState(false);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);
  const [orderDetailCache, setOrderDetailCache] = useState<Record<string, OrderDetail>>({});
  const [orderDetailLoadingId, setOrderDetailLoadingId] = useState<string | null>(null);
  const [orderDetailError, setOrderDetailError] = useState<Record<string, string>>({});

  const handleViewOrder = async (orderId: number | string) => {
    const key = String(orderId);
    setViewingOrderId(key);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    if (orderDetailCache[key]) return;
    setOrderDetailLoadingId(key);
    setOrderDetailError((prev) => {
      const { [key]: _omit, ...rest } = prev;
      return rest;
    });
    try {
      const detail = await getOrder(orderId);
      setOrderDetailCache((prev) => ({ ...prev, [key]: detail }));
    } catch (e) {
      setOrderDetailError((prev) => ({
        ...prev,
        [key]: e instanceof Error ? e.message : "Failed to load order details.",
      }));
    } finally {
      setOrderDetailLoadingId(null);
    }
  };

  // Address edit mode: 'view' | 'billing' | 'shipping'
  const [addressMode, setAddressMode] = useState<"view" | "billing" | "shipping">("view");

  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const p = await getProfile();
      setProfile(p);
      setProfileForm({
        first_name: p.first_name || "",
        last_name: p.last_name || "",
        display_name: p.display_name || "",
        phone: p.phone || "",
      });
      setBillingForm({
        first_name: p.billing?.first_name || "",
        last_name: p.billing?.last_name || "",
        company: p.billing?.company || "",
        address_1: p.billing?.address_1 || "",
        address_2: p.billing?.address_2 || "",
        city: p.billing?.city || "",
        state: p.billing?.state || "",
        postcode: p.billing?.postcode || "",
        country: p.billing?.country || "",
        email: p.billing?.email || p.email || "",
        phone: p.billing?.phone || "",
      });
      setShippingForm({
        first_name: p.shipping?.first_name || "",
        last_name: p.shipping?.last_name || "",
        company: p.shipping?.company || "",
        address_1: p.shipping?.address_1 || "",
        address_2: p.shipping?.address_2 || "",
        city: p.shipping?.city || "",
        state: p.shipping?.state || "",
        postcode: p.shipping?.postcode || "",
        country: p.shipping?.country || "",
        phone: p.shipping?.phone || "",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load profile";
      toast.error(msg);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfile();
    }
  }, [isAuthenticated, user, loadProfile]);

  useEffect(() => {
    if (isAuthenticated && user && activeTab === "orders") {
      void loadOrders();
    }
  }, [activeTab, isAuthenticated, user]);

  const loadOrders = async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const res = await listOrders(1, 50);
      const mapped: Order[] = (res?.orders || []).map((o) => ({
        id: o.id,
        status: o.status,
        total: Number(o.total_amount) || 0,
        created_at: o.created_at,
      }));
      setOrders(mapped);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error loading orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    try {
      const payload: ProfileUpdatePayload = {
        first_name: profileForm.first_name.trim(),
        last_name: profileForm.last_name.trim(),
        display_name: profileForm.display_name.trim(),
        phone: profileForm.phone.trim(),
      };
      const updated = await updateProfile(payload);
      setProfile(updated);
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSaveBilling = async () => {
    setBillingSaving(true);
    try {
      const payload: ProfileUpdatePayload = {
        billing_first_name: billingForm.first_name.trim(),
        billing_last_name: billingForm.last_name.trim(),
        billing_company: billingForm.company.trim(),
        billing_address_1: billingForm.address_1.trim(),
        billing_address_2: billingForm.address_2.trim(),
        billing_city: billingForm.city.trim(),
        billing_state: billingForm.state.trim(),
        billing_postcode: billingForm.postcode.trim(),
        billing_country: billingForm.country.trim(),
        billing_email: billingForm.email.trim(),
        billing_phone: billingForm.phone.trim(),
      };
      const updated = await updateProfile(payload);
      setProfile(updated);
      toast.success("Billing address updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update billing address");
    } finally {
      setBillingSaving(false);
    }
  };

  const handleSaveShipping = async () => {
    setShippingSaving(true);
    try {
      const payload: ProfileUpdatePayload = {
        shipping_first_name: shippingForm.first_name.trim(),
        shipping_last_name: shippingForm.last_name.trim(),
        shipping_company: shippingForm.company.trim(),
        shipping_address_1: shippingForm.address_1.trim(),
        shipping_address_2: shippingForm.address_2.trim(),
        shipping_city: shippingForm.city.trim(),
        shipping_state: shippingForm.state.trim(),
        shipping_postcode: shippingForm.postcode.trim(),
        shipping_country: shippingForm.country.trim(),
        shipping_phone: shippingForm.phone.trim(),
      };
      const updated = await updateProfile(payload);
      setProfile(updated);
      toast.success("Shipping address updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update shipping address");
    } finally {
      setShippingSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.current_password) {
      toast.error("Current password is required");
      return;
    }
    if (pwForm.new_password.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (pwForm.new_password !== pwForm.confirm_new_password) {
      toast.error("New passwords do not match");
      return;
    }
    setPwSaving(true);
    try {
      await changePassword({
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      });
      toast.success("Password updated");
      setPwForm({ current_password: "", new_password: "", confirm_new_password: "" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to change password");
    } finally {
      setPwSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-32 pb-16">
          <div className="container-wide text-center">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Sign in to view profile
            </h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to access your profile settings.
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

  const displayName =
    profile?.display_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
    user.name ||
    user.username ||
    user.email?.split("@")[0] ||
    "User";

  const sidebarItems: { id: TabType; label: string; icon: typeof User }[] = [
    { id: "dashboard", label: "DASHBOARD", icon: User },
    { id: "orders", label: "ORDERS", icon: Package },
    { id: "addresses", label: "ADDRESSES", icon: MapPin },
    { id: "payment", label: "PAYMENT METHODS", icon: CreditCard },
    { id: "account", label: "ACCOUNT DETAILS", icon: Settings },
  ];

  const dashboardName =
    user.username || user.email?.split("@")[0] || displayName;

  const renderDashboard = () => (
    <div
      className="space-y-5 text-[16px] text-[#696969]"
      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    >
      <p>
        Hello <strong className="font-bold text-[#696969]">{dashboardName}</strong>{" "}
        (not <strong className="font-bold text-[#696969]">{dashboardName}</strong>?{" "}
        <button
          onClick={handleLogout}
          className="text-[#C75B2A] hover:text-[#a84a20] transition-colors"
        >
          Log out
        </button>
        )
      </p>
      <p>
        From your account dashboard you can view your{" "}
        <button
          onClick={() => setActiveTab("orders")}
          className="text-[#C75B2A] hover:text-[#a84a20] transition-colors"
        >
          recent orders
        </button>
        , manage your{" "}
        <button
          onClick={() => setActiveTab("addresses")}
          className="text-[#C75B2A] hover:text-[#a84a20] transition-colors"
        >
          shipping and billing addresses
        </button>
        , and{" "}
        <button
          onClick={() => setActiveTab("account")}
          className="text-[#C75B2A] hover:text-[#a84a20] transition-colors"
        >
          edit your password and account details
        </button>
        .
      </p>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="space-y-6" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
      <div className="bg-[#5BAFA8] text-white px-6 py-5 flex items-center gap-3 text-[15px]">
        <Info className="h-5 w-5 flex-shrink-0" strokeWidth={2} />
        <span>No saved methods found.</span>
      </div>
      <Button
        onClick={() => toast.info("Payment method management coming soon")}
        className="bg-[#E4573D] hover:bg-[#c94a30] text-white rounded-none uppercase tracking-wider font-bold text-[14px] h-12 px-8"
        style={{ fontFamily: '"Nunito Sans", sans-serif' }}
      >
        Add Payment Method
      </Button>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
      {viewingOrderId ? (
        renderOrderDetailPage(viewingOrderId)
      ) : ordersLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#5BAFA8] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 flex-shrink-0" strokeWidth={2} />
            <span>No order has been made yet.</span>
          </div>
          <Link to="/books" className="flex items-center gap-2 hover:underline">
            Browse products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="w-full">
          {/* Header row */}
          <div className="grid grid-cols-5 bg-[#E4573D] text-white text-[14px] font-bold uppercase tracking-wider px-6 py-5">
            <div>Order</div>
            <div>Date</div>
            <div>Status</div>
            <div>Total</div>
            <div className="text-right">Actions</div>
          </div>
          {/* Rows */}
          {orders.map((order) => {
            const statusLabel = order.status
              .replace(/[-_]/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());
            const isPending =
              order.status.toLowerCase().includes("pending") ||
              order.status.toLowerCase() === "on-hold";
            return (
              <div key={order.id} className="border-b border-border">
                <div className="grid grid-cols-5 items-center px-6 py-6 text-[14px] text-[#696969]">
                <div className="text-[#E4573D] font-medium">
                  #{order.id}
                </div>
                <div>
                  {new Date(order.created_at).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div>{statusLabel}</div>
                <div>£{(Number(order.total) || 0).toFixed(2)}</div>
                <div className="flex justify-end">
                  <div className="bg-[#E4573D] flex items-center">
                    {isPending && (
                      <button className="text-white text-[13px] font-bold uppercase tracking-wider px-5 py-3 hover:bg-[#c94a30] transition-colors">
                        Pay
                      </button>
                    )}
                    <button
                      onClick={() => handleViewOrder(order.id)}
                      className="text-white text-[13px] font-bold uppercase tracking-wider px-5 py-3 hover:bg-[#c94a30] transition-colors"
                    >
                      View
                    </button>
                    {isPending && (
                      <button className="text-white text-[13px] font-bold uppercase tracking-wider px-5 py-3 hover:bg-[#c94a30] transition-colors">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const currencySymbol = (c?: string | null) => {
    const u = (c || "GBP").toUpperCase();
    return u === "USD" ? "$" : u === "EUR" ? "€" : "£";
  };
  const fmtMoney = (v?: number | null, c?: string | null) =>
    `${currencySymbol(c)}${(typeof v === "number" ? v : 0).toFixed(2)}`;

  const renderOrderDetailPage = (key: string) => {
    const detail = orderDetailCache[key];
    const dErr = orderDetailError[key];
    const dLoading = orderDetailLoadingId === key;
    const order = orders.find((o) => String(o.id) === key);
    const statusLabel = order
      ? order.status.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "";
    const isPending =
      !!order &&
      (order.status.toLowerCase().includes("pending") ||
        order.status.toLowerCase() === "on-hold");
    const orderDateStr = order
      ? new Date(order.created_at).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    return (
      <div className="space-y-8 text-[#333333]">
        {order && (
          <p className="text-[18px] text-[#696969]" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
            Order #<strong className="text-[#333333]">{order.id}</strong>{"  "}was placed on{"  "}
            <strong className="text-[#333333]">{orderDateStr}</strong>{"  "}and is currently{"  "}
            <strong className="text-[#333333]">{statusLabel}</strong>.
          </p>
        )}

        {dLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : dErr ? (
          <div className="text-red-600 text-[14px]">{dErr}</div>
        ) : detail ? (
          <>
            <div style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
              <h2 className="font-baskerville text-[40px] leading-[1.2] text-[#333333] mb-8">
                Order details
              </h2>
              <div>
                <div className="grid grid-cols-[1fr_auto] gap-4 pb-6 border-b border-[#e5e5e5] text-[16px] font-bold uppercase tracking-wider text-[#333333]">
                  <div>Product</div>
                  <div>Total</div>
                </div>
                {detail.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[1fr_auto] gap-4 py-8 border-b border-[#e5e5e5]"
                  >
                    <div className="text-[16px] text-[#696969]">
                      <div>
                        {it.name.split(":")[0]} <span className="text-[#696969]">×</span> <strong className="text-[#333333]">{it.quantity}</strong>
                      </div>
                      {it.isbn && (
                        <div className="mt-2">
                          <span className="font-bold text-[#333333]">ISBN:</span> {it.isbn}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-[#696969] text-[16px]">
                      {fmtMoney(
                        it.total ?? it.subtotal ?? (it.unit_price ?? 0) * it.quantity,
                        detail.currency,
                      )}
                    </div>
                  </div>
                ))}
                {(() => {
                  const subtotal = detail.items.reduce(
                    (s, it) => s + (it.subtotal ?? (it.unit_price ?? 0) * it.quantity),
                    0,
                  );
                  return (
                    <div className="grid grid-cols-[1fr_auto] py-4 border-b border-[#e5e5e5] text-[16px]">
                      <div className="font-bold text-[#333333]">Subtotal:</div>
                      <div className="text-right text-[#696969]">
                        {fmtMoney(subtotal, detail.currency)}
                      </div>
                    </div>
                  );
                })()}
                {typeof detail.shipping_total_amount === "number" && (
                  <div className="grid grid-cols-[1fr_auto] py-4 border-b border-[#e5e5e5] text-[16px]">
                    <div className="font-bold text-[#333333]">Shipping:</div>
                    <div className="text-right text-[#696969]">
                      {fmtMoney(detail.shipping_total_amount, detail.currency)}
                    </div>
                  </div>
                )}
                {typeof detail.discount_total_amount === "number" &&
                  detail.discount_total_amount > 0 && (
                    <div className="grid grid-cols-[1fr_auto] py-4 border-b border-[#e5e5e5] text-[16px]">
                      <div className="font-bold text-[#333333]">Discount:</div>
                      <div className="text-right text-[#696969]">
                        − {fmtMoney(detail.discount_total_amount, detail.currency)}
                      </div>
                    </div>
                  )}
                {typeof detail.tax_amount === "number" && detail.tax_amount > 0 && (
                  <div className="grid grid-cols-[1fr_auto] py-4 border-b border-[#e5e5e5] text-[16px]">
                    <div className="font-bold text-[#333333]">Tax:</div>
                    <div className="text-right text-[#696969]">
                      {fmtMoney(detail.tax_amount, detail.currency)}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-[1fr_auto] py-4 border-b border-[#e5e5e5] text-[16px]">
                  <div className="font-bold text-[#333333]">Total:</div>
                  <div className="text-right text-[#696969]">
                    {fmtMoney(detail.total_amount, detail.currency)}
                  </div>
                </div>
                {detail.payment_method_title && (
                  <div className="grid grid-cols-[1fr_auto] py-4 border-b border-[#e5e5e5] text-[16px]">
                    <div className="font-bold text-[#333333]">Payment method:</div>
                    <div className="text-right text-[#696969]">
                      {detail.payment_method_title}
                    </div>
                  </div>
                )}
                {isPending && (
                  <div className="grid grid-cols-[1fr_auto] py-4 border-b border-[#e5e5e5] items-center text-[16px]">
                    <div className="font-bold text-[#333333]">Actions:</div>
                    <div className="flex gap-3 justify-end">
                      <button className="bg-[#E4573D] hover:bg-[#c94a30] text-white text-[13px] font-bold uppercase tracking-wider px-8 py-3 transition-colors">
                        Pay
                      </button>
                      <button className="bg-[#E4573D] hover:bg-[#c94a30] text-white text-[13px] font-bold uppercase tracking-wider px-8 py-3 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
              {detail.billing &&
                (detail.billing.address_1 || detail.billing.city || detail.billing.email) && (
                  <div>
                    <h2 className="font-baskerville text-[40px] leading-[1.2] text-[#333333] mb-6">
                      Billing address
                    </h2>
                    <div className="border border-[#e5e5e5] p-6 space-y-3 text-[16px] text-[#696969]">
                      {[detail.billing.first_name, detail.billing.last_name]
                        .filter(Boolean)
                        .join(" ") && (
                        <div>
                          {[detail.billing.first_name, detail.billing.last_name]
                            .filter(Boolean)
                            .join(" ")}
                        </div>
                      )}
                      {detail.billing.company && <div>{detail.billing.company}</div>}
                      {detail.billing.country && <div>{detail.billing.country}</div>}
                      {detail.billing.address_1 && <div>{detail.billing.address_1}</div>}
                      {detail.billing.address_2 && <div>{detail.billing.address_2}</div>}
                      {detail.billing.city && <div>{detail.billing.city}</div>}
                      {detail.billing.state && <div>{detail.billing.state}</div>}
                      {detail.billing.postcode && <div>{detail.billing.postcode}</div>}
                      {detail.billing.phone && (
                        <div className="pt-2 flex items-center gap-2"><Phone className="h-4 w-4" /> {detail.billing.phone}</div>
                      )}
                      {detail.billing.email && (
                        <div className="pt-2 flex items-center gap-2"><Mail className="h-4 w-4" /> {detail.billing.email}</div>
                      )}
                    </div>
                  </div>
                )}
              {detail.shipping &&
                (detail.shipping.address_1 || detail.shipping.city) && (
                  <div>
                    <h2 className="font-baskerville text-[40px] leading-[1.2] text-[#333333] mb-6">
                      Shipping address
                    </h2>
                    <div className="border border-[#e5e5e5] p-6 space-y-3 text-[16px] text-[#696969]">
                      {[detail.shipping.first_name, detail.shipping.last_name]
                        .filter(Boolean)
                        .join(" ") && (
                        <div>
                          {[detail.shipping.first_name, detail.shipping.last_name]
                            .filter(Boolean)
                            .join(" ")}
                        </div>
                      )}
                      {detail.shipping.company && <div>{detail.shipping.company}</div>}
                      {detail.shipping.country && <div>{detail.shipping.country}</div>}
                      {detail.shipping.address_1 && <div>{detail.shipping.address_1}</div>}
                      {detail.shipping.address_2 && <div>{detail.shipping.address_2}</div>}
                      {detail.shipping.city && <div>{detail.shipping.city}</div>}
                      {detail.shipping.state && <div>{detail.shipping.state}</div>}
                      {detail.shipping.postcode && <div>{detail.shipping.postcode}</div>}
                      <div className="pt-2">Phone:</div>
                      {detail.shipping.phone && (
                        <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {detail.shipping.phone}</div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </>
        ) : null}
      </div>
    );
  };

  const addressInputClass =
    "h-12 rounded-none border border-[#d9d9d9] bg-white text-[15px] text-[#333333] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#333333]";

  type AddressFormShape = typeof billingForm & Partial<typeof shippingForm>;

  const addressLabelClass =
    "uppercase text-[14px] font-bold tracking-wider text-[#333333] block mb-2";

  const renderFieldLabel = (htmlFor: string, label: string, required: boolean) => (
    <Label
      htmlFor={htmlFor}
      className={addressLabelClass}
      style={{ fontFamily: '"Nunito Sans", sans-serif' }}
    >
      {label} {required && <span className="text-[#E4573D]">*</span>}
    </Label>
  );

  const renderAddressFields = (
    form: AddressFormShape,
    setForm: (next: AddressFormShape) => void,
    showEmail: boolean,
    prefix: string,
  ) => (
    <div className="space-y-6 max-w-3xl">
      <div>
        {renderFieldLabel(`${prefix}-first`, "First Name", true)}
        <Input
          id={`${prefix}-first`}
          className={addressInputClass}
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />
      </div>
      <div>
        {renderFieldLabel(`${prefix}-last`, "Last Name", true)}
        <Input
          id={`${prefix}-last`}
          className={addressInputClass}
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />
      </div>
      <div>
        {renderFieldLabel(`${prefix}-country`, "Country / Region", true)}
        <Input
          id={`${prefix}-country`}
          className={addressInputClass}
          placeholder="e.g. GB, US"
          value={form.country}
          onChange={(e) =>
            setForm({ ...form, country: e.target.value.toUpperCase().slice(0, 2) })
          }
        />
      </div>
      <div>
        {renderFieldLabel(`${prefix}-addr1`, "Street Address", true)}
        <Input
          id={`${prefix}-addr1`}
          className={addressInputClass}
          placeholder="House number and street name"
          value={form.address_1}
          onChange={(e) => setForm({ ...form, address_1: e.target.value })}
        />
        <Input
          id={`${prefix}-addr2`}
          className={`${addressInputClass} mt-3`}
          placeholder="Apartment, suite, unit, etc. (optional)"
          value={form.address_2}
          onChange={(e) => setForm({ ...form, address_2: e.target.value })}
        />
      </div>
      <div>
        {renderFieldLabel(`${prefix}-city`, "Town / City", true)}
        <Input
          id={`${prefix}-city`}
          className={addressInputClass}
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
      </div>
      <div>
        {renderFieldLabel(`${prefix}-state`, "State / County", true)}
        <Input
          id={`${prefix}-state`}
          className={addressInputClass}
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />
      </div>
      <div>
        {renderFieldLabel(`${prefix}-postcode`, "Postcode / ZIP", true)}
        <Input
          id={`${prefix}-postcode`}
          className={addressInputClass}
          value={form.postcode}
          onChange={(e) => setForm({ ...form, postcode: e.target.value })}
        />
      </div>
      <div>
        {renderFieldLabel(
          `${prefix}-phone`,
          showEmail ? "Phone (Optional)" : "Phone",
          !showEmail,
        )}
        <Input
          id={`${prefix}-phone`}
          className={addressInputClass}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      {showEmail && "email" in form && (
        <div>
          {renderFieldLabel(`${prefix}-email`, "Email Address", true)}
          <Input
            id={`${prefix}-email`}
            type="email"
            className={addressInputClass}
            value={(form as typeof billingForm).email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value } as AddressFormShape)
            }
          />
        </div>
      )}
    </div>
  );

  const renderAddressBlock = (
    title: string,
    form: typeof billingForm,
    onEdit: () => void,
    showEmail: boolean,
  ) => {
    const fullName = [form.first_name, form.last_name].filter(Boolean).join(" ");
    const lines = [
      form.first_name,
      form.last_name,
      form.country,
      form.address_1,
      form.address_2,
      form.city,
      form.state,
      form.postcode,
    ].filter((l) => l && l.trim().length > 0);
    const isEmpty = lines.length === 0 && !form.phone && !(showEmail && form.email);
    return (
      <div className="space-y-4">
        <h2 className="font-baskerville text-[32px] leading-tight font-normal text-[#333333]">
          {title}
        </h2>
        <button
          onClick={onEdit}
          className="text-[#E4573D] hover:text-[#c94a30] text-[14px] font-bold uppercase tracking-wider transition-colors block"
          style={{ fontFamily: '"Nunito Sans", sans-serif' }}
        >
          Edit {title}
        </button>
        {isEmpty ? (
          <p
            className="text-[15px] italic text-[#696969]"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
          >
            You have not set up this type of address yet.
          </p>
        ) : (
          <div
            className="text-[15px] italic text-[#696969] space-y-1"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
          >
            {form.first_name && <p>{form.first_name}</p>}
            {form.last_name && <p>{form.last_name}</p>}
            {form.country && <p>{form.country}</p>}
            {form.address_1 && <p>{form.address_1}</p>}
            {form.address_2 && <p>{form.address_2}</p>}
            {form.city && <p>{form.city}</p>}
            {form.state && <p>{form.state}</p>}
            {form.postcode && <p>{form.postcode}</p>}
            <p>{form.phone || "Phone:"}</p>
            {showEmail && <p>{form.email}</p>}
          </div>
        )}
      </div>
    );
  };

  const renderAddresses = () => {
    if (profileLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (addressMode === "billing") {
      return (
        <div className="space-y-8">
          <h2 className="font-baskerville text-[40px] leading-tight font-normal text-[#333333]">
            Billing address
          </h2>
          {renderAddressFields(
            billingForm as AddressFormShape,
            (next) => setBillingForm(next as typeof billingForm),
            true,
            "billing",
          )}
          <Button
            onClick={async () => {
              await handleSaveBilling();
              setAddressMode("view");
            }}
            disabled={billingSaving}
            className="bg-[#E4573D] hover:bg-[#c94a30] text-white rounded-none uppercase tracking-wider font-bold text-[14px] h-12 px-8"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
          >
            {billingSaving ? "Saving..." : "Save Address"}
          </Button>
        </div>
      );
    }

    if (addressMode === "shipping") {
      return (
        <div className="space-y-8">
          <h2 className="font-baskerville text-[40px] leading-tight font-normal text-[#333333]">
            Shipping address
          </h2>
          {renderAddressFields(
            shippingForm as AddressFormShape,
            (next) => {
              const { email: _email, ...rest } = next;
              setShippingForm(rest as typeof shippingForm);
            },
            false,
            "shipping",
          )}
          <Button
            onClick={async () => {
              await handleSaveShipping();
              setAddressMode("view");
            }}
            disabled={shippingSaving}
            className="bg-[#E4573D] hover:bg-[#c94a30] text-white rounded-none uppercase tracking-wider font-bold text-[14px] h-12 px-8"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
          >
            {shippingSaving ? "Saving..." : "Save Address"}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <p
          className="text-[16px] text-[#696969]"
          style={{ fontFamily: '"Nunito Sans", sans-serif' }}
        >
          The following addresses will be used on the checkout page by default.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {renderAddressBlock(
            "Billing address",
            billingForm,
            () => setAddressMode("billing"),
            true,
          )}
          {renderAddressBlock(
            "Shipping address",
            { ...shippingForm, email: "" } as typeof billingForm,
            () => setAddressMode("shipping"),
            false,
          )}
        </div>
      </div>
    );
  };

  const renderAccount = () => {
    if (profileLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    const handleSaveAll = async () => {
      await handleSaveProfile();
      const wantsPwChange =
        pwForm.current_password ||
        pwForm.new_password ||
        pwForm.confirm_new_password;
      if (wantsPwChange) {
        await handleChangePassword();
      }
    };

    return (
      <div className="space-y-6 max-w-3xl">
        <div>
          {renderFieldLabel("acc-first", "First Name", true)}
          <Input
            id="acc-first"
            className={addressInputClass}
            value={profileForm.first_name}
            onChange={(e) =>
              setProfileForm({ ...profileForm, first_name: e.target.value })
            }
          />
        </div>
        <div>
          {renderFieldLabel("acc-last", "Last Name", true)}
          <Input
            id="acc-last"
            className={addressInputClass}
            value={profileForm.last_name}
            onChange={(e) =>
              setProfileForm({ ...profileForm, last_name: e.target.value })
            }
          />
        </div>
        <div>
          {renderFieldLabel("acc-display", "Display Name", true)}
          <Input
            id="acc-display"
            className={addressInputClass}
            value={profileForm.display_name}
            onChange={(e) =>
              setProfileForm({ ...profileForm, display_name: e.target.value })
            }
          />
          <p
            className="text-[14px] italic text-[#696969] mt-2"
            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
          >
            This will be how your name will be displayed in the account section
            and in reviews
          </p>
        </div>
        <div>
          {renderFieldLabel("acc-email", "Email Address", true)}
          <Input
            id="acc-email"
            type="email"
            className={addressInputClass}
            value={profile?.email || user.email || ""}
            disabled
          />
        </div>

        <fieldset className="border border-[#d9d9d9] px-6 pt-2 pb-6 mt-6">
          <legend
            className="px-3 text-[24px] text-[#696969] font-baskerville"
          >
            Password change
          </legend>
          <div className="space-y-6 pt-4">
            <div>
              {renderFieldLabel(
                "pw-current",
                "Current Password (leave blank to leave unchanged)",
                false,
              )}
              <Input
                id="pw-current"
                type="password"
                autoComplete="current-password"
                className={addressInputClass}
                value={pwForm.current_password}
                onChange={(e) =>
                  setPwForm({ ...pwForm, current_password: e.target.value })
                }
              />
            </div>
            <div>
              {renderFieldLabel(
                "pw-new",
                "New Password (leave blank to leave unchanged)",
                false,
              )}
              <Input
                id="pw-new"
                type="password"
                autoComplete="new-password"
                className={addressInputClass}
                value={pwForm.new_password}
                onChange={(e) =>
                  setPwForm({ ...pwForm, new_password: e.target.value })
                }
              />
            </div>
            <div>
              {renderFieldLabel("pw-confirm", "Confirm New Password", false)}
              <Input
                id="pw-confirm"
                type="password"
                autoComplete="new-password"
                className={addressInputClass}
                value={pwForm.confirm_new_password}
                onChange={(e) =>
                  setPwForm({ ...pwForm, confirm_new_password: e.target.value })
                }
              />
            </div>
          </div>
        </fieldset>

        <Button
          onClick={handleSaveAll}
          disabled={profileSaving || pwSaving}
          className="bg-[#E4573D] hover:bg-[#c94a30] text-white rounded-none uppercase tracking-wider font-bold text-[14px] h-12 px-8"
          style={{ fontFamily: '"Nunito Sans", sans-serif' }}
        >
          {profileSaving || pwSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "orders":
        return renderOrders();
      case "addresses":
        return renderAddresses();
      case "payment":
        return renderPaymentMethods();
      case "account":
        return renderAccount();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">My account</h1>
          <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Bookshop", href: "/books" }, { label: "My account" }]} />
        </div>
      </div>

      <main>
        <div className="container-wide py-12 bg-white">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12">
            <nav className="space-y-0">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === "orders") setViewingOrderId(null);
                  }}
                  style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: "14px", fontWeight: 700, padding: "15px 20px" }}
                  className={`w-full text-left border-b border-border transition-colors block ${
                    activeTab === item.id
                      ? "bg-[#E4573D] text-white border-[#E4573D]"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                style={{ fontFamily: '"Nunito Sans", sans-serif', fontSize: "14px", fontWeight: 700, padding: "15px 20px" }}
                className="w-full text-left border-b border-border transition-colors block hover:bg-secondary text-foreground"
              >
                LOG OUT
              </button>
            </nav>

            <div className="min-h-[400px]">{renderContent()}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
