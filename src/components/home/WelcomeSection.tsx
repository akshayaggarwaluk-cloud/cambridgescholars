import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";

const services = [
  {
    icon: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/Frame-2.png",
    title: "Buy a Book",
    description:
      "Browse our collection of academic titles available in hardback, paperback and eBook formats.",
    link: "/books",
  },
  {
    icon: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/Icons_1-removebg-preview-1.png",
    title: "Publish a Book",
    description:
      "Discover how we collaborate with authors to bring their research to a global audience.",
    link: "/publish-a-book",
  },
  {
    icon: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/Frame-21.png",
    title: "News",
    description:
      "News, updates and stories from across our academic publishing community.",
    link: "/news",
  },
];

export function WelcomeSection() {
  return (
    <section className="py-16 md:py-24 bg-white border-y border-border">
      <div className="container-wide">
        {/* Building Illustration */}
        <ScrollAnimation type="scale" className="flex justify-center mb-8">
          <img
            src="https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/10/Line-drawing-green-door-cropped-e1759655768727.png"
            alt="Cambridge Scholars Publishing building illustration"
            className="h-36 md:h-72 w-auto object-contain"
          />
        </ScrollAnimation>

        {/* Welcome Text */}
        <ScrollAnimation
          type="fadeUp"
          delay={0.1}
          className="max-w-3xl mx-auto text-center mb-14"
        >
          <h6 className="font-semibold uppercase tracking-[0.12em] mb-4 text-foreground text-lg">
            Welcome to Cambridge Scholars Publishing
          </h6>
          <p className="text-base md:text-lg leading-relaxed text-foreground/80">
            We are an independent academic publisher committed to advancing
            original research across the humanities, social sciences, physical
            sciences, life sciences and health sciences. Our titles are authored
            by scholars from around the world and are distributed globally in
            premium print and digital formats.
          </p>
        </ScrollAnimation>

        {/* 3 CTA Cards */}
        <StaggerContainer
          staggerDelay={0.15}
          className="grid md:grid-cols-3 gap-6 md:gap-8"
        >
          {services.map((service) => (
            <StaggerItem key={service.title}>
              <div className="group text-center p-6 md:p-8">
                {/* Icon */}
                <div className="flex items-center justify-center h-20 mb-6">
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="h-16 w-auto object-contain"
                  />
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mb-6 leading-relaxed text-sm md:text-base text-foreground/80">
                  {service.description}
                </p>

                {/* Read More Link */}
                <Link
                  to={service.link}
                  className="inline-flex items-center gap-2 text-accent font-medium text-sm uppercase tracking-wider group/link hover:gap-3 transition-all duration-300"
                >
                  <span className="relative">
                    READ MORE
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover/link:w-full" />
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
