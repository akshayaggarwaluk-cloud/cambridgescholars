import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";

export function CategoriesSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Browse by Category
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto" />
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((category, index) => (
            <Link
              key={category.id}
              to={`/books?category=${category.slug}`}
              className="group bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-md animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{category.icon}</span>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
              
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                {category.name}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {category.description}
              </p>
              
              <span className="text-xs text-accent font-medium">
                {category.bookCount} titles
              </span>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
