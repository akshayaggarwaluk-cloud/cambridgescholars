import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, ChevronUp } from "lucide-react";
import logo from "@/assets/logo.png";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Buy a Book", href: "/books" },
  { name: "Publish a Book", href: "/publish-a-book" },
  { name: "FAQs", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/CambridgeScholarsPublishing", label: "Facebook" },
  { icon: XIcon, href: "https://twitter.com/CSPPublishing", label: "X (Twitter)" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/cambridge-scholars-publishing", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/cambridgescholarspublishing", label: "Instagram" },
];

export function HomeFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

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
              className="text-[#555555] tracking-wider hover:text-foreground transition-colors font-semibold text-base"
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
        <div className="text-center text-lg">
          <p>
            © {new Date().getFullYear()} Cambridge Scholars Publishing |{" "}
            <a
              href="mailto:admin@cambridgescholars.com"
              className="hover:text-foreground transition-colors"
            >
              admin@cambridgescholars.com
            </a>
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-6 right-6 w-10 h-10 bg-accent hover:bg-accent/80 text-accent-foreground flex items-center justify-center transition-colors z-50 rounded"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
