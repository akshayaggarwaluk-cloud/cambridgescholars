import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/books";

export function CategoriesSection() {
  return (
    <section className="py-24 bg-secondary">
      <div className="container-wide">
        <div className="text-center mb-16">
          <p className="text-accent font-medium mb-2">Browse by</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Featured Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={`/books?category=${category.name.toLowerCase()}`}
              className="group bg-card rounded-2xl p-6 shadow-card hover-lift text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-5xl mb-4">{category.icon}</div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {category.description}
              </p>
              <div className="flex items-center justify-center gap-1 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Browse <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
