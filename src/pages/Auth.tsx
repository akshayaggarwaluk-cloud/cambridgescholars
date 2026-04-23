import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { z } from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import {
  login as apiLogin,
  sendRegisterOtp,
  verifyRegisterOtp,
} from "@/services/authService";

const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters");

export default function Auth() {
  const { login: authLogin, isAuthenticated } = useExternalAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/profile");
  }, [isAuthenticated, navigate]);

  // ── Login state ────────────────────────────────
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ identifier?: string; password?: string }>({});
  const [loginError, setLoginError] = useState<string | null>(null);

  // ── Register state ─────────────────────────────
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerErrors, setRegisterErrors] = useState<{
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    otp?: string;
  }>({});
  const [registerError, setRegisterError] = useState<string | null>(null);

  // OTP step state
  const [registerStep, setRegisterStep] = useState<"details" | "otp">("details");
  const [regOtp, setRegOtp] = useState("");
  const [resendingOtp, setResendingOtp] = useState(false);

  const validateLogin = () => {
    const errs: { identifier?: string; password?: string } = {};
    if (!loginIdentifier.trim()) errs.identifier = "Required";
    if (!loginPassword) errs.password = "Required";
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!validateLogin()) return;
    setLoginLoading(true);
    try {
      const res = await apiLogin(loginIdentifier, loginPassword);
      if (!res?.access_token || !res?.user) {
        throw new Error("Invalid response from server");
      }
      authLogin(res);
      toast.success("Welcome back!");
      navigate("/profile");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      if (/invalid|incorrect|unauthor/i.test(message)) {
        setLoginError("Invalid username/email or password. Please try again.");
      } else {
        setLoginError(message);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    const errs: typeof registerErrors = {};
    if (!regFirstName.trim()) errs.first_name = "Required";
    if (!regLastName.trim()) errs.last_name = "Required";
    const em = emailSchema.safeParse(regEmail);
    if (!em.success) errs.email = em.error.errors[0].message;
    if (regPassword.length < 8) errs.password = "Password must be at least 8 characters";
    if (Object.keys(errs).length > 0) {
      setRegisterErrors(errs);
      return;
    }
    setRegisterErrors({});
    setRegisterLoading(true);
    try {
      await sendRegisterOtp({
        email: regEmail.trim(),
        password: regPassword,
        first_name: regFirstName.trim(),
        last_name: regLastName.trim(),
      });
      toast.success("Verification code sent. Check your email.");
      setRegisterStep("otp");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not send verification code";
      if (/already|exists|registered|409/i.test(message)) {
        setRegisterError(
          `An account is already registered with ${regEmail}. Please log in or use a different email.`
        );
      } else {
        setRegisterError(message);
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    if (!/^\d{6}$/.test(regOtp.trim())) {
      setRegisterErrors({ otp: "Enter the 6-digit code from your email" });
      return;
    }
    setRegisterErrors({});
    setRegisterLoading(true);
    try {
      const res = await verifyRegisterOtp({
        email: regEmail.trim(),
        password: regPassword,
        otp: regOtp.trim(),
        first_name: regFirstName.trim(),
        last_name: regLastName.trim(),
      });
      if (res?.access_token && res?.user) {
        authLogin(res);
        toast.success("Account created — welcome!");
        navigate("/profile");
      } else {
        toast.success("Account created. You can now log in.");
        setRegisterStep("details");
        setRegFirstName("");
        setRegLastName("");
        setRegEmail("");
        setRegPassword("");
        setRegOtp("");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not verify code";
      if (/expired|invalid|incorrect/i.test(message)) {
        setRegisterError("The code is invalid or has expired. Please request a new one.");
      } else if (/too many|429/i.test(message)) {
        setRegisterError("Too many incorrect attempts. Please request a new code.");
      } else if (/already|exists|registered|409/i.test(message)) {
        setRegisterError(
          `An account is already registered with ${regEmail}. Please log in instead.`
        );
      } else {
        setRegisterError(message);
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setRegisterError(null);
    setResendingOtp(true);
    try {
      await sendRegisterOtp({
        email: regEmail.trim(),
        password: regPassword,
        first_name: regFirstName.trim(),
        last_name: regLastName.trim(),
      });
      toast.success("A new verification code has been sent.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not resend code";
      setRegisterError(message);
    } finally {
      setResendingOtp(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Page Header Banner */}
      <section className="bg-[#f4f3ec] pt-28 sm:pt-32 pb-12 md:pb-16">

        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-serif text-3xl md:text-5xl font-normal text-foreground leading-tight py-2">
            My account
          </h1>
          <nav className="flex items-center gap-2 text-base text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/books" className="hover:text-accent transition-colors">
              Bookshop
            </Link>
            <span>/</span>
            <span className="text-accent font-medium">My account</span>
          </nav>
        </div>
      </section>

      <main className="flex-1 py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {/* ── LOGIN ───────────────────────────── */}
            <section aria-labelledby="login-heading">
              <h2
                id="login-heading"
                className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-8"
              >
                Login
              </h2>

              {loginError && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-foreground text-base">
                    <span className="font-semibold text-red-600">Error:</span> {loginError}
                  </p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="loginIdentifier"
                    className="text-xs font-medium tracking-wider uppercase text-foreground"
                  >
                    Username or email address <span className="text-accent">*</span>
                  </Label>
                  <Input
                    id="loginIdentifier"
                    type="text"
                    autoComplete="username"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className={`h-12 rounded-none border-border bg-white ${
                      loginErrors.identifier
                        ? "border-destructive focus-visible:ring-destructive"
                        : "focus-visible:ring-accent"
                    }`}
                  />
                  {loginErrors.identifier && (
                    <p className="text-sm text-destructive">{loginErrors.identifier}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="loginPassword"
                    className="text-xs font-medium tracking-wider uppercase text-foreground"
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
                      className={`h-12 pr-12 rounded-none border-border bg-white ${
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
                      {showLoginPassword ? (
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

                <div className="flex items-center gap-4 flex-wrap">
                  <Button
                    type="submit"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-12 px-8 rounded-none uppercase tracking-wider"
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

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label
                      htmlFor="rememberMe"
                      className="text-sm uppercase tracking-wider text-foreground cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>
                </div>

                <div>
                  <Link
                    to="/forgot-password"
                    className="text-accent hover:underline text-base"
                  >
                    Lost your password?
                  </Link>
                </div>
              </form>
            </section>

            {/* ── REGISTER ────────────────────────── */}
            <section aria-labelledby="register-heading" className="md:border-l md:border-border md:pl-12 lg:pl-20">
              <h2
                id="register-heading"
                className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-8"
              >
                Register
              </h2>

              {registerError && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-foreground text-base">
                    <span className="font-semibold text-red-600">Error:</span> {registerError}
                  </p>
                </div>
              )}

              {registerStep === "details" ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="regFirstName"
                        className="text-xs font-medium tracking-wider uppercase text-foreground"
                      >
                        First name <span className="text-accent">*</span>
                      </Label>
                      <Input
                        id="regFirstName"
                        type="text"
                        autoComplete="given-name"
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        className={`h-12 rounded-none border-border bg-white ${
                          registerErrors.first_name
                            ? "border-destructive focus-visible:ring-destructive"
                            : "focus-visible:ring-accent"
                        }`}
                      />
                      {registerErrors.first_name && (
                        <p className="text-sm text-destructive">{registerErrors.first_name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="regLastName"
                        className="text-xs font-medium tracking-wider uppercase text-foreground"
                      >
                        Last name <span className="text-accent">*</span>
                      </Label>
                      <Input
                        id="regLastName"
                        type="text"
                        autoComplete="family-name"
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        className={`h-12 rounded-none border-border bg-white ${
                          registerErrors.last_name
                            ? "border-destructive focus-visible:ring-destructive"
                            : "focus-visible:ring-accent"
                        }`}
                      />
                      {registerErrors.last_name && (
                        <p className="text-sm text-destructive">{registerErrors.last_name}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="regEmail"
                      className="text-xs font-medium tracking-wider uppercase text-foreground"
                    >
                      Email address <span className="text-accent">*</span>
                    </Label>
                    <Input
                      id="regEmail"
                      type="email"
                      autoComplete="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className={`h-12 rounded-none border-border bg-white ${
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
                      className="text-xs font-medium tracking-wider uppercase text-foreground"
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
                        className={`h-12 pr-12 rounded-none border-border bg-white ${
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
                        {showRegPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {registerErrors.password && (
                      <p className="text-sm text-destructive">{registerErrors.password}</p>
                    )}
                    <p className="text-sm text-muted-foreground pt-1">
                      Must be at least 8 characters.
                    </p>
                  </div>

                  <p className="text-base text-foreground leading-relaxed">
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
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-12 px-8 rounded-none uppercase tracking-wider"
                    disabled={registerLoading}
                  >
                    {registerLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Sending code...
                      </span>
                    ) : (
                      "SEND VERIFICATION CODE"
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <p className="text-base text-foreground leading-relaxed">
                    We've sent a 6-digit verification code to{" "}
                    <span className="font-semibold">{regEmail}</span>. Enter it below to finish
                    creating your account. The code expires in 15 minutes.
                  </p>

                  <div className="space-y-2">
                    <Label
                      htmlFor="regOtp"
                      className="text-xs font-medium tracking-wider uppercase text-foreground"
                    >
                      Verification code <span className="text-accent">*</span>
                    </Label>
                    <Input
                      id="regOtp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={regOtp}
                      onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456"
                      className={`h-12 rounded-none border-border bg-white tracking-[0.4em] font-mono text-center text-lg ${
                        registerErrors.otp
                          ? "border-destructive focus-visible:ring-destructive"
                          : "focus-visible:ring-accent"
                      }`}
                    />
                    {registerErrors.otp && (
                      <p className="text-sm text-destructive">{registerErrors.otp}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <Button
                      type="submit"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-12 px-8 rounded-none uppercase tracking-wider"
                      disabled={registerLoading}
                    >
                      {registerLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        "CREATE ACCOUNT"
                      )}
                    </Button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendingOtp}
                      className="text-accent hover:underline text-base disabled:opacity-50"
                    >
                      {resendingOtp ? "Resending..." : "Resend code"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setRegisterStep("details");
                      setRegOtp("");
                      setRegisterError(null);
                      setRegisterErrors({});
                    }}
                    className="text-base text-muted-foreground hover:text-accent underline"
                  >
                    ← Edit registration details
                  </button>
                </form>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
