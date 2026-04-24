import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronsRight } from "lucide-react";
import { fetchHomepageNews, type CmsNewsArticle } from "@/services/cmsService";
import { Button } from "@/components/ui/button";

export const NewsSection = () => {
  const [articles, setArticles] = useState<CmsNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomepageNews()
      .then((data) => setArticles(data))
      .catch((err) => console.error("Failed to load news:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-14 md:py-[20px]">
      <div className="container-wide">
        <h2 className="text-3xl md:text-4xl font-baskerville text-center text-foreground mb-12 tracking-[0.05em]">
          News
        </h2>
        {loading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : articles.length === 0 ? (
          <p className="text-center text-muted-foreground">No news available at the moment.</p>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="group">
                {article.cover_image && (
                  <div className="aspect-[16/10] overflow-hidden mb-6">
                    <img
                      src={article.cover_image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="text-xl md:text-2xl font-serif text-foreground mb-4 leading-snug font-medium tracking-[0.02em]">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm leading-relaxed text-muted-foreground mb-5 text-justify line-clamp-4">
                    {article.excerpt}
                  </p>
                )}
                <Link
                  to={`/news/${article.slug}`}
                  className="inline-flex items-center gap-1 font-semibold text-xs uppercase tracking-[0.15em] text-[#e4573d] hover:text-[#e4573d]/80 transition-colors"
                >
                  READ MORE
                  <ChevronsRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Button asChild variant="gold" size="lg">
               <Link to="/news">VIEW</Link>
            </Button>
          </div>
          </>
        )}
      </div>
    </section>
  );
};
