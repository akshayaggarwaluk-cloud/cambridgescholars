import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bookstore.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Cozy bookstore interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
      </div>

      {/* Content */}
      <div className="container-wide relative z-10 py-32">
        <div className="max-w-2xl">
          <p className="text-accent font-medium mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Welcome to Biblioscape
          </p>
          <h1
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Where Stories Come to Life
          </h1>
          <p
            className="text-xl text-primary-foreground/80 mb-8 leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            Discover bestselling novels, timeless classics, and curated collections 
            for every reader. Your next adventure awaits between the pages.
          </p>
          <div
            className="flex flex-wrap gap-4 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/books">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="hero-outline" size="xl">
              <Link to="/books">Explore Categories</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
