import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Newspaper,
  Users,
  ArrowRight,
  HelpCircle,
  FileText,
  Package,
  Ticket,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { adminApi, adminSession } from "@/services/cmsService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Counts = {
  hero: number;
  news: number;
  admins: number;
  faqs: number;
  resources: number;
  orders: number;
  coupons: number;
};

const ZERO: Counts = {
  hero: 0,
  news: 0,
  admins: 0,
  faqs: 0,
  resources: 0,
  orders: 0,
  coupons: 0,
};

export default function AdminDashboard() {
  const adminUser = adminSession.getUser();
  const [counts, setCounts] = useState<Counts>(ZERO);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    const len = (r: PromiseSettledResult<unknown[]>) =>
      r.status === "fulfilled" && Array.isArray(r.value) ? r.value.length : 0;
    const total = (r: PromiseSettledResult<unknown>) => {
      if (r.status !== "fulfilled") return 0;
      const v = r.value as {
        total?: number;
        pagination?: { total?: number };
        data?: unknown[];
      };
      return v?.total ?? v?.pagination?.total ?? v?.data?.length ?? 0;
    };

    const [h, n, a, fq, rs, ord, cp] = await Promise.allSettled([
      adminApi.listHero(),
      adminApi.listNews(),
      adminApi.listAdmins(),
      adminApi.listFaqs(),
      adminApi.listResources(),
      adminApi.listAllOrders({ per_page: 1 }),
      adminApi.listCoupons({ per_page: 1 }),
    ]);

    setCounts({
      hero: len(h as PromiseSettledResult<unknown[]>),
      news: len(n as PromiseSettledResult<unknown[]>),
      admins: len(a as PromiseSettledResult<unknown[]>),
      faqs: len(fq as PromiseSettledResult<unknown[]>),
      resources: len(rs as PromiseSettledResult<unknown[]>),
      orders: total(ord),
      coupons: total(cp),
    });
    setUpdatedAt(new Date());
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groups: {
    title: string;
    tiles: {
      to: string;
      label: string;
      count: number;
      desc: string;
      icon: typeof Sparkles;
    }[];
  }[] = [
    {
      title: "Content",
      tiles: [
        {
          to: "/admin/hero-slides",
          label: "Featured Reviews",
          count: counts.hero,
          desc: "Homepage hero carousel quotes.",
          icon: Sparkles,
        },
        {
          to: "/admin/news",
          label: "News",
          count: counts.news,
          desc: "Articles published on the site.",
          icon: Newspaper,
        },
        {
          to: "/admin/faqs",
          label: "FAQs",
          count: counts.faqs,
          desc: "Questions on the FAQ page.",
          icon: HelpCircle,
        },
        {
          to: "/admin/resources",
          label: "Resources",
          count: counts.resources,
          desc: "Pages under /resources.",
          icon: FileText,
        },
      ],
    },
    {
      title: "Commerce",
      tiles: [
        {
          to: "/admin/orders",
          label: "Orders",
          count: counts.orders,
          desc: "View, search and update customer orders.",
          icon: Package,
        },
        {
          to: "/admin/coupons",
          label: "Coupons",
          count: counts.coupons,
          desc: "Discount codes for the store.",
          icon: Ticket,
        },
      ],
    },
    {
      title: "System",
      tiles: [
        {
          to: "/admin/admins",
          label: "Admins",
          count: counts.admins,
          desc: "People with CMS access.",
          icon: Users,
        },
      ],
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-baskerville text-3xl text-foreground mb-1">
            Welcome back{adminUser?.email ? `, ${adminUser.email.split("@")[0]}` : ""}
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage homepage content, commerce and admins. Changes appear instantly on the live site.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {updatedAt && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Updated {updatedAt.toLocaleTimeString()}
            </span>
          )}
          <Button
            variant="outline"
            onClick={() => void load()}
            disabled={loading}
            className="rounded-none uppercase tracking-wider text-xs"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Grouped tiles */}
      {groups.map((group) => (
        <section key={group.title} className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="font-baskerville text-xl text-foreground">{group.title}</h2>
            <div className="h-px bg-border flex-1" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.tiles.map(({ to, label, count, desc, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="group bg-white border border-border p-5 hover:border-[#C75B2A] hover:shadow-sm transition-all flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="h-10 w-10 flex items-center justify-center bg-[#f4f3ec] text-[#C75B2A]">
                    <Icon className="h-5 w-5" />
                  </div>
                  {loading ? (
                    <Skeleton className="h-7 w-10 rounded-none" />
                  ) : (
                    <span className="font-baskerville text-2xl text-foreground leading-none mt-1">
                      {count.toLocaleString()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-baskerville text-lg text-foreground mb-0.5">{label}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-[#C75B2A] mt-auto">
                  Manage
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
