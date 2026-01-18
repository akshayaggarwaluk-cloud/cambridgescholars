import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, LogOut, Package, MapPin, Settings, ShoppingBag, Heart, BookOpen, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import { toast } from "sonner";

type TabType = "dashboard" | "orders" | "addresses" | "account";

export default function ExternalProfile() {
  const { user, isAuthenticated, logout } = useExternalAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  const handleLogout = () => {
    logout();
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
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Sign in to view profile</h1>
            <p className="text-muted-foreground mb-8">Please sign in to access your profile settings.</p>
            <Button asChild variant="gold" size="lg">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayName = user.name || user.username || user.email?.split("@")[0] || "User";

  const sidebarItems = [
    { id: "dashboard" as TabType, label: "DASHBOARD", icon: User },
    { id: "orders" as TabType, label: "ORDERS", icon: Package },
    { id: "addresses" as TabType, label: "ADDRESSES", icon: MapPin },
    { id: "account" as TabType, label: "ACCOUNT DETAILS", icon: Settings },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <p className="text-foreground text-lg">
        Hello <span className="font-semibold">{displayName}</span>{" "}
        <span className="text-muted-foreground">
          (not {displayName}?{" "}
          <button onClick={handleLogout} className="text-red-500 hover:text-red-600 transition-colors">
            Log out
          </button>
          )
        </span>
      </p>

      <p className="text-muted-foreground">
        From your account dashboard you can view your{" "}
        <button onClick={() => setActiveTab("orders")} className="text-red-500 hover:text-red-600 transition-colors">
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
        <button onClick={() => setActiveTab("account")} className="text-red-500 hover:text-red-600 transition-colors">
          edit your password and account details
        </button>
        .
      </p>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-semibold text-foreground">Orders</h2>
      <p className="text-muted-foreground">View and track your order history.</p>
      <Button asChild variant="gold">
        <Link to="/orders">View All Orders</Link>
      </Button>
    </div>
  );

  const renderAddresses = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-semibold text-foreground">Addresses</h2>
      <p className="text-muted-foreground">The following addresses will be used on the checkout page by default.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">Billing Address</h3>
          <p className="text-muted-foreground text-sm">You have not set up this type of address yet.</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">Shipping Address</h3>
          <p className="text-muted-foreground text-sm">You have not set up this type of address yet.</p>
        </div>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-semibold text-foreground">Account Details</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground">User ID</p>
            <p className="text-foreground font-mono text-sm bg-secondary px-3 py-2 rounded">{user.id || "—"}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Username</p>
            <p className="text-foreground bg-secondary px-3 py-2 rounded">{user.username || "—"}</p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              Email Address
            </p>
            <p className="text-foreground bg-secondary px-3 py-2 rounded">{user.email || "—"}</p>
          </div>

          {user.name && (
            <div className="space-y-1 md:col-span-2">
              <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Full Name</p>
              <p className="text-foreground bg-secondary px-3 py-2 rounded">{user.name}</p>
            </div>
          )}
        </div>

        <div className="pt-2">
          <Button asChild variant="outline">
            <Link to="/set-password">Change Password</Link>
          </Button>
        </div>
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
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24">
        {/* Header Banner */}
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container-wide">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-4xl font-bold">My account</h1>
              <nav className="text-sm">
                <Link to="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link to="/books" className="hover:text-accent transition-colors">
                  Bookshop
                </Link>
                <span className="mx-2">/</span>
                <span className="text-red-500">My account</span>
              </nav>
            </div>
          </div>
        </div>

        <div className="container-wide py-12">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12">
            {/* Sidebar */}
            <nav className="space-y-0">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-4 border-b border-border transition-colors flex items-center gap-3 ${
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
                className="w-full text-left px-4 py-4 border-b border-border transition-colors flex items-center gap-3 hover:bg-secondary text-foreground"
              >
                <LogOut className="h-4 w-4" />
                LOG OUT
              </button>
            </nav>

            {/* Content */}
            <div className="min-h-[400px]">{renderContent()}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
