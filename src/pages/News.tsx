import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { fetchPublishedNews, type CmsNewsArticle } from "@/services/cmsService";

const ALL = "All Categories";

const News = () => {
  const [articles, setArticles] = useState<CmsNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL);

  useEffect(() => {
    fetchPublishedNews()
      .then(setArticles)
      .catch((e) => console.error("Failed to load news:", e))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.category && set.add(a.category));
    return [ALL, ...Array.from(set)];
  }, [articles]);

  const filteredArticles = articles.filter((article) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      article.title.toLowerCase().includes(q) ||
      (article.excerpt || "").toLowerCase().includes(q);
    const matchesCategory =
      selectedCategory === ALL || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryCounts = categories.reduce(
    (acc, c) => {
      acc[c] = c === ALL ? articles.length : articles.filter((a) => a.category === c).length;
      return acc;
    },
    {} as Record<string, number>,
  );

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
          <aside className="lg:col-span-1">
            <div className="mb-8">
              <h3 className="text-2xl font-baskerville text-[#C75B2A] mb-4 pb-3 border-b border-border">Search</h3>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 rounded-none border-border bg-transparent h-11 font-serif italic text-muted-foreground placeholder:text-muted-foreground/70"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-baskerville text-[#C75B2A] mb-4 pb-3 border-b border-border">Categories</h3>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full flex items-center justify-between text-[15px] py-1 transition-colors ${
                        selectedCategory === category
                          ? "text-[#C75B2A] font-medium"
                          : "text-[#C75B2A]/90 hover:text-[#C75B2A]"
                      }`}
                    >
                      <span className="font-serif">{category}</span>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center min-w-[36px] h-6 px-2 rounded-full bg-[#F4F3EC] text-[#C75B2A] text-xs font-medium">
                          {categoryCounts[category]}
                        </span>
                        <ChevronDown className="h-3 w-3 text-[#C75B2A]" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
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
                      <p className="text-foreground/80 text-[15px] leading-relaxed mb-5 line-clamp-3">{article.excerpt}</p>
                    )}
                    <Link
                      to={`/news/${article.slug}`}
                      className="inline-flex items-center font-semibold text-xs uppercase tracking-[0.15em] text-[#C75B2A] hover:text-[#C75B2A]/80 transition-colors"
                    >
                      READ MORE
                      <span className="ml-1">›››</span>
                    </Link>
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
