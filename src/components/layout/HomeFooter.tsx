import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram, Linkedin, ChevronUp } from "lucide-react";
import logo from "@/assets/logo.png";
const navLinks = [
  {
    name: "HOME",
    href: "/",
  },
  {
    name: "ABOUT US",
    href: "/about",
  },
  {
    name: "BUY A BOOK",
    href: "/books",
  },
  {
    name: "PUBLISH A BOOK",
    href: "/how-to-publish",
  },
  {
    name: "FAQS",
    href: "/faq",
  },
  {
    name: "CONTACT US",
    href: "/contact",
  },
];
const socialLinks = [
  {
    icon: Twitter,
    href: "#",
    label: "Twitter",
  },
  {
    icon: Facebook,
    href: "#",
    label: "Facebook",
  },
  {
    icon: Instagram,
    href: "#",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: "#",
    label: "LinkedIn",
  },
];
export function HomeFooter() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  return (
    <footer className="bg-[#f5f5f0] text-[#666666] relative">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Cambridge Scholars Publishing" className="h-20" />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-6 mb-8 px-0 md:gap-[60px]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-[#555555] tracking-wider hover:text-[#333333] transition-colors font-semibold text-base"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mb-8">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="w-10 h-10 rounded-full border border-[#cccccc] flex items-center justify-center text-[#666666] hover:text-[#333333] hover:border-[#999999] transition-colors"
            >
              <social.icon className="w-4 h-4" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center text-lg">
          <p>© 2025 Cambridge Scholars Publishing | admin@cambridgescholars.com</p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-6 right-6 w-10 h-10 bg-[#888888] hover:bg-[#666666] text-white flex items-center justify-center transition-colors z-50"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
