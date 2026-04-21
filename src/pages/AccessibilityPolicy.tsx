import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";

const AccessibilityPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Header Banner */}
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Accessibility Policy</h1>
          <PageBreadcrumb currentPage="Accessibility Policy" />
        </div>
      </div>

      <main className="flex-1 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-black leading-relaxed text-[15px]">
              At Cambridge Scholars Publishing we are committed to making our website and digital content accessible to
              everyone, including people with disabilities. We aim to provide an inclusive online experience that allows
              all users to access our academic publications and resources without barriers.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Our Legal Commitment */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold text-[#333333] mb-3">Our Legal Commitment</h2>
            <p className="text-black leading-relaxed text-[15px]">
              As a private company operating in the United Kingdom we comply with the Equality Act 2010. This requires
              us to make reasonable adjustments to ensure that people with disabilities are not placed at a substantial
              disadvantage when using our services. Although the Public Sector Accessibility Regulations do not legally
              apply to us, we follow the recognised international standard known as the Web Content Accessibility
              Guidelines (WCAG) 2.1 Level AA to ensure our website meets accessibility best practice.
            </p>
          </section>

          <Separator className="my-8" />

          {/* What We Offer */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold text-[#333333] mb-3">What We Offer</h2>
            <ul className="list-disc list-inside space-y-2 text-[#333333] text-[16px] font-nav">
              <li>Academic publishing services</li>
              <li>Sale of books and eBooks to individuals and institutions</li>
              <li>
                Downloadable content such as PDFs and eBooks through third party platforms including Google Play and
                FlixRocket
              </li>
            </ul>
            <p className="text-black leading-relaxed mt-4 text-[15px]">
              We aim to ensure that all our digital content, including web pages and downloadable files, is accessible
              to as many users as possible.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Accessibility Features */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold text-[#333333] mb-3">Accessibility Features</h2>
            <p className="text-black leading-relaxed mb-4 text-[15px]">
              We have designed our website and digital content to be:
            </p>
            <ul className="space-y-3 text-[#333333] text-[16px] font-nav">
              <li>
                <strong className="text-black">Perceivable:</strong> Text alternatives are provided for images and
                multimedia, captions are included for videos and content is clear and readable.
              </li>
              <li>
                <strong className="text-black">Operable:</strong> The website can be fully navigated using a keyboard
                and the interface is user friendly.
              </li>
              <li>
                <strong className="text-black">Understandable:</strong> Content is written in clear language and follows
                a consistent layout.
              </li>
              <li>
                <strong className="text-black">Robust:</strong> Our content is compatible with screen readers and other
                assistive technologies.
              </li>
            </ul>
          </section>

          <Separator className="my-8" />

          {/* Ongoing Improvements and Testing */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold text-[#333333] mb-3">Ongoing Improvements and Testing</h2>
            <p className="text-black leading-relaxed text-[15px]">
              Accessibility is an ongoing priority for us. We test our website using both automated tools and manual
              checks, including keyboard navigation and screen readers, to identify and fix any issues. We plan to carry
              out regular audits to maintain and improve our accessibility standards.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Feedback and Assistance */}
          <section className="mb-8">
            <h2 className="font-nav text-[18px] font-bold text-[#333333] mb-3">Feedback and Assistance</h2>
            <p className="text-black leading-relaxed mb-4 text-[15px]">
              If you experience any difficulty accessing any part of our website or digital content, or if you require
              materials in an alternative format, please contact us:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#333333] text-[16px] font-nav">
              <li>
                Email:{" "}
                <a href="mailto:admin@cambridgescholars.com" className="text-red-500 hover:underline">
                  admin@cambridgescholars.com
                </a>
              </li>
            </ul>
            <p className="text-black leading-relaxed mt-4 text-[15px]">
              We welcome your feedback and will do our best to respond to your requests in a timely manner.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccessibilityPolicy;
