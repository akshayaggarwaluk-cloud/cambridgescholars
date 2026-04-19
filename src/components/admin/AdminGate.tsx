import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import { checkIsAdmin } from "@/services/cmsService";

interface AdminGateProps {
  children: ReactNode;
}

export default function AdminGate({ children }: AdminGateProps) {
  const { token, isAuthenticated, loading } = useExternalAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (loading) return;
    if (!isAuthenticated || !token) {
      setChecking(false);
      return;
    }
    setChecking(true);
    checkIsAdmin(token)
      .then((ok) => {
        if (!cancelled) setIsAdmin(ok);
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, isAuthenticated, loading]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f3ec]">
        <div className="text-muted-foreground font-nav">Verifying access…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f3ec] gap-4 px-6 text-center">
        <h1 className="font-baskerville text-3xl text-foreground">Access denied</h1>
        <p className="text-muted-foreground max-w-md">
          Your account does not have CMS administrator privileges. Contact the
          site owner if you believe this is a mistake.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
