import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col pt-32">
      <Header />

      {/* Header Banner */}
      <div className="bg-[#f9f7f2] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-5xl font-serif text-gray-800">Terms and Conditions</h1>
          <PageBreadcrumb currentPage="Terms and Conditions" />
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-muted-foreground leading-relaxed">
              These Terms and Conditions govern the direct sale of Cambridge Scholars Publishing titles to consumers.
            </p>
          </div>

          <Separator className="my-8" />

          {/* 1. Definitions */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">1. Definitions</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">The Company</strong> refers to Cambridge Scholars Publishing Ltd, a
              company registered in England and Wales, company registration number 04333775, VAT number 108280727.
              Registered address: Lady Stephenson Library, Welbeck Road, Newcastle upon Tyne, NE6 2PA, United Kingdom.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">The Customer</strong> refers to the person placing an order by any of
              the methods made available by the Company. These terms apply only to individuals purchasing for personal
              use as defined under UK consumer law.
            </p>
          </section>

          <Separator className="my-8" />

          {/* 2. Description of Items */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">2. Description of Items</h2>
            <p className="text-muted-foreground leading-relaxed">
              The books and other products available for sale are as described on the relevant pages of our website at{" "}
              <a href="https://www.cambridgescholars.com" className="text-red-500 hover:underline">
                www.cambridgescholars.com
              </a>
              .
            </p>
          </section>

          <Separator className="my-8" />

          {/* 3. Pricing and Taxes */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">3. Pricing and Taxes</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                All prices include applicable taxes. Books are currently zero rated for VAT in the UK so tax is not
                shown separately for these items.
              </li>
              <li>
                Any customs charges, import duties, VAT or other fees imposed outside the UK are the responsibility of
                the Customer. The Company cannot refund any charges for unclaimed books held at customs or other import
                locations.
              </li>
              <li>Prices are subject to change without notice.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              When ordering from outside the UK you are considered the importer and must comply with the laws of the
              country where you receive the goods. Customs policies vary so we advise checking with your local customs
              office for further information.
            </p>
          </section>

          <Separator className="my-8" />

          {/* 4. Delivery */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">4. Delivery</h2>
            <p className="text-muted-foreground leading-relaxed">
              Delivery costs are shown during the checkout process and on the ordering information page of our website.
              For large orders, the Company may be able to offer a reduced shipping rate but is not obliged to do so. A
              delivery date cannot be guaranteed. Postage charges will not be refunded for late deliveries.
            </p>
          </section>

          <Separator className="my-8" />

          {/* 5. Payment */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">5. Payment</h2>
            <p className="text-muted-foreground leading-relaxed">
              We accept payment by major credit and debit cards and PayPal. All payments are processed securely and we
              do not store your full card details on our servers.
            </p>
          </section>

          <Separator className="my-8" />

          {/* 6. Intellectual Property */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on this website, including text, images, graphics and logos, is the property of Cambridge
              Scholars Publishing or its licensors and is protected by copyright and other intellectual property laws.
              You may not reproduce, distribute or use any content without our prior written permission.
            </p>
          </section>

          <Separator className="my-8" />

          {/* 7. Limitation of Liability */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Company shall not be liable for any indirect, incidental or consequential damages arising from the use
              of our products or services. Our liability is limited to the purchase price of the items ordered.
            </p>
          </section>

          <Separator className="my-8" />

          {/* 8. Changes to Terms */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">8. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting
              on this website. Your continued use of the website constitutes acceptance of the updated terms.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Contact Us */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these terms, please contact us at{" "}
              <a href="mailto:admin@cambridgescholars.com" className="text-red-500 hover:underline">
                admin@cambridgescholars.com
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
