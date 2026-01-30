import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";
const services = [{
  icon: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/Frame-2.png",
  title: "Buy a Book",
  description: "Browse our collection of academic titles available in hardback, paperback and eBook formats.",
  link: "/books",
  linkText: "READ MORE",
  gradient: "from-accent/5 to-accent/10"
}, {
  icon: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/Icons_1-removebg-preview-1.png",
  title: "Publish a Book",
  description: "Discover how we collaborate with authors to bring their research to a global audience.",
  link: "/publish",
  linkText: "READ MORE",
  gradient: "from-primary/5 to-primary/10"
}, {
  icon: "https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/08/Frame-21.png",
  title: "News",
  description: "News, updates and stories from across our academic publishing community.",
  link: "/news",
  linkText: "READ MORE",
  gradient: "from-accent/5 to-primary/5"
}];
export function WelcomeSection() {
  return <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 lines-pattern opacity-50" />
      
      <div className="container-wide relative z-10">
        {/* Decorative Image */}
        <ScrollAnimation type="scale" className="flex justify-center mb-8">
          <motion.img src="https://camschl-wordpress-uploads.s3.eu-west-1.amazonaws.com/wp-content/uploads/2025/10/Line-drawing-green-door-cropped-e1759655768727.png" alt="Cambridge Scholars Publishing" className="h-36 md:h-80 w-auto object-contain" whileHover={{
          scale: 1.02
        }} transition={{
          duration: 0.4
        }} />
        </ScrollAnimation>

        {/* Welcome Message */}
        <ScrollAnimation type="fadeUp" delay={0.1} className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h6 className="font-semibold uppercase tracking-[0.15em] mb-4 text-black text-xl">
            Welcome to Cambridge Scholars Publishing
          </h6>
          <p className="text-base md:text-lg leading-relaxed text-black">
            We are an independent academic publisher committed to advancing original research across the humanities,
            social sciences, physical sciences, life science and health sciences. Our titles are authored by scholars
            from around the world and are distributed globally in premium print and digital formats
          </p>
        </ScrollAnimation>

        {/* Service Cards */}
        <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-6 md:gap-8">
          {services.map(service => <StaggerItem key={service.title}>
              <motion.div className="group bg-background p-6 md:p-8 text-center" whileHover={{
            y: -4
          }} transition={{
            duration: 0.3,
            ease: [0.25, 0.4, 0.25, 1]
          }}>
                  <motion.div className="flex items-center justify-center h-20 mb-6" whileHover={{
                scale: 1.1,
                rotate: 2
              }} transition={{
                duration: 0.3
              }}>
                    <img src={service.icon} alt={service.title} className="h-16 w-auto object-contain" />
                  </motion.div>

                  <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                    {service.title}
                  </h3>

                  <p className="mb-6 leading-relaxed text-sm md:text-base text-muted-foreground">
                    {service.description}
                  </p>

                  <Link to={service.link} className="inline-flex items-center gap-2 text-accent font-medium text-sm uppercase tracking-wider group/link">
                    <span className="relative">
                      {service.linkText}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover/link:w-full" />
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-2" />
                  </Link>
              </motion.div>
            </StaggerItem>)}
        </StaggerContainer>
      </div>
    </section>;
}