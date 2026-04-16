import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Calendar, ShoppingBag, ArrowRight, Info } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  book_title: string;
  book_author: string;
  book_image: string | null;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
  order_items: OrderItem[];
}

export default function Orders() {
  const { user, isAuthenticated } = useExternalAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadOrders();
    }
  }, [isAuthenticated, user]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-muted text-muted-foreground";
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

      <div className="bg-[#f4f3ec] pt-28 sm:pt-32 pb-10 sm:pb-14 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-4xl sm:text-5xl font-serif text-gray-800">Order History</h1>
          <PageBreadcrumb currentPage="Orders" />
        </div>
      </div>

      <main className="pb-16">
        <div className="container-wide py-8">

          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading orders...</p>
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
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card rounded-xl shadow-card overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground">Order ID</p>
                          <p className="font-mono text-sm text-foreground">
                            {order.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        <span className="font-serif text-lg font-bold text-foreground">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-3 bg-secondary rounded-lg"
                        >
                          {item.book_image && (
                            <img
                              src={item.book_image}
                              alt={item.book_title}
                              className="w-12 h-16 object-cover rounded"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground text-sm line-clamp-1">
                              {item.book_title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.book_author}
                            </p>
                            <p className="text-sm text-foreground mt-1">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
