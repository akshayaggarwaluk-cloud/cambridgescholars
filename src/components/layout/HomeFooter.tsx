import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Buy a Book", href: "/product" },
  { name: "Publish a Book", href: "/publish-a-book" },
  { name: "FAQs", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

const socialLinks = [
  { icon: XIcon, href: "https://x.com/camscholars", label: "X (Twitter)" },
  { icon: Facebook, href: "https://www.facebook.com/cambridgescholarspublishing/", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/cambridgescholarsofficial/", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/cambridgescholarspublishing/", label: "LinkedIn" },
];

export function HomeFooter() {
  const location = useLocation();
  const isActiveRoute = (href: string) => location.pathname === href;
  return (
    <footer className="bg-[#f5f5f0] text-[#555555] relative">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="Cambridge Scholars Publishing"
            className="h-20"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-6 mb-8 px-0 md:gap-[60px]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "tracking-[0.2em] transition-colors font-nav text-[14px] uppercase pb-1 border-b-2",
                isActiveRoute(link.href)
                  ? "text-foreground border-foreground font-extrabold"
                  : "text-[#ababab] border-transparent hover:text-foreground font-bold"
              )}
              style={{ fontFamily: "'Nunito Sans', system-ui, sans-serif" }}
            >
              {link.name.toUpperCase()}
            </Link>
          ))}
        </nav>

        {/* Social Icons - exactly 4: Facebook, X, LinkedIn, Instagram */}
        <div className="flex justify-center gap-4 mb-8">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="w-10 h-10 rounded-full border border-[#cccccc] flex items-center justify-center text-[#666666] hover:text-foreground hover:border-[#999999] transition-colors"
            >
              {social.label === "X (Twitter)" ? (
                <XIcon />
              ) : (
                <social.icon className="w-4 h-4" />
              )}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center text-sm font-baskerville">
          <p>
            © 2025 Cambridge Scholars Publishing |{" "}
            <a
              href="mailto:admin@cambridgescholars.com"
              className="hover:text-foreground transition-colors"
            >
              admin@cambridgescholars.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
