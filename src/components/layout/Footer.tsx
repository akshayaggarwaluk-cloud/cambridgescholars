import { Link } from "react-router-dom";
import { BookOpen, Facebook, Instagram, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  shop: [
    { name: "All Books", href: "/books" },
    { name: "New Releases", href: "/books?sort=newest" },
    { name: "Bestsellers", href: "/books?sort=popular" },
    { name: "Categories", href: "/categories" },
  ],
  publish: [
    { name: "Submit a Proposal", href: "/publish" },
    { name: "Author Guidelines", href: "/publish#guidelines" },
    { name: "Publication Process", href: "/publish#process" },
    { name: "FAQ", href: "/faq" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "News", href: "/news" },
    { name: "Authors", href: "/authors" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "Help Center", href: "/faq" },
    { name: "Shipping", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <BookOpen className="h-7 w-7 text-accent" />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-semibold leading-none">Cambridge Scholars</span>
                <span className="text-[10px] uppercase tracking-widest text-primary-foreground/60">Publishing</span>
              </div>
            </Link>
            <p className="text-primary-foreground/70 mb-6 text-sm leading-relaxed">
              Independent academic publisher committed to advancing original research across the humanities, 
              social sciences, and STEM disciplines.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/10">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/10">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/10">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/10">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Publish</h3>
            <ul className="space-y-3">
              {footerLinks.publish.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-semibold mb-1">Stay Updated</h3>
              <p className="text-sm text-primary-foreground/70">
                Subscribe to receive news about new publications and events.
              </p>
            </div>
            <div className="flex gap-2 max-w-md w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-accent"
              />
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-primary-foreground/50">
            © 2024 Cambridge Scholars Publishing. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/50">
            <Link to="/privacy" className="hover:text-primary-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-primary-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
