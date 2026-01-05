import { useState } from "react"; // Auth page
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export default function Auth() {
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});

  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerErrors, setRegisterErrors] = useState<{ email?: string }>({});

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const validateLoginForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    try {
      emailSchema.parse(loginEmail);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    try {
      passwordSchema.parse(loginPassword);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors: { email?: string } = {};

    try {
      emailSchema.parse(registerEmail);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLoginForm()) return;

    setLoginLoading(true);

    try {
      const { error } = await signIn(loginEmail, loginPassword);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password. Please try again.");
        } else {
          toast.error(error.message);
        }
        return;
      }
      toast.success("Welcome back!");
      navigate("/");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRegisterForm()) return;

    setRegisterLoading(true);

    try {
      // Generate a temporary password - user will set their own via email link
      const tempPassword = Math.random().toString(36).slice(-12) + "A1!";
      const { error } = await signUp(registerEmail, tempPassword, "");
      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error("This email is already registered. Please sign in instead.");
        } else {
          toast.error(error.message);
        }
        return;
      }
      toast.success("A link to set your password has been sent to your email address.");
      setRegisterEmail("");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Page Header Banner */}
      <div className="bg-gradient-charcoal py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground">
              My account
            </h1>
            <nav className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-primary-foreground/70">
              <Link to="/" className="hover:text-primary-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/books" className="hover:text-primary-foreground transition-colors">
                Bookshop
              </Link>
              <span>/</span>
              <span className="text-accent">My account</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Login Section */}
            <div className="space-y-6">
              <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground">
                Login
              </h2>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                    Username or email address <span className="text-accent">*</span>
                  </Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={`h-12 border-border bg-background ${
                      loginErrors.email
                        ? "border-destructive focus-visible:ring-destructive"
                        : "focus-visible:ring-accent"
                    }`}
                  />
                  {loginErrors.email && (
                    <p className="text-sm text-destructive">{loginErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginPassword" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                    Password <span className="text-accent">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={`h-12 pr-12 border-border bg-background ${
                        loginErrors.password
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
                  {loginErrors.password && (
                    <p className="text-sm text-destructive">{loginErrors.password}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-8 h-12"
                    disabled={loginLoading}
                  >
                    {loginLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Please wait...
                      </span>
                    ) : (
                      "LOG IN"
                    )}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="rememberMe" className="text-sm text-foreground cursor-pointer">
                      REMEMBER ME
                    </Label>
                  </div>
                </div>

                <button
                  type="button"
                  className="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
                >
                  Lost your password?
                </button>
              </form>
            </div>

            {/* Register Section */}
            <div className="space-y-6">
              <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground">
                Register
              </h2>

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="registerEmail" className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                    Email address <span className="text-accent">*</span>
                  </Label>
                  <Input
                    id="registerEmail"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className={`h-12 border-border bg-background ${
                      registerErrors.email
                        ? "border-destructive focus-visible:ring-destructive"
                        : "focus-visible:ring-accent"
                    }`}
                  />
                  {registerErrors.email && (
                    <p className="text-sm text-destructive">{registerErrors.email}</p>
                  )}
                </div>

                <p className="text-muted-foreground text-sm">
                  A link to set a new password will be sent to your email address.
                </p>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your personal data will be used to support your experience throughout this
                  website, to manage access to your account, and for other purposes described
                  in our{" "}
                  <Link to="/privacy" className="text-accent hover:underline">
                    privacy policy
                  </Link>
                  .
                </p>

                <Button
                  type="submit"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-8 h-12"
                  disabled={registerLoading}
                >
                  {registerLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Please wait...
                    </span>
                  ) : (
                    "REGISTER"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
