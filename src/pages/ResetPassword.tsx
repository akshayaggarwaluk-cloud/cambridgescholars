import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { resetPassword, forgotPassword } from "@/services/authService";

const emailSchema = z.string().trim().email("Please enter a valid email address");

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; otp?: string; new_password?: string }>({});

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const errs: typeof errors = {};
    const em = emailSchema.safeParse(email);
    if (!em.success) errs.email = em.error.errors[0].message;
    if (!/^\d{6}$/.test(otp.trim())) errs.otp = "Enter the 6-digit code from your email";
    if (newPassword.length < 8) errs.new_password = "Password must be at least 8 characters";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword,
      });
      toast.success("Password reset successfully. You can now log in.");
      navigate("/auth");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not reset password";
      if (/expired|invalid|incorrect/i.test(message)) {
        setError("The code is invalid or has expired. Please request a new one.");
      } else if (/not found|404/i.test(message)) {
        setError("No account was found for that email address.");
      } else if (/too many|429/i.test(message)) {
        setError("Too many incorrect attempts. Please request a new code.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const em = emailSchema.safeParse(email);
    if (!em.success) {
      setErrors((prev) => ({ ...prev, email: em.error.errors[0].message }));
      return;
    }
    setResending(true);
    try {
      await forgotPassword(em.data);
      toast.success("A new code has been sent to your email.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not resend code";
      setError(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="bg-[#f4f3ec] pt-28 sm:pt-32 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-serif text-3xl md:text-5xl font-normal text-foreground leading-tight py-2">
            My account
          </h1>
          <nav className="flex items-center gap-2 text-base text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link to="/auth" className="hover:text-accent transition-colors">My account</Link>
            <span>/</span>
            <span className="text-accent font-medium">Reset password</span>
          </nav>
        </div>
      </section>

      <main className="flex-1 py-12 md:py-16 bg-white">
        <div className="max-w-xl mx-auto px-4">
          <p className="text-base text-foreground leading-relaxed mb-8">
            Enter the 6-digit code sent to your email along with your new password.
          </p>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-foreground text-base">
                <span className="font-semibold text-red-600">Error:</span> {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium tracking-wider uppercase text-foreground">
                Email address <span className="text-accent">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-12 rounded-none border-border bg-background ${
                  errors.email ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-accent"
                }`}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp" className="text-xs font-medium tracking-wider uppercase text-foreground">
                Verification code <span className="text-accent">*</span>
              </Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className={`h-12 rounded-none border-border bg-background tracking-[0.4em] font-mono text-center ${
                  errors.otp ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-accent"
                }`}
              />
              {errors.otp && <p className="text-sm text-destructive">{errors.otp}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-xs font-medium tracking-wider uppercase text-foreground">
                New password <span className="text-accent">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`h-12 pr-12 rounded-none border-border bg-background ${
                    errors.new_password ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-accent"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.new_password && <p className="text-sm text-destructive">{errors.new_password}</p>}
              <p className="text-sm text-muted-foreground pt-1">Must be at least 8 characters.</p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-12 px-8 rounded-none uppercase tracking-wider"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Resetting...
                  </span>
                ) : (
                  "RESET PASSWORD"
                )}
              </Button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-accent hover:underline text-base disabled:opacity-50"
              >
                {resending ? "Resending..." : "Resend code"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
