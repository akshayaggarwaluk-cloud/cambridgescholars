import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, LogOut, Camera } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (!user) {
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
        <div className="container-wide max-w-2xl">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
            My Profile
          </h1>

          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Profile Card */}
              <div className="bg-card rounded-xl shadow-card p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Avatar"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-accent" />
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-accent rounded-full text-primary hover:bg-accent/90 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-foreground">
                      {profile?.full_name || "Reader"}
                    </h2>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user.email || ""} disabled />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <Button
                    variant="gold"
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-4"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-card rounded-xl shadow-card p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <Package className="h-5 w-5 text-accent" />
                    <span className="text-foreground">Order History</span>
                  </Link>
                </div>
              </div>

              {/* Sign Out */}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
