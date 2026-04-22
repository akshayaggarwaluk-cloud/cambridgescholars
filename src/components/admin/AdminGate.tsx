import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { adminWhoAmI, adminSession, type CmsAdminUser } from "@/services/cmsService";

interface AdminGateProps {
  children: ReactNode;
}

export default function AdminGate({ children }: AdminGateProps) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<CmsAdminUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    setChecking(true);
    adminWhoAmI()
      .then((u) => { if (!cancelled) setUser(u); })
      .catch(() => {
        adminSession.clear();
        if (!cancelled) setUser(null);
      })
      .finally(() => { if (!cancelled) setChecking(false); });
    return () => { cancelled = true; };
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f3ec]">
        <div className="text-muted-foreground font-nav">Verifying access…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

// Re-export so layout can use the cached session synchronously
export function useAdminUser(): CmsAdminUser | null {
  return adminSession.getUser();
}
