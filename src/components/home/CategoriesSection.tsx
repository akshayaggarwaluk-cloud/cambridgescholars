import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/books";
import { cn } from "@/lib/utils";

export function CategoriesSection() {
  return (
    <section className="py-28 bg-secondary relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10">
        {/* Premium header */}
        <div className="text-center mb-20">
          <p className="text-accent font-medium mb-4 text-sm uppercase tracking-[0.2em]">Browse by</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-display-sm font-semibold text-foreground text-balance">
            Featured Categories
          </h2>
          <div className="w-16 h-1 bg-gradient-gold rounded-full mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={`/books?category=${category.name.toLowerCase()}`}
              className={cn(
                "group relative bg-card rounded-2xl p-8 text-center transition-all duration-500",
                "border border-border/50 hover:border-accent/30",
                "shadow-card hover:shadow-card-hover hover:-translate-y-2",
                "animate-fade-up"
              )}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="text-5xl mb-5 transition-transform duration-500 group-hover:scale-110">
                  {category.icon}
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {category.description}
                </p>
                <div className="flex items-center justify-center gap-2 text-accent text-sm font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Browse <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}