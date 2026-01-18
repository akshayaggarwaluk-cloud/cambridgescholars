import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, LogOut, Camera, BookOpen, Pencil, Trash2, Loader2, MapPin, Settings, ArrowRight, Info } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CoverImageUpload } from "@/components/books/CoverImageUpload";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { categories } from "@/data/books";

interface PublishedBook {
  id: string;
  title: string;
  author: string;
  description: string | null;
  price: number;
  category: string;
  cover_image: string | null;
  created_at: string;
}

interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
}

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

type TabType = "dashboard" | "orders" | "addresses" | "account";

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", 
  "France", "India", "Japan", "Brazil", "Mexico", "Other"
];

export default function Profile() {
  const { user, isAuthenticated, logout } = useExternalAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  
  // Published books state
  const [publishedBooks, setPublishedBooks] = useState<PublishedBook[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<PublishedBook | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState<Partial<Address> | null>(null);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFullName(user.name || user.username || "");
      loadPublishedBooks();
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user && activeTab === "orders") {
      loadOrders();
    }
    if (isAuthenticated && user && activeTab === "addresses") {
      loadAddresses();
    }
  }, [activeTab, isAuthenticated, user]);

  const loadPublishedBooks = async () => {
    if (!user) return;
    setBooksLoading(true);
    try {
      const { data, error } = await supabase
        .from("published_books")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPublishedBooks(data || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error loading published books:", error);
    } finally {
      setBooksLoading(false);
    }
  };

  const loadOrders = async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error loading orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadAddresses = async () => {
    if (!user) return;
    setAddressesLoading(true);
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAddresses((data || []) as Address[]);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error loading addresses:", error);
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleEditBook = (book: PublishedBook) => {
    setEditingBook({ ...book });
    setEditDialogOpen(true);
  };

  const handleSaveBook = async () => {
    if (!editingBook) return;

    setEditSaving(true);
    try {
      const { error } = await supabase
        .from("published_books")
        .update({
          title: editingBook.title,
          author: editingBook.author,
          description: editingBook.description,
          price: editingBook.price,
          category: editingBook.category,
          cover_image: editingBook.cover_image,
        })
        .eq("id", editingBook.id);

      if (error) throw error;
      
      toast.success("Book updated successfully!");
      setEditDialogOpen(false);
      loadPublishedBooks();
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error updating book:", error);
      toast.error("Failed to update book");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const { error } = await supabase
        .from("published_books")
        .delete()
        .eq("id", bookId);

      if (error) throw error;
      
      toast.success("Book deleted successfully!");
      setPublishedBooks(prev => prev.filter(b => b.id !== bookId));
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
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
      is_default: true,
    });
    setAddressDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress({ ...address });
    setAddressDialogOpen(true);
  };

  const handleSaveAddress = async () => {
    if (!editingAddress || !user) return;

    // Validate required fields
    if (!editingAddress.first_name || !editingAddress.last_name || 
        !editingAddress.country || !editingAddress.street_address || 
        !editingAddress.city || !editingAddress.state || 
        !editingAddress.postcode || !editingAddress.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setAddressSaving(true);
    try {
      if (editingAddress.id) {
        // Update existing
        const { error } = await supabase
          .from("addresses")
          .update({
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
          })
          .eq("id", editingAddress.id);

        if (error) throw error;
        toast.success("Address updated successfully!");
      } else {
        // Create new
        const { error } = await supabase
          .from("addresses")
          .insert({
            user_id: user.id,
            address_type: editingAddress.address_type,
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
          });

        if (error) throw error;
        toast.success("Address saved successfully!");
      }

      setAddressDialogOpen(false);
      loadAddresses();
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setAddressSaving(false);
    }
  };

  const handleSignOut = async () => {
    logout();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const sidebarItems = [
    { id: "dashboard" as TabType, label: "DASHBOARD", icon: User },
    { id: "orders" as TabType, label: "ORDERS", icon: Package },
    { id: "addresses" as TabType, label: "ADDRESSES", icon: MapPin },
    { id: "account" as TabType, label: "ACCOUNT DETAILS", icon: Settings },
  ];

  const displayName = user?.name || user?.username || "User";

  if (!isAuthenticated) {
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

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <p className="text-foreground text-lg">
          Hello <span className="font-semibold">{displayName}</span>{" "}
          <span className="text-muted-foreground">
            (not {displayName}?{" "}
            <button 
              onClick={handleSignOut}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              Log out
            </button>
            )
          </span>
        </p>
      </div>

      {/* Dashboard Description */}
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
          onClick={() => setActiveTab("account")}
          className="text-red-500 hover:text-red-600 transition-colors"
        >
          edit your password and account details
        </button>
        .
      </p>

      {/* My Published Books */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" />
            My Published Books
          </h3>
          <Button asChild variant="gold" size="sm">
            <Link to="/publish">Publish New Book</Link>
          </Button>
        </div>

        {booksLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : publishedBooks.length === 0 ? (
          <div className="text-center py-8 bg-secondary/30 rounded-lg">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">You haven't published any books yet.</p>
            <Button asChild variant="outline">
              <Link to="/publish">Publish Your First Book</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {publishedBooks.map((book) => (
              <div
                key={book.id}
                className="flex gap-4 p-4 bg-secondary/50 rounded-lg"
              >
                <img
                  src={book.cover_image || "/placeholder.svg"}
                  alt={book.title}
                  className="w-16 h-24 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{book.title}</h4>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <p className="text-sm text-accent font-medium mt-1">${book.price.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{book.category}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBook(book)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Book</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{book.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteBook(book.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderOrdersContent = () => {
    const billingAddress = addresses.find(a => a.address_type === 'billing');
    const shippingAddress = addresses.find(a => a.address_type === 'shipping');

    return (
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
                    <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
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
  };

  const renderAddressesContent = () => {
    const billingAddress = addresses.find(a => a.address_type === 'billing');
    const shippingAddress = addresses.find(a => a.address_type === 'shipping');

    return (
      <div className="space-y-6">
        <p className="text-muted-foreground">
          The following addresses will be used on the checkout page by default.
        </p>
        
        {addressesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Billing Address */}
            <div>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">Billing address</h3>
              {billingAddress ? (
                <div className="space-y-2">
                  <p>{billingAddress.first_name} {billingAddress.last_name}</p>
                  {billingAddress.company && <p>{billingAddress.company}</p>}
                  <p>{billingAddress.street_address}</p>
                  {billingAddress.street_address_2 && <p>{billingAddress.street_address_2}</p>}
                  <p>{billingAddress.city}, {billingAddress.state} {billingAddress.postcode}</p>
                  <p>{billingAddress.country}</p>
                  <p>{billingAddress.phone}</p>
                  <button
                    onClick={() => handleEditAddress(billingAddress)}
                    className="text-red-500 hover:text-red-600 transition-colors mt-2 uppercase text-sm font-medium"
                  >
                    Edit Billing Address
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => handleAddAddress('billing')}
                    className="text-red-500 hover:text-red-600 transition-colors uppercase text-sm font-medium"
                  >
                    Add Billing Address
                  </button>
                  <p className="text-muted-foreground text-sm mt-2">
                    You have not set up this type of address yet.
                  </p>
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">Shipping address</h3>
              {shippingAddress ? (
                <div className="space-y-2">
                  <p>{shippingAddress.first_name} {shippingAddress.last_name}</p>
                  {shippingAddress.company && <p>{shippingAddress.company}</p>}
                  <p>{shippingAddress.street_address}</p>
                  {shippingAddress.street_address_2 && <p>{shippingAddress.street_address_2}</p>}
                  <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postcode}</p>
                  <p>{shippingAddress.country}</p>
                  <p>{shippingAddress.phone}</p>
                  <button
                    onClick={() => handleEditAddress(shippingAddress)}
                    className="text-red-500 hover:text-red-600 transition-colors mt-2 uppercase text-sm font-medium"
                  >
                    Edit Shipping Address
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => handleAddAddress('shipping')}
                    className="text-red-500 hover:text-red-600 transition-colors uppercase text-sm font-medium"
                  >
                    Add Shipping Address
                  </button>
                  <p className="text-muted-foreground text-sm mt-2">
                    You have not set up this type of address yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAccountContent = () => (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
        </div>
      ) : (
        <div className="space-y-6 max-w-2xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="uppercase text-xs font-medium">First Name *</Label>
              <Input
                id="firstName"
                defaultValue=""
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="uppercase text-xs font-medium">Last Name *</Label>
              <Input
                id="lastName"
                defaultValue=""
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName" className="uppercase text-xs font-medium">Display Name *</Label>
            <Input
              id="displayName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter display name"
            />
            <p className="text-xs text-muted-foreground italic">
              This will be how your name will be displayed in the account section and in reviews
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="uppercase text-xs font-medium">Email Address *</Label>
            <Input 
              id="email"
              value={user?.email || ""} 
              disabled 
            />
          </div>

          {/* Password Change Section */}
          <fieldset className="border rounded-lg p-6 space-y-4">
            <legend className="text-lg font-serif px-2">Password change</legend>
            
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="uppercase text-xs font-medium">
                Current Password (leave blank to leave unchanged)
              </Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="uppercase text-xs font-medium">
                New Password (leave blank to leave unchanged)
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="uppercase text-xs font-medium">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder=""
              />
            </div>
          </fieldset>

          <Button
            variant="gold"
            onClick={handleSave}
            disabled={saving}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {saving ? "Saving..." : "SAVE CHANGES"}
          </Button>
        </div>
      )}
    </div>
  );

  const handleSave = async () => {
    setSaving(true);
    // Save logic would go here for external API
    setTimeout(() => {
      toast.success("Profile updated successfully!");
      setSaving(false);
    }, 500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardContent();
      case "orders":
        return renderOrdersContent();
      case "addresses":
        return renderAddressesContent();
      case "account":
        return renderAccountContent();
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24">
        {/* Dark Header Section */}
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container-wide">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-4xl font-bold">My account</h1>
              <nav className="text-sm">
                <Link to="/" className="hover:text-accent transition-colors">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/books" className="hover:text-accent transition-colors">Bookshop</Link>
                <span className="mx-2">/</span>
                <span className="text-red-500">My account</span>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-wide py-12">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12">
            {/* Sidebar Navigation */}
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
                onClick={handleSignOut}
                className="w-full text-left px-4 py-4 border-b border-border transition-colors flex items-center gap-3 hover:bg-secondary text-foreground"
              >
                <LogOut className="h-4 w-4" />
                LOG OUT
              </button>
            </nav>

            {/* Content Area */}
            <div className="min-h-[400px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Book Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          {editingBook && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-author">Author</Label>
                <Input
                  id="edit-author"
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingBook.description || ""}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price ($)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingBook.price}
                    onChange={(e) => setEditingBook({ ...editingBook, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={editingBook.category}
                    onValueChange={(value) => setEditingBook({ ...editingBook, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <CoverImageUpload
                  userId={user?.id || ""}
                  value={editingBook.cover_image || ""}
                  onChange={(url) => setEditingBook({ ...editingBook, cover_image: url })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={handleSaveBook} disabled={editSaving}>
              {editSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Address Dialog */}
      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingAddress?.address_type === 'billing' ? 'Billing' : 'Shipping'} address
            </DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addr-firstName" className="uppercase text-xs font-medium">First Name *</Label>
                <Input
                  id="addr-firstName"
                  value={editingAddress.first_name || ""}
                  onChange={(e) => setEditingAddress({ ...editingAddress, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addr-lastName" className="uppercase text-xs font-medium">Last Name *</Label>
                <Input
                  id="addr-lastName"
                  value={editingAddress.last_name || ""}
                  onChange={(e) => setEditingAddress({ ...editingAddress, last_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addr-country" className="uppercase text-xs font-medium">Country / Region *</Label>
                <Select
                  value={editingAddress.country || ""}
                  onValueChange={(value) => setEditingAddress({ ...editingAddress, country: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country / region..." />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="addr-street" className="uppercase text-xs font-medium">Street Address *</Label>
                <Input
                  id="addr-street"
                  value={editingAddress.street_address || ""}
                  onChange={(e) => setEditingAddress({ ...editingAddress, street_address: e.target.value })}
                  placeholder="House number and street name"
                />
                <Input
                  id="addr-street2"
                  value={editingAddress.street_address_2 || ""}
                  onChange={(e) => setEditingAddress({ ...editingAddress, street_address_2: e.target.value })}
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addr-city" className="uppercase text-xs font-medium">Town / City *</Label>
                <Input
                  id="addr-city"
                  value={editingAddress.city || ""}
                  onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addr-state" className="uppercase text-xs font-medium">State / County *</Label>
                <Input
                  id="addr-state"
                  value={editingAddress.state || ""}
                  onChange={(e) => setEditingAddress({ ...editingAddress, state: e.target.value })}
                  placeholder="Select an option..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addr-postcode" className="uppercase text-xs font-medium">Postcode / ZIP *</Label>
                <Input
                  id="addr-postcode"
                  value={editingAddress.postcode || ""}
                  onChange={(e) => setEditingAddress({ ...editingAddress, postcode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addr-phone" className="uppercase text-xs font-medium">Phone *</Label>
                <Input
                  id="addr-phone"
                  value={editingAddress.phone || ""}
                  onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddressDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveAddress} 
              disabled={addressSaving}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {addressSaving ? "Saving..." : "SAVE ADDRESS"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
