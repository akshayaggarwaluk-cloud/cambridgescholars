import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Mail, Youtube } from "lucide-react";
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
    <footer className="bg-white text-black">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img src="/src/assets/logo.png" alt="Logo" className="h-20 w-auto" />
            </Link>

            <p className="text-black/70 mb-4 text-sm leading-relaxed max-w-xs">
              Independent academic publisher committed to advancing original research across the humanities, social
              sciences, and STEM disciplines.
            </p>

            <div className="flex gap-2">
              {[Facebook, Twitter, Linkedin, Youtube, Mail].map((Icon, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-black/70 hover:text-black hover:bg-black/10"
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-semibold text-xs uppercase tracking-wider mb-3">{section}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-sm text-black/70 hover:text-black transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-10 pt-8 border-t border-black/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-sm mb-1">Stay Updated</h3>
              <p className="text-xs text-black/70">Subscribe to receive news about new publications and events.</p>
            </div>
            <div className="flex gap-2 max-w-sm w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-9 text-sm bg-black/5 border-black/20 text-black placeholder:text-black/50 focus:border-black"
              />
              <Button className="h-9 bg-black hover:bg-black/90 text-white text-sm px-4">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-black/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-black/50">© 2024 Cambridge Scholars Publishing. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 text-xs text-black/50">
            <Link to="/privacy" className="hover:text-black transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-black transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-black transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
