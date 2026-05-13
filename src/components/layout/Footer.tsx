import { Link, useLocation } from "react-router-dom";

const footerLinks = {
  pages: [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Buy a Book", href: "/product" },
    { name: "Publish a Book", href: "/publish-a-book" },
    { name: "News", href: "/news" },
    { name: "FAQs", href: "/faqs" },
  ],
  otherLinks: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Cookies Policy", href: "/cookies-policy" },
    { name: "Terms and Conditions", href: "/terms-and-conditions" },
    { name: "Accessibility Statement", href: "/accessibility-policy" },
    { name: "Refund and Returns", href: "/refund-returns" },
  ],
};

export function Footer() {
  const location = useLocation();
  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  return (
    <footer className="bg-[#222222] text-[#ABABAB]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Top Grid - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Connect */}
          <div>
            <h3 className="text-white tracking-widest uppercase mb-6 text-[14px] font-bold font-nav">
              Connect
            </h3>
            <div className="space-y-1 text-[15px] leading-[1.8] font-baskerville text-[#ABABAB]">
              <p>Lady Stephenson Library,</p>
              <p>Newcastle upon Tyne</p>
              <p>NE6 2PA, United Kingdom</p>
            </div>
            <a
              href="mailto:admin@cambridgescholars.com"
              className="mt-6 text-[15px] block hover:text-white transition-colors font-baskerville text-[#ABABAB]"
            >
              admin@cambridgescholars.com
            </a>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-white tracking-widest uppercase mb-6 text-[14px] font-bold font-nav">
              Pages
            </h3>
            <ul className="space-y-4">
              {footerLinks.pages.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={`text-[15px] hover:text-white transition-colors font-baskerville italic ${
                      isActive(link.href)
                        ? "text-white border-b border-white pb-0.5"
                        : "text-[#ABABAB]"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="text-white tracking-widest uppercase mb-6 text-[14px] font-bold font-nav">
              Other Links
            </h3>
            <ul className="space-y-4">
              {footerLinks.otherLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={`text-[15px] hover:text-white transition-colors font-baskerville italic ${
                      isActive(link.href)
                        ? "text-white border-b border-white pb-0.5"
                        : "text-[#ABABAB]"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal Section */}
        <div className="mt-16 pt-8 text-[#FFFAFA] font-sans">
          <p className="text-xs">Cambridge Scholars Publishing | Registration Number: 04333775</p>
          <p className="mt-6 text-xs">
            Please note that Cambridge Scholars Publishing Limited is not
            affiliated to or associated with Cambridge University Press or the
            University of Cambridge.
          </p>
          <p className="mt-1 text-xs">
            Copyright © 2025 Cambridge Scholars Publishing.
            All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}