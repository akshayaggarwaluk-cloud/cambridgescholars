import { BookOpen, Heart, Users, Award } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const values = [
  {
    icon: BookOpen,
    title: "Love for Literature",
    description: "We believe in the transformative power of stories to inspire, educate, and connect us all.",
  },
  {
    icon: Heart,
    title: "Reader First",
    description: "Every decision we make puts our readers at the center. Your reading experience matters most.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We're building a community of book lovers who share their passion and recommendations.",
  },
  {
    icon: Award,
    title: "Quality Curation",
    description: "Our team of literary experts carefully selects every title to ensure exceptional quality.",
  },
];

const timeline = [
  {
    year: "2015",
    title: "The Beginning",
    description: "Started as a small corner bookshop with just 500 titles and a dream to connect readers with great stories.",
  },
  {
    year: "2018",
    title: "Going Digital",
    description: "Launched our online platform to reach book lovers beyond our local community.",
  },
  {
    year: "2021",
    title: "Expansion",
    description: "Grew to over 50,000 titles and opened our second flagship store.",
  },
  {
    year: "2024",
    title: "Today",
    description: "Serving readers worldwide with curated collections and personalized recommendations.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24">
        {/* Hero */}
        <section className="py-24 bg-gradient-to-br from-primary via-primary to-charcoal-light text-primary-foreground">
          <div className="container-wide">
            <div className="max-w-3xl">
              <p className="text-accent font-medium mb-4">About Biblioscape</p>
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
                Our Story
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed">
                We're more than a bookstore. We're a haven for readers, a community 
                for book lovers, and a gateway to worlds yet to be discovered. Every 
                book we carry has been chosen with care, every recommendation made 
                with passion.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24">
          <div className="container-wide">
            <div className="text-center mb-16">
              <p className="text-accent font-medium mb-2">What We Believe</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Our Values
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="text-center p-8 bg-card rounded-2xl shadow-card animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                    <value.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-secondary">
          <div className="container-wide">
            <div className="text-center mb-16">
              <p className="text-accent font-medium mb-2">Our Journey</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                How We Grew
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className="flex gap-8 mb-12 last:mb-0 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
                      <span className="font-serif text-lg font-bold text-primary">
                        {item.year}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-24">
          <div className="container-wide">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <p className="font-serif text-5xl font-bold text-accent mb-2">50K+</p>
                <p className="text-muted-foreground">Books in Collection</p>
              </div>
              <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <p className="font-serif text-5xl font-bold text-accent mb-2">100K+</p>
                <p className="text-muted-foreground">Happy Readers</p>
              </div>
              <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <p className="font-serif text-5xl font-bold text-accent mb-2">15+</p>
                <p className="text-muted-foreground">Years Experience</p>
              </div>
              <div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
                <p className="font-serif text-5xl font-bold text-accent mb-2">4.9</p>
                <p className="text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
