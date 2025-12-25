import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bookstore.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with parallax effect */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Cozy bookstore interior"
          className="w-full h-full object-cover scale-105"
        />
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-primary/30" />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gold accent orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Content */}
      <div className="container-wide relative z-10 py-32">
        <div className="max-w-2xl">
          {/* Premium badge */}
          <div 
            className="inline-flex items-center gap-2 bg-accent/15 backdrop-blur-sm text-accent px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-accent/20 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <Sparkles className="h-4 w-4" />
            <span>Curated Collections for Discerning Readers</span>
          </div>

          {/* Main heading with elegant typography */}
          <h1
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-primary-foreground leading-[1.1] mb-8 animate-fade-up text-balance"
            style={{ animationDelay: "0.2s" }}
          >
            Where Stories
            <span className="block mt-2">
              Come to <span className="text-gradient-gold">Life</span>
            </span>
          </h1>

          {/* Decorative line */}
          <div 
            className="w-20 h-1 bg-gradient-gold rounded-full mb-8 animate-fade-up"
            style={{ animationDelay: "0.25s" }}
          />

          <p
            className="text-xl md:text-2xl text-primary-foreground/80 mb-10 leading-relaxed animate-fade-up font-light"
            style={{ animationDelay: "0.3s" }}
          >
            Discover bestselling novels, timeless classics, and curated collections 
            for every reader. Your next adventure awaits.
          </p>

          {/* Premium CTA buttons */}
          <div
            className="flex flex-wrap gap-5 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button asChild variant="hero" size="xl" className="group">
              <Link to="/books">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="hero-outline" size="xl">
              <Link to="/books">Browse Categories</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div 
            className="flex items-center gap-8 mt-14 pt-8 border-t border-primary-foreground/10 animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="text-center">
              <p className="text-3xl font-serif font-semibold text-primary-foreground">50k+</p>
              <p className="text-sm text-primary-foreground/60 mt-1">Books Available</p>
            </div>
            <div className="w-px h-12 bg-primary-foreground/20" />
            <div className="text-center">
              <p className="text-3xl font-serif font-semibold text-primary-foreground">15k+</p>
              <p className="text-sm text-primary-foreground/60 mt-1">Happy Readers</p>
            </div>
            <div className="w-px h-12 bg-primary-foreground/20" />
            <div className="text-center">
              <p className="text-3xl font-serif font-semibold text-primary-foreground">4.9</p>
              <p className="text-sm text-primary-foreground/60 mt-1">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-fade-up" style={{ animationDelay: "0.6s" }}>
        <span className="text-xs uppercase tracking-[0.2em] text-primary-foreground/50 font-medium">Scroll</span>
        <div className="w-6 h-10 border-2 border-primary-foreground/20 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-accent rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}