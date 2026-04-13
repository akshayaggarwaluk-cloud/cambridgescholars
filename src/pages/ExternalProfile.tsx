import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, LogOut, Package, MapPin, Settings, Loader2, Info, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { listAddresses, createAddress, updateAddress, Address as AddressType, AddressInput } from "@/services/addressService";
type TabType = "dashboard" | "orders" | "addresses" | "account";
interface Address {
  id: string;
  address_type: 'billing' | 'shipping';
  first_name: string;
  last_name: string;
  company: string | null;
  country: string;
  street_address: string;
  street_address_2: string | null;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  is_default: boolean;
}
interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
}
const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "India", "Japan", "Brazil", "Mexico", "Other"];
const STATES = ["Alabama", "Alaska", "Arizona", "California", "Colorado", "Florida", "Georgia", "Illinois", "New York", "Texas", "Washington", "Haryana", "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Other"];
export default function ExternalProfile() {
  const {
    user,
    isAuthenticated,
    logout
  } = useExternalAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState<Partial<Address> | null>(null);
  const [addressFormMode, setAddressFormMode] = useState<'view' | 'billing' | 'shipping'>('view');
  const [addressSaving, setAddressSaving] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  useEffect(() => {
    if (isAuthenticated && user && activeTab === "addresses") {
      loadAddresses();
    }
    if (isAuthenticated && user && activeTab === "orders") {
      loadOrders();
    }
  }, [activeTab, isAuthenticated, user]);
  const loadAddresses = async () => {
    if (!user) return;
    setAddressesLoading(true);
    try {
      const result = await listAddresses(user.id);
      if (result.error) {
        if (import.meta.env.DEV) console.error("Error loading addresses:", result.error);
        return;
      }
      setAddresses((result.data || []) as Address[]);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error loading addresses:", error);
    } finally {
      setAddressesLoading(false);
    }
  };
  const loadOrders = async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from("orders").select("id, status, total, created_at").eq("user_id", user.id).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error loading orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };
  const handleAddAddress = (type: 'billing' | 'shipping') => {
    setEditingAddress({
      address_type: type,
      first_name: "",
      last_name: "",
      company: "",
      country: "",
      street_address: "",
      street_address_2: "",
      city: "",
      state: "",
      postcode: "",
      phone: "",
      is_default: true
    });
    setAddressFormMode(type);
  };
  const handleEditAddress = (address: Address) => {
    setEditingAddress({
      ...address
    });
    setAddressFormMode(address.address_type as 'billing' | 'shipping');
  };
  const handleCancelAddressForm = () => {
    setEditingAddress(null);
    setAddressFormMode('view');
  };
  const handleSaveAddress = async () => {
    if (!editingAddress || !user) return;

    // Validate required fields
    if (!editingAddress.first_name || !editingAddress.last_name || !editingAddress.country || !editingAddress.street_address || !editingAddress.city || !editingAddress.state || !editingAddress.postcode || !editingAddress.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    setAddressSaving(true);
    try {
      const addressInput: AddressInput = {
        address_type: editingAddress.address_type as 'billing' | 'shipping',
        first_name: editingAddress.first_name,
        last_name: editingAddress.last_name,
        company: editingAddress.company || null,
        country: editingAddress.country,
        street_address: editingAddress.street_address,
        street_address_2: editingAddress.street_address_2 || null,
        city: editingAddress.city,
        state: editingAddress.state,
        postcode: editingAddress.postcode,
        phone: editingAddress.phone,
        is_default: true,
      };

      if (editingAddress.id) {
        // Update existing
        const result = await updateAddress(user.id, editingAddress.id, addressInput);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Address updated successfully!");
      } else {
        // Create new
        const result = await createAddress(user.id, addressInput);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Address saved successfully!");
      }
      setAddressFormMode('view');
      setEditingAddress(null);
      loadAddresses();
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setAddressSaving(false);
    }
  };
  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    navigate("/");
  };
  if (!isAuthenticated || !user) {
    return <div className="min-h-screen bg-background">
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
      </div>;
  }
  const displayName = user.name || user.username || user.email?.split("@")[0] || "User";
  const sidebarItems = [{
    id: "dashboard" as TabType,
    label: "DASHBOARD",
    icon: User
  }, {
    id: "orders" as TabType,
    label: "ORDERS",
    icon: Package
  }, {
    id: "addresses" as TabType,
    label: "ADDRESSES",
    icon: MapPin
  }, {
    id: "account" as TabType,
    label: "ACCOUNT DETAILS",
    icon: Settings
  }];
  const renderDashboard = () => <div className="space-y-6">
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
        <button onClick={() => setActiveTab("addresses")} className="text-red-500 hover:text-red-600 transition-colors">
          shipping and billing addresses
        </button>
        , and{" "}
        <button onClick={() => setActiveTab("account")} className="text-red-500 hover:text-red-600 transition-colors">
          edit your password and account details
        </button>
        .
      </p>
    </div>;
  const renderOrders = () => <div className="space-y-6">
      {ordersLoading ? <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div> : orders.length === 0 ? <div className="bg-teal-600 text-white p-4 rounded flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5" />
            <span>No order has been made yet.</span>
          </div>
          <Link to="/books" className="flex items-center gap-2 hover:underline">
            Browse products <ArrowRight className="h-4 w-4" />
          </Link>
        </div> : <div className="space-y-4">
          {orders.map(order => <div key={order.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${order.status === 'completed' ? 'bg-green-100 text-green-800' : order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.status}
                  </span>
                  <p className="font-semibold mt-1">${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>)}
        </div>}
    </div>;
  const renderAddressForm = () => {
    if (!editingAddress) return null;
    const title = `${editingAddress.address_type === 'billing' ? 'Billing' : 'Shipping'} address`;
    return <div className="space-y-6">
        <h2 className="font-serif text-3xl font-semibold text-foreground">{title}</h2>
        
        <div className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="addr-firstName" className="uppercase text-xs font-medium">First Name *</Label>
            <Input id="addr-firstName" value={editingAddress.first_name || ""} onChange={e => setEditingAddress({
            ...editingAddress,
            first_name: e.target.value
          })} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="addr-lastName" className="uppercase text-xs font-medium">Last Name *</Label>
            <Input id="addr-lastName" value={editingAddress.last_name || ""} onChange={e => setEditingAddress({
            ...editingAddress,
            last_name: e.target.value
          })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addr-company" className="uppercase text-xs font-medium">Company Name (optional)</Label>
            <Input id="addr-company" value={editingAddress.company || ""} onChange={e => setEditingAddress({
            ...editingAddress,
            company: e.target.value
          })} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="addr-country" className="uppercase text-xs font-medium">Country / Region *</Label>
            <Select value={editingAddress.country || ""} onValueChange={value => setEditingAddress({
            ...editingAddress,
            country: value
          })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a country / region..." />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map(country => <SelectItem key={country} value={country}>{country}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="addr-street" className="uppercase text-xs font-medium">Street Address *</Label>
            <Input id="addr-street" value={editingAddress.street_address || ""} onChange={e => setEditingAddress({
            ...editingAddress,
            street_address: e.target.value
          })} placeholder="House number and street name" />
            <Input id="addr-street2" value={editingAddress.street_address_2 || ""} onChange={e => setEditingAddress({
            ...editingAddress,
            street_address_2: e.target.value
          })} placeholder="Apartment, suite, unit, etc. (optional)" className="mt-2" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="addr-city" className="uppercase text-xs font-medium">Town / City *</Label>
            <Input id="addr-city" value={editingAddress.city || ""} onChange={e => setEditingAddress({
            ...editingAddress,
            city: e.target.value
          })} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="addr-state" className="uppercase text-xs font-medium">State / County *</Label>
            <Select value={editingAddress.state || ""} onValueChange={value => setEditingAddress({
            ...editingAddress,
            state: value
          })}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                {STATES.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="addr-postcode" className="uppercase text-xs font-medium">Postcode / ZIP *</Label>
            <Input id="addr-postcode" value={editingAddress.postcode || ""} onChange={e => setEditingAddress({
            ...editingAddress,
            postcode: e.target.value
          })} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="addr-phone" className="uppercase text-xs font-medium">Phone *</Label>
            <Input id="addr-phone" value={editingAddress.phone || ""} onChange={e => setEditingAddress({
            ...editingAddress,
            phone: e.target.value
          })} />
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleSaveAddress} disabled={addressSaving} className="bg-red-500 hover:bg-red-600 text-white">
              {addressSaving ? "Saving..." : "SAVE ADDRESS"}
            </Button>
            <Button variant="outline" onClick={handleCancelAddressForm}>
              Cancel
            </Button>
          </div>
        </div>
      </div>;
  };
  const renderAddresses = () => {
    // If we're in form mode, show the form
    if (addressFormMode !== 'view' && editingAddress) {
      return renderAddressForm();
    }
    const billingAddress = addresses.find(a => a.address_type === 'billing');
    const shippingAddress = addresses.find(a => a.address_type === 'shipping');
    return <div className="space-y-6">
        <p className="text-muted-foreground">
          The following addresses will be used on the checkout page by default.
        </p>
        
        {addressesLoading ? <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div> : <div className="grid md:grid-cols-2 gap-8">
            {/* Billing Address */}
            <div>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">Billing address</h3>
              {billingAddress ? <div className="space-y-1 text-muted-foreground">
                  <button onClick={() => handleEditAddress(billingAddress)} className="text-red-500 hover:text-red-600 transition-colors uppercase text-sm font-medium mb-4 block">
                    Edit Billing Address
                  </button>
                  <p>{billingAddress.first_name}</p>
                  <p>{billingAddress.last_name}</p>
                  {billingAddress.company && <p>{billingAddress.company}</p>}
                  <p>{billingAddress.country}</p>
                  <p>{billingAddress.street_address}</p>
                  {billingAddress.street_address_2 && <p>{billingAddress.street_address_2}</p>}
                  <p>{billingAddress.city}</p>
                  <p>{billingAddress.state}</p>
                  <p>{billingAddress.postcode}</p>
                  <p>{billingAddress.phone}</p>
                  <p>{user?.email}</p>
                </div> : <div>
                  <button onClick={() => handleAddAddress('billing')} className="text-red-500 hover:text-red-600 transition-colors uppercase text-sm font-medium">
                    Add Billing Address
                  </button>
                  <p className="text-muted-foreground text-sm mt-2">
                    You have not set up this type of address yet.
                  </p>
                </div>}
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">Shipping address</h3>
              {shippingAddress ? <div className="space-y-1 text-muted-foreground">
                  <button onClick={() => handleEditAddress(shippingAddress)} className="text-red-500 hover:text-red-600 transition-colors uppercase text-sm font-medium mb-4 block">
                    Edit Shipping Address
                  </button>
                  <p>{shippingAddress.first_name}</p>
                  <p>{shippingAddress.last_name}</p>
                  {shippingAddress.company && <p>{shippingAddress.company}</p>}
                  <p>{shippingAddress.country}</p>
                  <p>{shippingAddress.street_address}</p>
                  {shippingAddress.street_address_2 && <p>{shippingAddress.street_address_2}</p>}
                  <p>{shippingAddress.city}</p>
                  <p>{shippingAddress.state}</p>
                  <p>{shippingAddress.postcode}</p>
                  <p>{shippingAddress.phone}</p>
                  <p>{user?.email}</p>
                </div> : <div>
                  <button onClick={() => handleAddAddress('shipping')} className="text-red-500 hover:text-red-600 transition-colors uppercase text-sm font-medium">
                    Add Shipping Address
                  </button>
                  <p className="text-muted-foreground text-sm mt-2">
                    You have not set up this type of address yet.
                  </p>
                </div>}
            </div>
          </div>}
      </div>;
  };
  const renderAccount = () => <div className="space-y-6">
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

          {user.name && <div className="space-y-1 md:col-span-2">
              <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground">Full Name</p>
              <p className="text-foreground bg-secondary px-3 py-2 rounded">{user.name}</p>
            </div>}
        </div>

        <div className="pt-2">
          <Button asChild variant="outline">
            <Link to="/set-password">Change Password</Link>
          </Button>
        </div>
      </div>
    </div>;
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
  return <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-[#f4f3ec] pt-28 sm:pt-32 pb-10 sm:pb-14 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-serif text-gray-800 mb-3">My Account</h1>
          <PageBreadcrumb items={[{ label: "Bookshop", href: "/books" }]} currentPage="My Account" />
        </div>
      </div>

      <main>

        <div className="container-wide py-12">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12">
            {/* Sidebar */}
            <nav className="space-y-0">
              {sidebarItems.map(item => <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-left px-4 py-4 border-b border-border transition-colors flex items-center gap-3 ${activeTab === item.id ? "bg-red-500 text-white border-red-500" : "hover:bg-secondary text-foreground"}`}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>)}
              <button onClick={handleLogout} className="w-full text-left px-4 py-4 border-b border-border transition-colors flex items-center gap-3 hover:bg-secondary text-foreground">
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
    </div>;
}