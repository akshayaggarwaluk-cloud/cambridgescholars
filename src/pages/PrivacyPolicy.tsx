import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col pt-32">
      <Header />

      {/* Header Banner */}
      <div className="bg-[#f9f7f2] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className=" text-3xl md:text-4xl font-bold text-primary text-black">Privacy Policy</h1>
            <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
          </div>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-muted-foreground leading-relaxed">
              Cambridge Scholars Publishing is committed to protecting your privacy and ensuring that your personal
              information is handled securely and responsibly.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              This policy, together with our Terms and Conditions of Sale and any other referenced documents, explains
              how we collect, use and store your personal data when you use our website or interact with us.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We encourage you to read this policy carefully so that you understand how we process your information and
              your rights under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Who We Are */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">Who We Are</h2>
            <p className="text-muted-foreground leading-relaxed">
              For the purposes of data protection law, the data controller is Cambridge Scholars Publishing, Lady
              Stephenson Library, Welbeck Road, Newcastle upon Tyne, NE6 2PA, company registration number 4333775.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may collect and process the following information about you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                Information you provide when completing forms on our website such as when registering for an account,
                signing up to our mailing list or submitting a proposal
              </li>
              <li>Details you provide when contacting us, including any correspondence</li>
              <li>Information you provide through surveys or feedback forms where participation is optional</li>
              <li>
                Details of your visits to our site including traffic data, location data, IP address, browser type,
                operating system and pages accessed
              </li>
            </ul>
          </section>

          <Separator className="my-8" />

          {/* How We Use Your Information */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We process personal data for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>To provide information, products or services that you request from us</li>
              <li>To fulfil our contractual obligations such as processing and delivering book orders</li>
              <li>To communicate important updates about our services</li>
              <li>To improve our website and tailor content to your preferences</li>
              <li>
                To send marketing communications where you have given consent or where we have a legitimate business
                interest
              </li>
            </ul>
          </section>

          <Separator className="my-8" />

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website uses cookies to improve your browsing experience. Cookies help us to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Estimate visitor numbers and usage patterns</li>
              <li>Store information about your preferences</li>
              <li>Speed up searches</li>
              <li>Recognise you when you return to the site</li>
            </ul>
            <p>
              You can disable cookies in your browser settings but some parts of the site may not function properly if
              you do so. For more information please see our Cookie Policy.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Under data protection law, you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <Separator className="my-8" />

          {/* Contact Us */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this privacy policy or wish to exercise any of your rights, please contact
              us at{" "}
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

export default PrivacyPolicy;
