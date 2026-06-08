import { FormEvent, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { adminLogin } from "@/services/cmsService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const user = await adminLogin(email.trim(), password);
      toast.success(`Welcome, ${user.name || user.email}`);
      // Role-restricted users land directly on their allowed section.
      const roleHome: Record<string, string> = { orders: "/admin/orders" };
      const home = (user.role && roleHome[user.role]) || "/admin";
      const target = from === "/admin/login" ? home : from;
      navigate(target, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f3ec] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8 font-baskerville text-2xl text-foreground">
          CSP CMS
        </Link>

        <div className="bg-white border border-border p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 text-accent">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="font-baskerville text-2xl text-foreground">Admin sign in</h1>
            <p className="text-sm text-muted-foreground">
              Restricted area. Authorized administrators only.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-nav uppercase tracking-wider text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border px-3 py-2.5 text-sm bg-background"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-nav uppercase tracking-wider text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border px-3 py-2.5 text-sm bg-background"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent hover:bg-accent/90 rounded-none uppercase tracking-wider"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Signing in…</>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            This is separate from the public site account. Contact a system administrator if you need access.
          </p>
        </div>
      </div>
    </div>
  );
}
