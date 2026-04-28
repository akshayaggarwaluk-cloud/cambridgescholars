import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
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

            {/* Categories */}
            <div>
              <h3 className="font-baskerville text-[24px] font-normal text-[#333333] mb-4 pb-3 border-b border-[#E5E1D8]">
                Categories
              </h3>
              {categories.length > 0 ? (
                <ul className="space-y-1">
                  {categories.map((category) => (
                    <li key={category}>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setSelectedCategory(category)}
                          className={cn(
                            "text-left font-baskerville text-[15px] py-2 transition-colors font-normal hover:text-[#C75B2A]",
                            selectedCategory === category ? "text-[#C75B2A]" : "text-[#C5A374]",
                          )}
                        >
                          {category}
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="bg-[#F1EFEA] rounded-full px-3 py-1 min-w-[44px] text-center font-baskerville text-xs text-[#555555]">
                            {categoryCounts[category]}
                          </span>
                          <span className="p-0.5 w-5 h-5 invisible" aria-hidden="true" />
                        </div>
                      </div>
                    </li>
                  ))}
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
                       <p className="text-[15px] leading-relaxed mb-5 line-clamp-3 font-serif text-black">{article.excerpt}</p>
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
