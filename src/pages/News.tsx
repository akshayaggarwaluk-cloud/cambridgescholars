import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-[#f4f3ec] pt-28 sm:pt-32 pb-10 sm:pb-14 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-4xl sm:text-5xl font-serif text-gray-800">News</h1>
          <PageBreadcrumb currentPage="News" />
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <aside className="lg:col-span-1">
            <div className="mb-8">
              <h3 className="text-lg font-serif text-foreground mb-4 pb-2 border-b border-border">Search</h3>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-serif text-foreground mb-4 pb-2 border-b border-border">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full flex items-center justify-between text-sm py-1 transition-colors ${
                        selectedCategory === category
                          ? "text-accent font-medium"
                          : "text-muted-foreground hover:text-accent"
                      }`}
                    >
                      <span>{category}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{categoryCounts[category]}</span>
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-8">News</h1>

            {loading ? (
              <p className="text-muted-foreground">Loading…</p>
            ) : filteredArticles.length === 0 ? (
              <p className="text-muted-foreground">No articles found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredArticles.map((article) => (
                  <article key={article.id} className="group">
                    <Link to={`/news/${article.slug}`}>
                      {article.cover_image && (
                        <div className="aspect-[4/3] overflow-hidden mb-4">
                          <img
                            src={article.cover_image}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                    </Link>
                    <h2 className="text-xl font-serif text-foreground mb-3 group-hover:text-accent transition-colors">
                      <Link to={`/news/${article.slug}`}>{article.title}</Link>
                    </h2>
                    {article.excerpt && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">{article.excerpt}</p>
                    )}
                    <Link
                      to={`/news/${article.slug}`}
                      className="inline-flex items-center text-[#E4573D] font-medium text-sm hover:text-[#E4573D]/80 transition-colors"
                    >
                      READ MORE
                      <ChevronRight className="h-4 w-4 ml-1" />
                      <ChevronRight className="h-4 w-4 -ml-2" />
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
