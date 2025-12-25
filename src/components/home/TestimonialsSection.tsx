import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/books";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  return (
    <section className="py-28 bg-background relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/50 rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative z-10">
        {/* Premium header */}
        <div className="text-center mb-20">
          <p className="text-accent font-medium mb-4 text-sm uppercase tracking-[0.2em]">What Readers Say</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-display-sm font-semibold text-foreground text-balance">
            Trusted by Book Lovers
          </h2>
          <div className="w-16 h-1 bg-gradient-gold rounded-full mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={cn(
                "group relative bg-card rounded-3xl p-8 transition-all duration-500",
                "border border-border/50 hover:border-accent/20",
                "shadow-card hover:shadow-card-hover",
                "animate-fade-up"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote icon with premium styling */}
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Quote className="h-5 w-5 text-accent" />
              </div>
              
              {/* Rating stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Testimonial content */}
              <p className="text-foreground/80 mb-8 leading-relaxed text-lg font-light italic">
                "{testimonial.content}"
              </p>

              {/* Author info with premium styling */}
              <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                <div className="relative">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-accent/20"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}