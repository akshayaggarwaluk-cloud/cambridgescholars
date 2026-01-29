import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { books } from "@/data/books";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
export function FeaturedBookSpotlight() {
  // Get the first book as featured
  const featuredBook = books[0];
  return <section className="py-16 bg-background relative overflow-hidden md:py-[40px]">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/3 to-transparent" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Left - Book Cover */}
          <ScrollAnimation type="slideLeft" className="lg:col-span-2 flex justify-center lg:justify-start">
            <motion.div className="relative w-64 md:w-72 lg:w-full max-w-xs perspective-1000" whileHover={{
            scale: 1.02
          }} transition={{
            duration: 0.4
          }}>
              {/* Multiple layered shadows for depth */}
              <div className="absolute -inset-4 bg-accent/5 rounded-xl -z-10 blur-sm" />
              <div className="absolute -inset-2 bg-gradient-to-br from-accent/10 to-transparent rounded-lg -z-10" />
              
              {/* Floating glow */}
              <motion.div className="absolute -inset-8 bg-accent/10 rounded-full blur-3xl -z-20" animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }} transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }} />
              
              <motion.img src={featuredBook.image} alt={featuredBook.title} className="w-full h-auto shadow-xl rounded-sm relative z-10" whileHover={{
              rotateY: 5,
              rotateX: -2
            }} transition={{
              duration: 0.4
            }} style={{
              transformStyle: "preserve-3d"
            }} />
            </motion.div>
          </ScrollAnimation>

          {/* Right - Book Details */}
          <ScrollAnimation type="fadeUp" delay={0.2} className="lg:col-span-3 space-y-5">
            <motion.span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] bg-accent/10 px-4 py-2 rounded-full text-[#e5573e]" initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.3
          }}>
              <span className="w-2 h-2 rounded-full animate-pulse bg-[#e5573e]" />
              Featured Book
            </motion.span>
            
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              <Link to={`/books/${featuredBook.id}`} className="hover:text-accent transition-colors duration-300 block">
                {featuredBook.title}
              </Link>
            </h2>
            
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Link to={`/books?category=${featuredBook.category.toLowerCase()}`} className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                {featuredBook.category}
              </Link>
            </div>
            
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
              {featuredBook.description}
            </p>
            
            <p className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              £{featuredBook.price.toFixed(2)}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-accent hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                <Link to={`/books/${featuredBook.id}`} className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Quick View
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                <Link to={`/books/${featuredBook.id}`}>View Details</Link>
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground pt-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-muted-foreground rounded-full" />
              Available in multiple formats
            </p>
          </ScrollAnimation>
        </div>
      </div>
    </section>;
}