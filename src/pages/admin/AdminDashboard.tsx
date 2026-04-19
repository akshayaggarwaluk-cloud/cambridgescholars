import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Newspaper, ArrowRight } from "lucide-react";
import { adminApi } from "@/services/cmsService";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";

export default function AdminDashboard() {
  const { token } = useExternalAuth();
  const [counts, setCounts] = useState({ hero: 0, news: 0 });

  useEffect(() => {
    if (!token) return;
    Promise.all([adminApi.listHero(token), adminApi.listNews(token)])
      .then(([h, n]) => setCounts({ hero: h.length, news: n.length }))
      .catch(() => undefined);
  }, [token]);

  const tiles = [
    {
      to: "/admin/hero-slides",
      label: "Hero Slides",
      count: counts.hero,
      desc: "Manage the homepage Featured Reviews carousel.",
      icon: Sparkles,
    },
    {
      to: "/admin/news",
      label: "News",
      count: counts.news,
      desc: "Add, edit and publish news articles.",
      icon: Newspaper,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-baskerville text-3xl text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage homepage content. Changes appear instantly on the live site.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
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
