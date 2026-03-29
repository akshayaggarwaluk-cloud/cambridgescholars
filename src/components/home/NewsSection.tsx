import { Link } from "react-router-dom";
import { newsArticles } from "@/data/news";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NewsSection = () => {
  const featuredNews = newsArticles
    .filter((article) => article.featured)
    .slice(0, 3);

  return (
    <section className="py-8 md:py-12">
      <div className="container-wide bg-white border border-border rounded-sm py-10 md:py-14 px-6 sm:px-10 lg:px-16">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-serif text-center text-foreground mb-12">
          News
        </h2>

        {/* News Grid - 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredNews.map((article) => (
            <article key={article.id} className="group">
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden mb-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-serif text-foreground mb-3 leading-snug">
                {article.title}
              </h3>

              {/* Excerpt - no views/likes/comments/tags per spec */}
              <p className="text-sm leading-relaxed text-foreground/70 mb-4 line-clamp-3">
                {article.excerpt}
              </p>

              {/* Read More */}
              <Link
                to={`/news/${article.slug}`}
                className="inline-flex items-center font-medium text-sm transition-colors text-accent hover:text-accent/80"
              >
                Read More
                <ChevronRight className="h-4 w-4 ml-0.5" />
              </Link>
            </article>
          ))}
        </div>

        {/* View All */}
        <div className="flex justify-center mt-12">
          <Button
            asChild
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-6 text-sm tracking-wider"
          >
            <Link to="/news">VIEW</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
