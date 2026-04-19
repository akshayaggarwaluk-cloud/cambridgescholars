import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  LogOut,
  Package,
  MapPin,
  Settings,
  Loader2,
  Info,
  ArrowRight,
  KeyRound,
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
  type AccountProfile,
  type ProfileUpdatePayload,
} from "@/services/accountService";

type TabType = "dashboard" | "orders" | "addresses" | "account" | "password";

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
        total: o.total_amount,
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
      <div className="min-h-screen bg-background">
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
    { id: "account", label: "ACCOUNT DETAILS", icon: Settings },
    { id: "password", label: "CHANGE PASSWORD", icon: KeyRound },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <p className="text-foreground text-lg">
        Hello <span className="font-semibold">{displayName}</span>{" "}
        <span className="text-muted-foreground">
          (not {displayName}?{" "}
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            Log out
          </button>
          )
        </span>
      </p>
      <p className="text-muted-foreground">
        From your account dashboard you can view your{" "}
        <button
          onClick={() => setActiveTab("orders")}
          className="text-red-500 hover:text-red-600 transition-colors"
        >
          recent orders
        </button>
        , manage your{" "}
        <button
          onClick={() => setActiveTab("addresses")}
          className="text-red-500 hover:text-red-600 transition-colors"
        >
          shipping and billing addresses
        </button>
        , and{" "}
        <button
          onClick={() => setActiveTab("password")}
          className="text-red-500 hover:text-red-600 transition-colors"
        >
          edit your password and account details
        </button>
        .
      </p>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      {ordersLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Order #{String(order.id).slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="font-semibold mt-1">${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const addressInputClass = "h-12 border-border bg-background";

  type AddressFormShape = typeof billingForm & Partial<typeof shippingForm>;

  const renderAddressFields = (
    form: AddressFormShape,
    setForm: (next: AddressFormShape) => void,
    showEmail: boolean,
    prefix: string
  ) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-first`} className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
          First Name
        </Label>
        <Input
          id={`${prefix}-first`}
          className={addressInputClass}
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-last`} className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
          Last Name
        </Label>
        <Input
          id={`${prefix}-last`}
          className={addressInputClass}
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={`${prefix}-company`} className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
          Company (optional)
        </Label>
        <Input
          id={`${prefix}-company`}
          className={addressInputClass}
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={`${prefix}-addr1`} className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
          Street Address
        </Label>
        <Input
          id={`${prefix}-addr1`}
          className={addressInputClass}
          placeholder="House number and street name"
          value={form.address_1}
          onChange={(e) => setForm({ ...form, address_1: e.target.value })}
        />
        <Input
          id={`${prefix}-addr2`}
          className={`${addressInputClass} mt-2`}
          placeholder="Apartment, suite, unit, etc. (optional)"
          value={form.address_2}
          onChange={(e) => setForm({ ...form, address_2: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-city`} className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
          Town / City
        </Label>
        <Input
          id={`${prefix}-city`}
          className={addressInputClass}
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-state`} className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
          State / County
        </Label>
        <Input
          id={`${prefix}-state`}
          className={addressInputClass}
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-postcode`} className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
          Postcode / ZIP
        </Label>
        <Input
          id={`${prefix}-postcode`}
          className={addressInputClass}
          value={form.postcode}
          onChange={(e) => setForm({ ...form, postcode: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-country`} className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
          Country (ISO code)
        </Label>
        <Input
          id={`${prefix}-country`}
          className={addressInputClass}
          placeholder="e.g. GB, US"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value.toUpperCase().slice(0, 2) })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-phone`} className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
          Phone
        </Label>
        <Input
          id={`${prefix}-phone`}
          className={addressInputClass}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      {showEmail && "email" in form && (
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${prefix}-email`} className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
            Billing Email
          </Label>
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

  const renderAddresses = () => (
    <div className="space-y-12">
      {profileLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-foreground">Billing address</h2>
            {renderAddressFields(
              billingForm as AddressFormShape,
              (next) => setBillingForm(next as typeof billingForm),
              true,
              "billing"
            )}
            <Button
              onClick={handleSaveBilling}
              disabled={billingSaving}
              className="bg-red-500 hover:bg-red-600 text-white rounded-none uppercase tracking-wider"
            >
              {billingSaving ? "Saving..." : "Save Billing Address"}
            </Button>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-foreground">Shipping address</h2>
            {renderAddressFields(
              shippingForm as AddressFormShape,
              (next) => {
                const { email: _email, ...rest } = next;
                setShippingForm(rest as typeof shippingForm);
              },
              false,
              "shipping"
            )}
            <Button
              onClick={handleSaveShipping}
              disabled={shippingSaving}
              className="bg-red-500 hover:bg-red-600 text-white rounded-none uppercase tracking-wider"
            >
              {shippingSaving ? "Saving..." : "Save Shipping Address"}
            </Button>
          </section>
        </>
      )}
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-semibold text-foreground">Account Details</h2>

      <div className="space-y-1">
        <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground flex items-center gap-1">
          <Mail className="h-3 w-3" />
          Email Address
        </p>
        <p className="text-foreground bg-secondary px-3 py-2 rounded">
          {profile?.email || user.email || "—"}
        </p>
      </div>

      {profileLoading ? (
        <div className="flex items-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="acc-first" className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
              First Name
            </Label>
            <Input
              id="acc-first"
              className={addressInputClass}
              value={profileForm.first_name}
              onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="acc-last" className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
              Last Name
            </Label>
            <Input
              id="acc-last"
              className={addressInputClass}
              value={profileForm.last_name}
              onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="acc-display" className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
              Display Name
            </Label>
            <Input
              id="acc-display"
              className={addressInputClass}
              value={profileForm.display_name}
              onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="acc-phone" className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
              Phone
            </Label>
            <Input
              id="acc-phone"
              className={addressInputClass}
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              onClick={handleSaveProfile}
              disabled={profileSaving}
              className="bg-red-500 hover:bg-red-600 text-white rounded-none uppercase tracking-wider"
            >
              {profileSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderPassword = () => (
    <div className="space-y-6 max-w-xl">
      <h2 className="font-serif text-2xl font-semibold text-foreground">Change Password</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pw-current" className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
            Current Password
          </Label>
          <Input
            id="pw-current"
            type="password"
            autoComplete="current-password"
            className={addressInputClass}
            value={pwForm.current_password}
            onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pw-new" className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
            New Password
          </Label>
          <Input
            id="pw-new"
            type="password"
            autoComplete="new-password"
            className={addressInputClass}
            value={pwForm.new_password}
            onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">Must be at least 8 characters.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pw-confirm" className="uppercase text-xs font-medium tracking-wider text-muted-foreground">
            Confirm New Password
          </Label>
          <Input
            id="pw-confirm"
            type="password"
            autoComplete="new-password"
            className={addressInputClass}
            value={pwForm.confirm_new_password}
            onChange={(e) => setPwForm({ ...pwForm, confirm_new_password: e.target.value })}
          />
        </div>
        <Button
          onClick={handleChangePassword}
          disabled={pwSaving}
          className="bg-red-500 hover:bg-red-600 text-white rounded-none uppercase tracking-wider"
        >
          {pwSaving ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "orders":
        return renderOrders();
      case "addresses":
        return renderAddresses();
      case "account":
        return renderAccount();
      case "password":
        return renderPassword();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-[#f4f3ec] pt-28 sm:pt-32 pb-10 sm:pb-14 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-4xl sm:text-5xl font-serif text-gray-800">My Account</h1>
          <PageBreadcrumb items={[{ label: "Bookshop", href: "/books" }]} currentPage="My Account" />
        </div>
      </div>

      <main>
        <div className="container-wide py-12">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12">
            <nav className="space-y-0">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-4 border-b border-border transition-colors flex items-center gap-3 font-nav font-medium ${
                    activeTab === item.id
                      ? "bg-red-500 text-white border-red-500"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-4 border-b border-border transition-colors flex items-center gap-3 hover:bg-secondary text-foreground font-nav font-medium"
              >
                <LogOut className="h-4 w-4" />
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
