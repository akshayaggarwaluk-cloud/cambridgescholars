import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/books";

export function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="container-wide">
        <div className="text-center mb-16">
          <p className="text-accent font-medium mb-2">What Readers Say</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Testimonials
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl p-8 shadow-card animate-fade-up relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="absolute top-6 right-6 h-10 w-10 text-accent/20" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-foreground/80 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
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
