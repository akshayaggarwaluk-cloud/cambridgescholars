import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export default function SetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing token. Please request a new password reset link.");
      navigate("/auth");
    }
  }, [token, navigate]);

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message?.includes("expired") || data.message?.includes("invalid")) {
          toast.error("This link has expired. Please request a new password reset.");
        } else {
          toast.error(data.message || "Failed to set password. Please try again.");
        }
        return;
      }

      toast.success("Password set successfully! You can now log in.");
      navigate("/auth");
    } catch (error) {
      toast.error("Unable to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Page Header Banner */}
      <div className="bg-gradient-charcoal py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground">
              Set Your Password
            </h1>
            <nav className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-primary-foreground/70">
              <Link to="/" className="hover:text-primary-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/auth" className="hover:text-primary-foreground transition-colors">
                My Account
              </Link>
              <span>/</span>
              <span className="text-accent">Set Password</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto space-y-6">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground text-center">
              Create Your Password
            </h2>

            <p className="text-muted-foreground text-sm text-center">
              Please enter a secure password for your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                  New Password <span className="text-accent">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`h-12 pr-12 border-border bg-background ${
                      errors.password
                        ? "border-destructive focus-visible:ring-destructive"
                        : "focus-visible:ring-accent"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                  Confirm Password <span className="text-accent">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`h-12 pr-12 border-border bg-background ${
                      errors.confirmPassword
                        ? "border-destructive focus-visible:ring-destructive"
                        : "focus-visible:ring-accent"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-12"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Please wait...
                  </span>
                ) : (
                  "SET PASSWORD"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/auth" className="text-accent hover:underline">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
