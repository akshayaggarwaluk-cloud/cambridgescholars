import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchPublishedNews, type CmsNewsArticle } from "@/services/cmsService";
import { fetchCategories, type CSPCategory } from "@/services/cspApi";

const News = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<CmsNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectCategories, setSubjectCategories] = useState<CSPCategory[]>([]);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPublishedNews()
      .then(setArticles)
      .catch((e) => console.error("Failed to load news:", e))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        const order = ["Social Sciences", "Physical Sciences", "Health Science", "Health Sciences", "Life Sciences", "All Categories"];
        const norm = (s: string) => (s || "").trim().toLowerCase();
        const dedupe = (list: CSPCategory[], parentName?: string, parentSlug?: string): CSPCategory[] =>
          (list || [])
            .filter((c) => !(parentName && (norm(c.name) === norm(parentName) || norm(c.slug) === norm(parentSlug || ""))))
            .map((c) => ({
              ...c,
              subcategories: c.subcategories ? dedupe(c.subcategories, c.name, c.slug) : c.subcategories,
            }));
        const cleaned = cats.map((c) => ({
          ...c,
          subcategories: c.subcategories ? dedupe(c.subcategories, c.name, c.slug) : c.subcategories,
        }));
        const sorted = [...cleaned].sort((a, b) => {
          const ai = order.indexOf(a.name);
          const bi = order.indexOf(b.name);
          if (ai === -1 && bi === -1) return 0;
          if (ai === -1) return 1;
          if (bi === -1) return -1;
          return ai - bi;
        });
        setSubjectCategories(sorted);
      })
      .catch((e) => console.error("Failed to load categories:", e));
  }, []);

  const goToBooks = (slug: string) => {
    navigate(`/books?category=${encodeURIComponent(slug)}`);
  };

  const filteredArticles = articles.filter((article) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      article.title.toLowerCase().includes(q) ||
      (article.excerpt || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">News</h1>
          <PageBreadcrumb currentPage="News" />
        </div>
      </div>
      <main className="container-wide py-8 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <aside className="lg:col-span-1 lg:w-72 flex-shrink-0">
            {/* Search Section */}
            <div className="mb-10">
              <h3 className="font-baskerville text-[24px] font-normal text-[#333333] mb-4 pb-3 border-b border-[#E5E1D8]">Search</h3>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 h-12 text-base border-white bg-[#f7f7f7]"
                />
                <button className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center border-l transition-colors border-white bg-[#f7f7f7]">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Subject Categories */}
            <div>
              <h3 className="font-baskerville text-[24px] font-normal text-[#333333] mb-4 pb-3 border-b border-[#E5E1D8]">
                Subject Categories
              </h3>
              {subjectCategories.length > 0 ? (
                <ul className="space-y-1">
                  {subjectCategories.map((cat) => {
                    const isExpanded = expandedCats.has(cat.slug);
                    const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                    return (
                      <li key={cat.slug}>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => goToBooks(cat.slug)}
                            className="text-left font-baskerville text-[15px] py-2 transition-colors font-normal text-[#C5A374] hover:text-[#C75B2A]"
                          >
                            {cat.name}
                          </button>
                          <div className="flex items-center gap-2">
                            <span className="bg-[#F1EFEA] rounded-full px-3 py-1 min-w-[44px] text-center font-baskerville text-xs text-[#555555]">
                              {cat.book_count}
                            </span>
                            <button
                              onClick={() => {
                                if (!hasSubs) return;
                                setExpandedCats((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(cat.slug)) next.delete(cat.slug);
                                  else next.add(cat.slug);
                                  return next;
                                });
                              }}
                              className={cn(
                                "p-0.5 w-5 h-5 flex items-center justify-center",
                                hasSubs ? "text-[#C5A374] hover:text-[#C75B2A]" : "invisible pointer-events-none",
                              )}
                              aria-hidden={!hasSubs}
                              tabIndex={hasSubs ? 0 : -1}
                            >
                              <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
                            </button>
                          </div>
                        </div>
                        {hasSubs && isExpanded && (
                          <ul className="ml-4 mt-1 space-y-0.5">
                            {cat.subcategories!.map((sub) => (
                              <li key={sub.slug}>
                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() => goToBooks(sub.slug)}
                                    className="text-left font-baskerville text-[13px] py-1.5 transition-colors text-[#555555] hover:text-[#C75B2A] font-normal"
                                  >
                                    {sub.name}
                                  </button>
                                  <span className="text-[12px] text-[#555555] bg-[#F1EFEA] rounded-full px-2.5 py-0.5 min-w-[40px] text-center font-baskerville">
                                    {sub.book_count}
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                  <li>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => navigate("/books")}
                        className="text-left font-baskerville text-[15px] py-2 transition-colors text-[#C5A374] hover:text-[#C75B2A] font-normal"
                      >
                        All Categories
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="bg-[#F1EFEA] rounded-full px-3 py-1 min-w-[44px] text-center font-baskerville text-xs text-[#555555]">
                          {subjectCategories.reduce((sum, c) => sum + c.book_count, 0)}
                        </span>
                        <span className="p-0.5 w-5 h-5 invisible" aria-hidden="true" />
                      </div>
                    </div>
                  </li>
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Loading categories...</p>
              )}
            </div>
          </aside>

          <div className="lg:col-span-3">
            {loading ? (
              <p className="text-muted-foreground">Loading…</p>
            ) : filteredArticles.length === 0 ? (
              <p className="text-muted-foreground">No articles found.</p>
            ) : (
              <div className="space-y-12">
                {filteredArticles.map((article) => (
                  <article key={article.id} className="group">
                    <Link to={`/news/${article.slug}`}>
                      {article.cover_image && (
                        <div className="aspect-[16/9] overflow-hidden mb-6">
                          <img
                            src={article.cover_image}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                    </Link>
                    <h2 className="text-3xl md:text-[34px] leading-tight font-baskerville text-foreground mb-4 group-hover:text-[#C75B2A] transition-colors">
                      <Link to={`/news/${article.slug}`}>{article.title}</Link>
                    </h2>
                    {article.excerpt && (
                       <p className="text-[16px] leading-relaxed mb-5 line-clamp-3 text-black" style={{ fontFamily: "'Nunito Sans', system-ui, sans-serif" }}>{article.excerpt}</p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default News;
