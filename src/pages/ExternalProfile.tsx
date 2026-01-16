import { Link, useNavigate } from "react-router-dom";
import { User, Mail, LogOut, ShoppingBag, Heart, BookOpen, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import { toast } from "sonner";

export default function ExternalProfile() {
  const { user, isAuthenticated, logout } = useExternalAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container-wide max-w-4xl">
          {/* Breadcrumb */}
          <div className="pb-4">
            <PageBreadcrumb currentPage="Profile" />
          </div>

          <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
            My Profile
          </h1>

          <div className="grid gap-6">
            {/* Profile Overview Card */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                      <User className="h-10 w-10 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-serif">
                      {user.name || user.username || "User"}
                    </CardTitle>
                    <CardDescription className="text-base">
                      Welcome back to your account
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* User Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                      User ID
                    </p>
                    <p className="text-foreground font-mono text-sm bg-secondary px-3 py-2 rounded">
                      {user.id || "—"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                      Username
                    </p>
                    <p className="text-foreground bg-secondary px-3 py-2 rounded">
                      {user.username || "—"}
                    </p>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Email Address
                    </p>
                    <p className="text-foreground bg-secondary px-3 py-2 rounded">
                      {user.email}
                    </p>
                  </div>

                  {user.name && (
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                        Full Name
                      </p>
                      <p className="text-foreground bg-secondary px-3 py-2 rounded">
                        {user.name}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <ShoppingBag className="h-5 w-5 text-accent" />
                    <span className="text-foreground font-medium">Orders</span>
                  </Link>

                  <Link
                    to="/wishlist"
                    className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <Heart className="h-5 w-5 text-accent" />
                    <span className="text-foreground font-medium">Wishlist</span>
                  </Link>

                  <Link
                    to="/books"
                    className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <BookOpen className="h-5 w-5 text-accent" />
                    <span className="text-foreground font-medium">Browse Books</span>
                  </Link>

                  <Link
                    to="/publish"
                    className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <Clock className="h-5 w-5 text-accent" />
                    <span className="text-foreground font-medium">Publish</span>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Sign Out */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
