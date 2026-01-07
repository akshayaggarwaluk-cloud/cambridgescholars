import { Link } from "react-router-dom";
import { newsArticles } from "@/data/news";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NewsSection = () => {
  // Get first 3 featured articles
  const featuredNews = newsArticles.filter(article => article.featured).slice(0, 3);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-serif text-center text-foreground mb-12">
          News
        </h2>

        {/* News Grid */}
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
              <h3 className="text-xl font-serif text-foreground mb-3">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="text-muted-foreground text-sm leading-relaxed text-justify mb-4 line-clamp-3">
                {article.excerpt}
              </p>

              {/* Read More Link */}
              <Link
                to={`/news/${article.slug}`}
                className="inline-flex items-center text-accent font-medium text-sm hover:text-accent/80 transition-colors"
              >
                READ MORE
                <ChevronRight className="h-4 w-4 ml-1" />
                <ChevronRight className="h-4 w-4 -ml-2" />
              </Link>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <Button
            asChild
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-6 text-base"
          >
            <Link to="/news">VIEW</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
