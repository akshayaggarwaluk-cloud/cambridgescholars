import { Link } from "react-router-dom";
import { BookOpen, Facebook, Twitter, Linkedin, Mail, Youtube } from "lucide-react";
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
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-accent" />
              <div className="flex flex-col">
                <span className="font-serif text-base font-semibold leading-none">Cambridge Scholars</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-primary-foreground/60">Publishing</span>
              </div>
            </Link>
            <p className="text-primary-foreground/70 mb-4 text-sm leading-relaxed max-w-xs">
              Independent academic publisher committed to advancing original research across the humanities, 
              social sciences, and STEM disciplines.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/10">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/10">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/10">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/10">
                <Youtube className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/10">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider mb-3">Shop</h3>
            <ul className="space-y-2">
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
            <h3 className="font-semibold text-xs uppercase tracking-wider mb-3">Publish</h3>
            <ul className="space-y-2">
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
            <h3 className="font-semibold text-xs uppercase tracking-wider mb-3">Company</h3>
            <ul className="space-y-2">
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
            <h3 className="font-semibold text-xs uppercase tracking-wider mb-3">Support</h3>
            <ul className="space-y-2">
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
        <div className="mt-10 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-sm mb-1">Stay Updated</h3>
              <p className="text-xs text-primary-foreground/70">
                Subscribe to receive news about new publications and events.
              </p>
            </div>
            <div className="flex gap-2 max-w-sm w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-9 text-sm bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-accent"
              />
              <Button className="h-9 bg-accent hover:bg-accent/90 text-accent-foreground text-sm px-4">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-primary-foreground/50">
            © 2024 Cambridge Scholars Publishing. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-primary-foreground/50">
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
