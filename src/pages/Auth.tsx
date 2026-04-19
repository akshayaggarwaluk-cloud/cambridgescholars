import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { z } from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import { login as apiLogin, register as apiRegister } from "@/services/authService";

const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters");
const nameSchema = z
  .string()
  .trim()
  .min(1, "Required")
  .max(100, "Must be less than 100 characters");

type AuthStep = "login" | "register";

export default function Auth() {
  const { login: authLogin, isAuthenticated } = useExternalAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/profile");
  }, [isAuthenticated, navigate]);

  const [step, setStep] = useState<AuthStep>("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);

  // Register state
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerErrors, setRegisterErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateLogin = () => {
    const errs: { email?: string; password?: string } = {};
    const e1 = emailSchema.safeParse(loginEmail);
    if (!e1.success) errs.email = e1.error.errors[0].message;
    if (!loginPassword) errs.password = "Password is required";
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateRegister = () => {
    const errs: typeof registerErrors = {};
    const fn = nameSchema.safeParse(regFirstName);
    if (!fn.success) errs.firstName = fn.error.errors[0].message;
    const ln = nameSchema.safeParse(regLastName);
    if (!ln.success) errs.lastName = ln.error.errors[0].message;
    const em = emailSchema.safeParse(regEmail);
    if (!em.success) errs.email = em.error.errors[0].message;
    const pw = passwordSchema.safeParse(regPassword);
    if (!pw.success) errs.password = pw.error.errors[0].message;
    if (regPassword !== regConfirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    setRegisterErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!validateLogin()) return;
    setLoginLoading(true);
    try {
      const res = await apiLogin(loginEmail, loginPassword);
      if (!res?.access_token || !res?.user) {
        throw new Error("Invalid response from server");
      }
      authLogin(res);
      toast.success("Welcome back!");
      navigate("/profile");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      if (/invalid|incorrect|unauthor/i.test(message)) {
        setAuthError("Invalid email or password. Please try again.");
      } else {
        setAuthError(message);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!validateRegister()) return;
    setRegisterLoading(true);
    try {
      const res = await apiRegister({
        email: regEmail,
        password: regPassword,
        first_name: regFirstName,
        last_name: regLastName,
      });
      if (!res?.access_token || !res?.user) {
        throw new Error("Invalid response from server");
      }
      authLogin(res);
      toast.success("Account created. Welcome!");
      navigate("/profile");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      if (/already|exists|registered|409/i.test(message)) {
        setAuthError(
          `An account is already registered with ${regEmail}. Please log in or use a different email.`
        );
      } else {
        setAuthError(message);
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const renderLogin = () => (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground">
          Login
        </h2>
        <p className="text-muted-foreground text-base">
          Sign in to access your account
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="loginEmail"
            className="text-xs font-medium tracking-wider uppercase text-muted-foreground"
          >
            Email address <span className="text-accent">*</span>
          </Label>
          <Input
            id="loginEmail"
            type="email"
            autoComplete="email"
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
          <Label
            htmlFor="loginPassword"
            className="text-xs font-medium tracking-wider uppercase text-muted-foreground"
          >
            Password <span className="text-accent">*</span>
          </Label>
          <div className="relative">
            <Input
              id="loginPassword"
              type={showLoginPassword ? "text" : "password"}
              autoComplete="current-password"
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
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              aria-label={showLoginPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {loginErrors.password && (
            <p className="text-sm text-destructive">{loginErrors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="rememberMe" className="text-sm text-foreground cursor-pointer">
              Remember me
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-12 rounded-none uppercase tracking-wider"
          disabled={loginLoading}
        >
          {loginLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            "LOG IN"
          )}
        </Button>

        <p className="text-center text-base text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => {
              setStep("register");
              setAuthError(null);
            }}
            className="text-accent hover:text-accent/80 font-medium transition-colors"
          >
            Create one
          </button>
        </p>
      </form>
    </div>
  );

  const renderRegister = () => (
    <div className="space-y-6 max-w-md mx-auto">
      <button
        onClick={() => {
          setStep("login");
          setAuthError(null);
        }}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-base"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </button>

      <div className="space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground">
          Create account
        </h2>
        <p className="text-muted-foreground text-base">
          Register a new customer account
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="regFirstName"
              className="text-xs font-medium tracking-wider uppercase text-muted-foreground"
            >
              First name <span className="text-accent">*</span>
            </Label>
            <Input
              id="regFirstName"
              type="text"
              autoComplete="given-name"
              value={regFirstName}
              onChange={(e) => setRegFirstName(e.target.value)}
              className={`h-12 border-border bg-background ${
                registerErrors.firstName
                  ? "border-destructive focus-visible:ring-destructive"
                  : "focus-visible:ring-accent"
              }`}
            />
            {registerErrors.firstName && (
              <p className="text-sm text-destructive">{registerErrors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="regLastName"
              className="text-xs font-medium tracking-wider uppercase text-muted-foreground"
            >
              Last name <span className="text-accent">*</span>
            </Label>
            <Input
              id="regLastName"
              type="text"
              autoComplete="family-name"
              value={regLastName}
              onChange={(e) => setRegLastName(e.target.value)}
              className={`h-12 border-border bg-background ${
                registerErrors.lastName
                  ? "border-destructive focus-visible:ring-destructive"
                  : "focus-visible:ring-accent"
              }`}
            />
            {registerErrors.lastName && (
              <p className="text-sm text-destructive">{registerErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="regEmail"
            className="text-xs font-medium tracking-wider uppercase text-muted-foreground"
          >
            Email address <span className="text-accent">*</span>
          </Label>
          <Input
            id="regEmail"
            type="email"
            autoComplete="email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
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

        <div className="space-y-2">
          <Label
            htmlFor="regPassword"
            className="text-xs font-medium tracking-wider uppercase text-muted-foreground"
          >
            Password <span className="text-accent">*</span>
          </Label>
          <div className="relative">
            <Input
              id="regPassword"
              type={showRegPassword ? "text" : "password"}
              autoComplete="new-password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className={`h-12 pr-12 border-border bg-background ${
                registerErrors.password
                  ? "border-destructive focus-visible:ring-destructive"
                  : "focus-visible:ring-accent"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowRegPassword(!showRegPassword)}
              aria-label={showRegPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showRegPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {registerErrors.password && (
            <p className="text-sm text-destructive">{registerErrors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="regConfirmPassword"
            className="text-xs font-medium tracking-wider uppercase text-muted-foreground"
          >
            Confirm password <span className="text-accent">*</span>
          </Label>
          <div className="relative">
            <Input
              id="regConfirmPassword"
              type={showRegConfirm ? "text" : "password"}
              autoComplete="new-password"
              value={regConfirmPassword}
              onChange={(e) => setRegConfirmPassword(e.target.value)}
              className={`h-12 pr-12 border-border bg-background ${
                registerErrors.confirmPassword
                  ? "border-destructive focus-visible:ring-destructive"
                  : "focus-visible:ring-accent"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowRegConfirm(!showRegConfirm)}
              aria-label={showRegConfirm ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showRegConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {registerErrors.confirmPassword && (
            <p className="text-sm text-destructive">{registerErrors.confirmPassword}</p>
          )}
        </div>

        <p className="text-muted-foreground text-base leading-relaxed">
          Your personal data will be used to support your experience throughout this
          website, to manage access to your account, and for other purposes described
          in our{" "}
          <Link to="/privacy-policy" className="text-accent hover:underline">
            privacy policy
          </Link>
          .
        </p>

        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-12 rounded-none uppercase tracking-wider"
          disabled={registerLoading}
        >
          {registerLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            "CREATE ACCOUNT"
          )}
        </Button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Page Header Banner */}
      <section className="bg-[#f4f3ec] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-foreground">
            My account
          </h1>
          <nav className="flex items-center gap-2 text-base text-muted-foreground">
            <Link to="/" className="text-red-500 hover:text-red-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-muted-foreground font-medium text-base">My account</span>
          </nav>
        </div>
      </section>

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          {authError && (
            <div className="max-w-md mx-auto mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-foreground text-base">
                <span className="font-semibold text-red-600">Error:</span> {authError}
              </p>
            </div>
          )}
          {step === "login" ? renderLogin() : renderRegister()}
        </div>
      </main>

      <Footer />
    </div>
  );
}
