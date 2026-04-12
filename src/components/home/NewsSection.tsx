import { Link } from "react-router-dom";
import { newsArticles } from "@/data/news";
import { ChevronsRight } from "lucide-react";

export const NewsSection = () => {
  const featuredNews = newsArticles
    .filter((article) => article.featured)
    .slice(0, 3);

  if (featuredNews.length === 0) {
    return null;
  }

  return (
    <section className="py-14 md:py-[20px]">
      <div className="container-wide">
        <h2 className="text-3xl md:text-4xl font-serif italic text-center text-foreground mb-12">
          News
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredNews.map((article) => (
            <article key={article.id} className="group">
              <div className="aspect-[16/10] overflow-hidden mb-6">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-normal text-foreground mb-4 leading-snug">{article.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-5 text-justify line-clamp-4">{article.excerpt}</p>
              <Link to={`/news/${article.slug}`} className="inline-flex items-center gap-1 font-semibold text-xs uppercase tracking-[0.15em] text-accent hover:text-accent/80 transition-colors">
                READ MORE
                <ChevronsRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
