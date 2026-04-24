import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import { fetchPublishedNewsBySlug, type CmsNewsArticle } from "@/services/cmsService";

const NewsArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [article, setArticle] = useState<CmsNewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchPublishedNewsBySlug(slug)
      .then(setArticle)
      .catch((e) => console.error("Failed to load article:", e))
      .finally(() => setLoading(false));
  }, [slug]);

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
              <h3 className="text-lg font-serif text-foreground mb-4 pb-2 border-b border-border">Search</h3>
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </button>
              </form>
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
              <div
                className="prose prose-lg max-w-none font-baskerville text-[18px] leading-relaxed text-justify whitespace-pre-wrap text-[#333333]"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
              />
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
