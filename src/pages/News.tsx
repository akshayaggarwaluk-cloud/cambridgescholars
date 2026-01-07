import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import { newsArticles, newsCategories } from "@/data/news";

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles = newsArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Count articles per category
  const categoryCounts = newsCategories.reduce((acc, category) => {
    if (category === "All") {
      acc[category] = newsArticles.length;
    } else {
      acc[category] = newsArticles.filter((a) => a.category === category).length;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PageBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "News" },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Search */}
            <div className="mb-8">
              <h3 className="text-lg font-serif text-foreground mb-4 pb-2 border-b border-border">
                Search
              </h3>
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

            {/* Categories */}
            <div>
              <h3 className="text-lg font-serif text-foreground mb-4 pb-2 border-b border-border">
                Categories
              </h3>
              <ul className="space-y-2">
                {newsCategories.map((category) => (
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

          {/* News Grid */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-8">
              News
            </h1>

            {filteredArticles.length === 0 ? (
              <p className="text-muted-foreground">No articles found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredArticles.map((article) => (
                  <article key={article.id} className="group">
                    <Link to={`/news/${article.slug}`}>
                      <div className="aspect-[4/3] overflow-hidden mb-4">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <h2 className="text-xl font-serif text-foreground mb-3 group-hover:text-accent transition-colors">
                      <Link to={`/news/${article.slug}`}>{article.title}</Link>
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
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
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default News;
