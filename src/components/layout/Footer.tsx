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
    <footer className="bg-[#222222] text-[#cfcfcf]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Connect */}
          <div>
            <h3 className="text-white text-m tracking-widest uppercase mb-6">Connect</h3>
            <div className="space-y-1 text-m leading-relaxed">
              <p>Lady Stephenson Library,</p>
              <p>Newcastle upon Tyne</p>
              <p>NE6 2PA, United Kingdom</p>
            </div>
            <p className="mt-6 text-m">admin@cambridgescholars.com</p>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-white text-m tracking-widest uppercase mb-6">Pages</h3>
            <ul className="space-y-3">
              {footerLinks.pages.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="italic text-m hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="text-white text-m tracking-widest uppercase mb-6">Other Links</h3>
            <ul className="space-y-3">
              {footerLinks.otherLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="italic text-m hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Registration */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-sm">Cambridge Scholars Publishing | Registration Number: 04333775</p>
        </div>
        <br></br>

        {/* Disclaimer */}
        <div className="mt-6 space-y-2 text-sm">
          <p>
            Please note that Cambridge Scholars Publishing Limited is not affiliated to or associated with Cambridge
            University Press or the University of Cambridge.
          </p>
          <p>Copyright © 2025 Cambridge Scholars Publishing. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
