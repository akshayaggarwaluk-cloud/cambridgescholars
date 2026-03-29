import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const footerLinks = {
  pages: [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Buy a Book", href: "/books" },
    { name: "Publish a Book", href: "/publish-a-book" },
    { name: "News", href: "/news" },
    { name: "FAQs", href: "/faq" },
  ],
  otherLinks: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookies Policy", href: "/cookies" },
    { name: "Terms and Conditions", href: "/terms" },
    { name: "Accessibility Statement", href: "/accessibility" },
    { name: "Refund and Returns", href: "/returns" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/cambridgescholarspublishing/", label: "Facebook" },
  { icon: XIcon, href: "https://x.com/camscholars", label: "X (Twitter)" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/cambridgescholarspublishing/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/cambridgescholarsofficial/", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="bg-[#222222] text-[#cfcfcf]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Top Grid - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Connect */}
          <div>
            <h3 className="text-white tracking-widest uppercase mb-6 text-lg font-semibold">
              Connect
            </h3>
            <div className="space-y-1 text-lg leading-relaxed">
              <p>Lady Stephenson Library,</p>
              <p>Newcastle upon Tyne</p>
              <p>NE6 2PA, United Kingdom</p>
            </div>
            <a
              href="mailto:admin@cambridgescholars.com"
              className="mt-6 text-lg block hover:text-white transition-colors"
            >
              admin@cambridgescholars.com
            </a>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-[#555] flex items-center justify-center text-[#cfcfcf] hover:text-white hover:border-white transition-colors"
                >
              {social.label === "X (Twitter)" ? (
                <XIcon />
              ) : (
                <social.icon className="w-4 h-4" />
              )}
                </a>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-white tracking-widest uppercase mb-6 text-lg font-semibold">
              Pages
            </h3>
            <ul className="space-y-3">
              {footerLinks.pages.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-lg hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="text-white tracking-widest uppercase mb-6 text-lg font-semibold">
              Other Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.otherLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-lg hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal Section */}
        <div className="mt-16 pt-8 border-t border-white/10 space-y-4 text-sm text-[#999]">
          <p>Cambridge Scholars Publishing | Registration Number: 04333775</p>
          <p>
            Please note that Cambridge Scholars Publishing Limited is not
            affiliated to or associated with Cambridge University Press or the
            University of Cambridge.
          </p>
          <p>
            Copyright © {new Date().getFullYear()} Cambridge Scholars Publishing.
            All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
