import { FormEvent, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Lock } from "lucide-react";
import { Button } from "../PortalButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSession, InternalApiError, login, saveSession } from "../api";

export default function InternalLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const next = params.get("next");
  const destination = next && next.startsWith("/internal") && !next.startsWith("/internal/login") ? next : "/internal";

  if (getSession()) return <Navigate to={destination} replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await login(email.trim(), password);
      saveSession(res.token, res.name, res.is_admin);
      // Drop anything cached for a previous user of this tab.
      queryClient.removeQueries({ predicate: (query) => String(query.queryKey[0]).startsWith("internal-") });
      navigate(destination, { replace: true });
    } catch (err) {
      if (err instanceof InternalApiError && (err.status === 401 || err.status === 403)) {
        setError(err.status === 403 ? err.message : "Incorrect email or password.");
      } else {
        setError(err instanceof Error ? err.message : "Sign-in failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="internal-root min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-brand text-white flex items-center justify-center">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="font-baskerville text-2xl text-[#1a3e6f]">Cambridge Scholars</h1>
          <p className="text-sm text-muted-foreground mt-1">Staff File Portal</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white border border-border rounded-lg shadow-sm p-6 space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="internal-email">Email</Label>
            <Input
              id="internal-email"
              type="email"
              autoComplete="username"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="internal-password">Password</Label>
            <Input
              id="internal-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-6">
          Accounts are created by an administrator. Contact your admin if you need access.
        </p>
      </div>
    </div>
  );
}
