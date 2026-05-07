import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Newspaper, Users, ArrowRight, BookOpen, MessageSquareQuote, HelpCircle, FileText } from "lucide-react";
import { adminApi } from "@/services/cmsService";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ hero: 0, news: 0, admins: 0, featured: 0, reviews: 0, faqs: 0, resources: 0 });

  useEffect(() => {
    const len = (r: PromiseSettledResult<unknown[]>) =>
      r.status === "fulfilled" && Array.isArray(r.value) ? r.value.length : 0;
    Promise.allSettled([
      adminApi.listHero(), adminApi.listNews(), adminApi.listAdmins(),
      adminApi.listFeaturedBooks(), adminApi.listAuthorReviews(),
      adminApi.listFaqs(), adminApi.listResources(),
    ]).then(([h, n, a, fb, ar, fq, rs]) => setCounts({
      hero: len(h as PromiseSettledResult<unknown[]>),
      news: len(n as PromiseSettledResult<unknown[]>),
      admins: len(a as PromiseSettledResult<unknown[]>),
      featured: len(fb as PromiseSettledResult<unknown[]>),
      reviews: len(ar as PromiseSettledResult<unknown[]>),
      faqs: len(fq as PromiseSettledResult<unknown[]>),
      resources: len(rs as PromiseSettledResult<unknown[]>),
    }));
  }, []);

  const tiles = [
    { to: "/admin/hero-slides", label: "Featured Reviews", count: counts.hero, desc: "Homepage Featured Reviews carousel.", icon: Sparkles },
    { to: "/admin/featured-books", label: "Featured Books", count: counts.featured, desc: "Homepage Featured Books slider.", icon: BookOpen },
    { to: "/admin/news", label: "News", count: counts.news, desc: "Add, edit and publish news articles.", icon: Newspaper },
    { to: "/admin/author-reviews", label: "Author Reviews", count: counts.reviews, desc: "Quotes shown on the homepage.", icon: MessageSquareQuote },
    { to: "/admin/faqs", label: "FAQs", count: counts.faqs, desc: "Q&A entries on the FAQ page.", icon: HelpCircle },
    { to: "/admin/resources", label: "Resources", count: counts.resources, desc: "Resource pages under /resources.", icon: FileText },
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
