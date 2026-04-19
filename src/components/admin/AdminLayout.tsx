import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Newspaper, Sparkles, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/hero-slides", label: "Hero Slides", icon: Sparkles, end: false },
  { to: "/admin/news", label: "News", icon: Newspaper, end: false },
];

export default function AdminLayout() {
  const { user } = useExternalAuth();

  return (
    <div className="min-h-screen bg-[#f4f3ec]">
      <header className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/admin" className="font-baskerville text-xl tracking-wide">
            CSP CMS
          </Link>
          <div className="flex items-center gap-4 text-sm font-nav">
            <span className="hidden sm:inline opacity-80">{user?.email}</span>
            <Link
              to="/"
              className="inline-flex items-center gap-1 uppercase tracking-wider text-xs hover:text-accent"
            >
              View site <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-[220px_1fr] gap-8">
        <aside>
          <nav className="space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm font-nav uppercase tracking-wider transition-colors rounded-none border-l-2",
                    isActive
                      ? "bg-white text-accent border-accent"
                      : "text-foreground/70 border-transparent hover:bg-white/60 hover:text-foreground",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="bg-white p-6 lg:p-8 rounded-sm min-h-[60vh]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
