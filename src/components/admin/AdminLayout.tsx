import { Link, NavLink, Outlet, useNavigate, Navigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Newspaper, Sparkles, ExternalLink, LogOut, Users,
  BookOpen, MessageSquareQuote, HelpCircle, FileText, FolderDown,
  Inbox, FileSignature, ShoppingBag, UserCog, Tag, UserRound, ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminLogout, adminSession } from "@/services/cmsService";
import { toast } from "sonner";

const navGroups: Array<{
  label?: string;
  items: Array<{ to: string; label: string; icon: typeof LayoutDashboard; end?: boolean; roles?: string[] }>;
}> = [
  { items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }] },
  {
    label: "Content",
    items: [
      { to: "/admin/hero-slides", label: "Featured Reviews", icon: Sparkles },
      { to: "/admin/news", label: "News", icon: Newspaper },
      { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
      { to: "/admin/resources", label: "Resources", icon: FileText },
      { to: "/admin/footer-documents", label: "Footer Documents", icon: FolderDown },
      { to: "/admin/policy-pages", label: "Footer Policy Pages", icon: ScrollText },
    ],
  },
  {
    label: "Inbox",
    items: [
      { to: "/admin/contact-submissions", label: "Contact", icon: Inbox },
      { to: "/admin/proposal-submissions", label: "Proposals", icon: FileSignature },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/admin/orders", label: "Orders", icon: ShoppingBag, roles: ["admin", "orders"] },
      { to: "/admin/coupons", label: "Coupons", icon: Tag },
      { to: "/admin/users", label: "Users", icon: UserRound },
      { to: "/admin/admins", label: "Admins", icon: Users },
    ],
  },
];

// Roles with restricted access only see specific sections.
const ROLE_ALLOWED: Record<string, string[]> = {
  orders: ["/admin/orders"],
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = adminSession.getUser();
  const role = user?.role ?? "admin";
  const allowed = ROLE_ALLOWED[role];

  // Orders-only role: redirect away from anything except their allowed routes.
  if (allowed && !allowed.some((p) => location.pathname === p || location.pathname.startsWith(p + "/"))) {
    return <Navigate to={allowed[0]} replace />;
  }

  const visibleGroups = navGroups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => (allowed ? allowed.some((p) => i.to === p || i.to.startsWith(p + "/")) : true)),
    }))
    .filter((g) => g.items.length > 0);

  const handleLogout = () => {
    adminLogout();
    toast.success("Signed out");
    navigate("/admin/login", { replace: true });
  };

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
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 uppercase tracking-wider text-xs hover:text-accent"
            >
              <LogOut className="h-3 w-3" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-[240px_1fr] gap-8">
        <aside>
          <nav className="space-y-6">
            {visibleGroups.map((group, gi) => (
              <div key={gi} className="space-y-1">
                {group.label && (
                  <div className="px-4 mb-1 text-[10px] font-nav uppercase tracking-widest text-muted-foreground">
                    {group.label}
                  </div>
                )}
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2 text-xs font-nav uppercase tracking-wider transition-colors rounded-none border-l-2",
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
              </div>
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
