import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import {
  fetchPublishedNewsBySlug,
  type CmsNewsArticle,
} from "@/services/cmsService";
import { fetchCategories, type CSPCategory } from "@/services/cspApi";

const NewsArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [article, setArticle] = useState<CmsNewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CSPCategory[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchPublishedNewsBySlug(slug)
      .then(setArticle)
      .catch((e) => console.error("Failed to load article:", e))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        const order = [
          "Social Sciences",
          "Physical Sciences",
          "Health Science",
          "Health Sciences",
          "Life Sciences",
        ];
        const sorted = [...cats].sort((a, b) => {
          const ai = order.indexOf(a.name);
          const bi = order.indexOf(b.name);
          if (ai === -1 && bi === -1) return 0;
          if (ai === -1) return 1;
          if (bi === -1) return -1;
          return ai - bi;
        });
        setCategories(sorted);
      })
      .catch(() => setCategories([]));
  }, []);

  const totalBooks = categories.reduce((sum, c) => sum + (c.book_count || 0), 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/news?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 bg-white">
          <p className="text-center text-muted-foreground py-16">Loading…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 bg-white">
          <PageBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "News", href: "/news" },
              { label: "Article Not Found" },
            ]}
          />
          <div className="text-center py-16">
            <h1 className="text-2xl font-serif text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The article you are looking for does not exist.
            </p>
            <Link to="/news" className="text-accent hover:underline">
              Back to News
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">News</h1>
          <PageBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "News" },
            ]}
          />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="mb-8">
              <h3 className="text-2xl font-baskerville mb-4 pb-3 border-b border-border text-black">Search</h3>
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 rounded-none border-border h-11 font-serif italic text-muted-foreground placeholder:text-muted-foreground/70 bg-[#f7f7f7]"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-2xl font-baskerville mb-4 pb-3 border-b border-border text-black">Categories</h3>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      to={`/books?category=${encodeURIComponent(category.name)}`}
                      className="w-full flex items-center justify-between text-[15px] py-1 transition-colors text-[#C75B2A]/90 hover:text-[#C75B2A]"
                    >
                      <span className="font-serif text-[#c4a273]">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center min-w-[36px] h-6 px-2 rounded-full bg-[#F4F3EC] text-xs font-medium text-[#c4a273]">
                          {category.book_count}
                        </span>
                        <ChevronDown className="h-3 w-3 text-[#C75B2A]" />
                      </div>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/books"
                    className="w-full flex items-center justify-between text-[15px] py-1 transition-colors text-[#C75B2A]/90 hover:text-[#C75B2A]"
                  >
                    <span className="font-serif text-[#c4a273]">All Categories</span>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center min-w-[36px] h-6 px-2 rounded-full bg-[#F4F3EC] text-xs font-medium text-[#c4a273]">
                        {totalBooks}
                      </span>
                      <ChevronDown className="h-3 w-3 text-[#C75B2A]" />
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-3 order-1 lg:order-2">
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-8">{article.title}</h1>

            {article.cover_image && (
              <div className="aspect-[16/9] overflow-hidden mb-8">
                <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}

            {article.content && (
              <>
                <style>{`
                  .news-article-content,
                  .news-article-content * {
                    font-family: 'Nunito Sans', system-ui, sans-serif !important;
                  }
                  .news-article-content h1,
                  .news-article-content h2,
                  .news-article-content h3,
                  .news-article-content h4,
                  .news-article-content h5,
                  .news-article-content h6,
                  .news-article-content h1 *,
                  .news-article-content h2 *,
                  .news-article-content h3 *,
                  .news-article-content h4 *,
                  .news-article-content h5 *,
                  .news-article-content h6 * {
                    font-family: 'Libre Baskerville', Georgia, serif !important;
                  }
                `}</style>
                <div
                  className="news-article-content prose prose-lg max-w-none font-baskerville text-justify whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                />
              </>
            )}

            <div className="mt-6 text-sm text-muted-foreground">
              {article.author && (
                <>
                  <span>By {article.author}</span>
                  <span className="mx-2">•</span>
                </>
              )}
              <span>
                {new Date(article.published_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {article.category && (
                <>
                  <span className="mx-2">•</span>
                  <span>{article.category}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewsArticle;
