import { Link } from "react-router-dom";

const footerLinks = {
  pages: [
    { name: "Home", href: "/" },
    { name: "About us", href: "/about" },
    { name: "Buy a Book", href: "/books" },
    { name: "Publish a Book", href: "/how-to-publish" },
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

export function Footer() {
  return (
    <footer className="bg-[#1e2a33] text-white/80">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Connect Column */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white mb-6">
              Connect
            </h3>
            <div className="space-y-1 text-sm leading-relaxed">
              <p>Lady Stephenson Library,</p>
              <p>Newcastle upon Tyne</p>
              <p>NE6 2PA, United Kingdom</p>
            </div>
            <p className="mt-6 text-sm">admin@cambridgescholars.com</p>
          </div>

          {/* Pages Column */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white mb-6">
              Pages
            </h3>
            <ul className="space-y-3">
              {footerLinks.pages.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-white hover:underline transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links Column */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white mb-6">
              Other Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.otherLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-white hover:underline transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Registration */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <p className="text-sm text-white/80">
            Cambridge Scholars Publishing | Registration Number: 04333775
          </p>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
          <p className="text-sm text-white/80">
            Please note that Cambridge Scholars Publishing Limited is not affiliated to or associated with Cambridge University Press or the University of Cambridge.
          </p>
          <p className="text-sm text-white/80">
            Copyright © 2025 Cambridge Scholars Publishing. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
