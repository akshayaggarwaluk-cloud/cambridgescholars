import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import { newsArticles, newsCategories } from "@/data/news";

const NewsArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const article = newsArticles.find((a) => a.slug === slug);

  // Count articles per category
  const categoryCounts = newsCategories.reduce((acc, category) => {
    if (category === "All") {
      acc[category] = newsArticles.length;
    } else {
      acc[category] = newsArticles.filter((a) => a.category === category).length;
    }
    return acc;
  }, {} as Record<string, number>);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/news?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/news?category=${encodeURIComponent(category)}`);
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <PageBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "News", href: "/news" },
              { label: "Article Not Found" },
            ]}
          />
          <div className="text-center py-16">
            <h1 className="text-2xl font-serif text-foreground mb-4">
              Article Not Found
            </h1>
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
      <main className="container mx-auto px-4 py-8">
        <PageBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "News", href: "/news" },
            { label: article.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            {/* Search */}
            <div className="mb-8">
              <h3 className="text-lg font-serif text-foreground mb-4 pb-2 border-b border-border">
                Search
              </h3>
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                </button>
              </form>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-serif text-foreground mb-4 pb-2 border-b border-border">
                Categories
              </h3>
              <ul className="space-y-2">
                {newsCategories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className="w-full flex items-center justify-between text-sm py-1 text-muted-foreground hover:text-accent transition-colors"
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

          {/* Article Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-8">
              {article.title}
            </h1>

            {/* Featured Image */}
            <div className="aspect-[16/9] overflow-hidden mb-8">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none text-foreground leading-relaxed text-justify"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author and Date */}
            <div className="mt-6 text-sm text-muted-foreground">
              <span>By {article.author}</span>
              <span className="mx-2">•</span>
              <span>
                {new Date(article.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewsArticle;
