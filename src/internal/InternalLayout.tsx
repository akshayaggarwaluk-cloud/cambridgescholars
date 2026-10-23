import { NavLink, Outlet } from "react-router-dom";
import { FolderOpen, LogOut, Users } from "lucide-react";
import { Button } from "./PortalButton";
import { clearSession, getSession, LOGIN_PATH } from "./api";

export function InternalLayout() {
  const session = getSession();

  // Full reload so no cached files or users from this session survive into
  // the next sign-in on this tab.
  const logout = () => {
    clearSession();
    window.location.replace(LOGIN_PATH);
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      isActive ? "bg-white/15 text-white" : "text-white/75 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div className="internal-root min-h-screen flex flex-col">
      <header className="bg-brand text-white">
        <div className="mx-auto w-full max-w-[1400px] px-6 h-14 flex items-center gap-6">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-baskerville text-[17px] whitespace-nowrap">Cambridge Scholars</span>
            <span className="text-white/60 text-sm whitespace-nowrap">Staff File Portal</span>
          </div>
          <nav className="flex items-center gap-1">
            <NavLink to="/internal" end className={navClass}>
              <FolderOpen className="h-4 w-4" /> Files
            </NavLink>
            {session?.isAdmin && (
              <NavLink to="/internal/admin" className={navClass}>
                <Users className="h-4 w-4" /> Admin
              </NavLink>
            )}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {session?.name && <span className="text-sm text-white/80 truncate max-w-[220px]">{session.name}</span>}
            <Button
              size="sm"
              variant="ghost"
              onClick={logout}
              className="text-white hover:bg-white/10 hover:text-white gap-2"
            >
              <LogOut className="h-4 w-4" /> Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-[1400px] px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
