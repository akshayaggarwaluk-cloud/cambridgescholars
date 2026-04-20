import { Link } from "react-router-dom";
import { ChevronsRight } from "lucide-react";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";

const services = [
  {
    icon: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/Frame-2.png",
    title: "Buy a Book",
    description: "Browse our collection of academic titles available in hardback, paperback and eBook formats.",
    link: "/books",
  },
  {
    icon: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/Icons_1-removebg-preview-1.png",
    title: "Publish a Book",
    description: "Discover how we collaborate with authors to bring their research to a global audience.",
    link: "/publish-a-book",
  },
  {
    icon: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/Frame-21.png",
    title: "News",
    description: "News, updates and stories from across our academic publishing community.",
    link: "/news",
  },
];

export function WelcomeSection() {
  return (
    <section className="py-8 md:py-12">
      <div className="mx-4 sm:mx-6 lg:mx-8 bg-white rounded-sm py-10 md:py-14 px-6 sm:px-10 lg:px-16">
        {/* Building Illustration */}
        <ScrollAnimation type="scale" className="flex justify-center mb-8">
          <img
            src="https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/10/Line-drawing-green-door-cropped-e1759655768727.png"
            alt="Cambridge Scholars Publishing building illustration"
            className="h-36 md:h-72 w-auto object-contain"
          />
        </ScrollAnimation>

        {/* Welcome Text */}
        <ScrollAnimation type="fadeUp" delay={0.1} className="max-w-5xl mx-auto text-center mb-14">
          <h6 className="font-baskerville font-normal tracking-normal mb-8 text-foreground text-2xl sm:text-3xl md:text-[34px] leading-tight break-words inline-block">
            Welcome to Cambridge Scholars Publishing
          </h6>
          <p className="font-nav text-[15px] leading-loose max-w-[900px] mx-auto text-center text-[#333333]">
            We are an independent academic publisher committed to advancing original research across the humanities,
            social sciences, physical sciences, life sciences and health sciences. Our titles are authored by scholars
            from around the world and are distributed globally in premium print and digital formats.
          </p>
        </ScrollAnimation>

        {/* 3 CTA Cards */}
        <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service) => (
            <StaggerItem key={service.title}>
              <div className="group text-left p-6 md:p-8 flex flex-col h-full">
                {/* Icon + Title Row */}
                <div className="flex items-center gap-4 mb-6">
                  <img src={service.icon} alt={service.title} className="h-14 w-auto object-contain" />
                  <h3 className="font-baskerville text-foreground font-medium text-3xl">{service.title}</h3>
                </div>

                {/* Description */}
                <p className="font-nav mb-6 leading-relaxed text-sm md:text-base text-[#333333]">{service.description}</p>

                {/* Read More Link */}
                <Link
                  to={service.link}
                  className="font-nav inline-flex items-center gap-2 text-accent uppercase tracking-[0.15em] group/link hover:gap-3 transition-all duration-300 text-sm font-medium"
                >
                  READ MORE
                  <ChevronsRight className="h-4 w-4" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
