import { ReactNode, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { getSession, loginUrl } from "./api";
import { InternalLayout } from "./InternalLayout";
import InternalLogin from "./pages/InternalLogin";
import FileBrowser from "./pages/FileBrowser";
import InternalAdmin from "./pages/InternalAdmin";

/** Employee file portal, mounted at /internal/*. */
export default function InternalApp() {
  usePortalChrome();
  return (
    <Routes>
      <Route path="login" element={<InternalLogin />} />
      <Route
        element={
          <RequireSession>
            <InternalLayout />
          </RequireSession>
        }
      >
        <Route index element={<FileBrowser />} />
        <Route
          path="admin"
          element={
            <RequireSession admin>
              <InternalAdmin />
            </RequireSession>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/internal" replace />} />
    </Routes>
  );
}

function RequireSession({ admin, children }: { admin?: boolean; children: ReactNode }) {
  const location = useLocation();
  const session = getSession();
  if (!session) return <Navigate to={loginUrl(location.pathname + location.search)} replace />;
  if (admin && !session.isAdmin) return <Navigate to="/internal" replace />;
  return <>{children}</>;
}

// Applies the portal's colour scheme to <html> (so dialogs and dropdowns,
// which render outside the page tree, pick it up too), sets the tab title,
// and keeps the portal out of search engines.
//
// Every route change remounts the portal (the site's route animation keys on
// the path), and the old copy can unmount just before or after the new one
// mounts. So mounts are counted, and when the last one goes the restore waits
// a moment; a portal page mounting in that gap cancels it, avoiding a flash
// of the public site's colours between portal pages.
let portalMounts = 0;
let restore: (() => void) | null = null;
let pendingRestore: ReturnType<typeof setTimeout> | null = null;

function usePortalChrome() {
  useEffect(() => {
    if (pendingRestore) {
      clearTimeout(pendingRestore);
      pendingRestore = null;
    }
    if (portalMounts++ === 0 && !restore) {
      const root = document.documentElement;
      root.classList.add("internal-portal");
      const prevTitle = document.title;
      document.title = "Staff File Portal · Cambridge Scholars Publishing";
      const robots = document.createElement("meta");
      robots.name = "robots";
      robots.content = "noindex, nofollow";
      document.head.appendChild(robots);
      restore = () => {
        root.classList.remove("internal-portal");
        document.title = prevTitle;
        robots.remove();
      };
    }
    return () => {
      if (--portalMounts === 0) {
        pendingRestore = setTimeout(() => {
          pendingRestore = null;
          restore?.();
          restore = null;
        }, 200);
      }
    };
  }, []);
}
