import { Link } from "react-router-dom";
import { BookOpen, PenLine, Newspaper, ArrowRight } from "lucide-react";

const services = [
  {
    icon: BookOpen,
    title: "Buy a Book",
    description: "Browse our collection of academic titles available in hardback, paperback and eBook formats.",
    link: "/books",
    linkText: "Browse Shop"
  },
  {
    icon: PenLine,
    title: "Publish a Book",
    description: "Discover how we collaborate with authors to bring their research to a global audience.",
    link: "/publish",
    linkText: "Submit Proposal"
  },
  {
    icon: Newspaper,
    title: "News",
    description: "News, updates and stories from across our academic publishing community.",
    link: "/news",
    linkText: "Read More"
  }
];

export function WelcomeSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container-wide">
        {/* Welcome Message */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
            Welcome to Cambridge Scholars Publishing
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We are an independent academic publisher committed to advancing original research across the humanities, 
            social sciences, physical sciences, life science and health sciences. Our titles are authored by scholars 
            from around the world and are distributed globally in premium print and digital formats.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-card border border-border rounded-lg p-8 text-center transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6 group-hover:bg-accent/20 transition-colors">
                <service.icon className="h-8 w-8 text-accent" />
              </div>
              
              <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <Link
                to={service.link}
                className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
              >
                {service.linkText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
