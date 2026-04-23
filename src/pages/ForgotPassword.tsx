import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { forgotPassword } from "@/services/authService";

const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters");

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldError(null);

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setFieldError(parsed.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(parsed.data);
      toast.success("If that email is registered, a reset code has been sent.");
      navigate(`/reset-password?email=${encodeURIComponent(parsed.data)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not send reset code";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="bg-[#f4f3ec] pt-28 sm:pt-32 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">
            My account
          </h1>
          <PageBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Bookshop", href: "/books" },
              { label: "My account" },
            ]}
          />
        </div>
      </section>

      <main className="flex-1 py-8 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-base leading-relaxed mb-8 text-[#696969]">
            To initiate a new password reset, please enter your username or email address. You will receive a link to create a new password via email.
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
                Username or email <span className="text-accent">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-12 rounded-none border-border bg-background ${
                  fieldError ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-accent"
                }`}
              />
              {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <Button
                type="submit"
                className="bg-[#e4573d] text-accent-foreground border border-[#e4573d] font-medium h-12 px-8 rounded-none uppercase tracking-wider transition-colors duration-300 hover:bg-white hover:text-[#e4573d]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "RESET PASSWORD"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
