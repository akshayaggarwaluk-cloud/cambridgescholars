import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const services = [
  {
    icon: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/Frame-2.png",
    title: "Buy a Book",
    description: "Browse our collection of academic titles available in hardback, paperback and eBook formats.",
    link: "/books",
    linkText: "READ MORE",
  },
  {
    icon: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/Icons_1-removebg-preview-1.png",
    title: "Publish a Book",
    description: "Discover how we collaborate with authors to bring their research to a global audience.",
    link: "/publish",
    linkText: "READ MORE",
  },
  {
    icon: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/Frame-21.png",
    title: "News",
    description: "News, updates and stories from across our academic publishing community.",
    link: "/news",
    linkText: "READ MORE",
  },
];

export function WelcomeSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-wide">
        {/* Decorative Image */}
        <div className="flex justify-center mb-8">
          <img
            src="https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/10/Line-drawing-green-door-cropped-e1759655768727.png"
            alt="Cambridge Scholars Publishing"
            className="h-36 md:h-80 w-auto object-contain"
          />
        </div>

        {/* Welcome Message */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h6 className="text-s font-semibold uppercase tracking-[0.15em] text-accent mb-4">
            Welcome to Cambridge Scholars Publishing
          </h6>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            We are an independent academic publisher committed to advancing original research across the humanities,
            social sciences, physical sciences, life science and health sciences. Our titles are authored by scholars
            from around the world and are distributed globally in premium print and digital formats
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-card border border-border rounded-lg p-6 md:p-8 text-center transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-center h-20 mb-6">
                <img src={service.icon} alt={service.title} className="h-16 w-auto object-contain" />
              </div>

              <h3 className="font-serif text-xl font-semibold text-foreground mb-4">{service.title}</h3>

              <p className="text-muted-foreground mb-6 leading-relaxed text-sm md:text-base">{service.description}</p>

              <Link
                to={service.link}
                className="inline-flex items-center gap-2 text-accent font-medium text-sm uppercase tracking-wider hover:gap-3 transition-all"
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
