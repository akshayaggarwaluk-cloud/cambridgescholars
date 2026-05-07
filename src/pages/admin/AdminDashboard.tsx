import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Newspaper, Users, ArrowRight, HelpCircle, FileText, Package, Ticket } from "lucide-react";
import { adminApi } from "@/services/cmsService";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ hero: 0, news: 0, admins: 0, faqs: 0, resources: 0, orders: 0, coupons: 0 });

  useEffect(() => {
    const len = (r: PromiseSettledResult<unknown[]>) =>
      r.status === "fulfilled" && Array.isArray(r.value) ? r.value.length : 0;
    Promise.allSettled([
      adminApi.listHero(), adminApi.listNews(), adminApi.listAdmins(),
      adminApi.listFaqs(), adminApi.listResources(),
      adminApi.listAllOrders({ per_page: 1 }),
      adminApi.listCoupons({ per_page: 1 }),
    ]).then(([h, n, a, fq, rs, ord, cp]) => setCounts({
      hero: len(h as PromiseSettledResult<unknown[]>),
      news: len(n as PromiseSettledResult<unknown[]>),
      admins: len(a as PromiseSettledResult<unknown[]>),
      faqs: len(fq as PromiseSettledResult<unknown[]>),
      resources: len(rs as PromiseSettledResult<unknown[]>),
      orders:
        ord.status === "fulfilled"
          ? (ord.value as { total?: number; pagination?: { total?: number } })?.total ??
            (ord.value as { pagination?: { total?: number } })?.pagination?.total ??
            0
          : 0,
      coupons:
        cp.status === "fulfilled"
          ? (cp.value as { pagination?: { total?: number }; data?: unknown[] })?.pagination?.total ??
            ((cp.value as { data?: unknown[] })?.data?.length ?? 0)
          : 0,
    }));
  }, []);

  const tiles = [
    { to: "/admin/hero-slides", label: "Featured Reviews", count: counts.hero, desc: "Homepage Featured Reviews carousel.", icon: Sparkles },
    { to: "/admin/news", label: "News", count: counts.news, desc: "Add, edit and publish news articles.", icon: Newspaper },
    { to: "/admin/faqs", label: "FAQs", count: counts.faqs, desc: "Q&A entries on the FAQ page.", icon: HelpCircle },
    { to: "/admin/resources", label: "Resources", count: counts.resources, desc: "Resource pages under /resources.", icon: FileText },
    { to: "/admin/orders", label: "Orders", count: counts.orders, desc: "All customer orders.", icon: Package },
    { to: "/admin/coupons", label: "Coupons", count: counts.coupons, desc: "Discount codes for the store.", icon: Ticket },
    { to: "/admin/admins", label: "Admins", count: counts.admins, desc: "Manage who has access to this CMS portal.", icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-baskerville text-3xl text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage homepage content. Changes appear instantly on the live site.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map(({ to, label, count, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group border border-border p-6 hover:border-accent transition-colors flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <Icon className="h-6 w-6 text-accent" />
              <span className="font-baskerville text-3xl text-foreground">{count}</span>
            </div>
            <h2 className="font-baskerville text-xl text-foreground">{label}</h2>
            <p className="text-sm text-muted-foreground flex-1">{desc}</p>
            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-accent">
              Manage <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
