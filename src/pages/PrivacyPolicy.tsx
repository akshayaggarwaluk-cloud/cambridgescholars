import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col pt-32 text-black">
      <Header />

      {/* Header Banner */}
      <div className="bg-[#f9f7f2] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-black">Privacy Policy</h1>
            <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
          </div>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-black">
          {/* Introduction */}
          <div className="mb-8">
            <p className="leading-relaxed text-black">
              Cambridge Scholars Publishing is committed to protecting your privacy and ensuring that your personal
              information is handled securely and responsibly.
            </p>
            <p className="leading-relaxed mt-4 text-black">
              This policy, together with our Terms and Conditions of Sale and any other referenced documents, explains
              how we collect, use and store your personal data when you use our website or interact with us.
            </p>
            <p className="leading-relaxed mt-4 text-black">
              We encourage you to read this policy carefully so that you understand how we process your information and
              your rights under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Who We Are */}
          <section className="mb-8">
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">Who We Are</h2>
            <p
              className="leading-relaxed text-black text-[15px]
"
            >
              For the purposes of data protection law, the data controller is Cambridge Scholars Publishing, Lady
              Stephenson Library, Welbeck Road, Newcastle upon Tyne, NE6 2PA, company registration number 4333775.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">Information We Collect</h2>
            <p
              className="leading-relaxed mb-4 text-black text-[15px]
"
            >
              We may collect and process the following information about you:
            </p>
            <ul
              className="list-disc list-inside space-y-2 text-black text-[15px]
"
            >
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
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">How We Use Your Information</h2>
            <p className="leading-relaxed mb-4 text-black text-[15px]">
              We process personal data for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-black text-[15px]">
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
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">Cookies</h2>
            <p
              className="leading-relaxed text-black text-[15px]
"
            >
              Our website uses cookies to improve your browsing experience. Cookies help us to:
            </p>
            <ul
              className="list-disc list-inside space-y-2 text-black text-[15px]
"
            >
              <li>Estimate visitor numbers and usage patterns</li>
              <li>Store information about your preferences</li>
              <li>Speed up searches</li>
              <li>Recognise you when you return to the site</li>
            </ul>
            <p
              className="text-black text-[15px]
"
            >
              You can disable cookies in your browser settings but some parts of the site may not function properly if
              you do so. For more information please see our Cookie Policy.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Where We Store Your Data */}
          <section className="mb-8">
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">Where We Store Your Data</h2>
            <p
              className="leading-relaxed mb-4 text-black text-[15px]
"
            >
              Your information may be transferred to and stored in locations outside the UK or European Economic Area.
              We will take all necessary steps to ensure that your data is processed securely and in line with this
              policy.
            </p>
            <p
              className="text-black text-[15px]
"
            >
              All information is stored on secure servers. Payment transactions are encrypted. Where you are given a
              password to access certain areas of the site you are responsible for keeping it confidential.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">Data Security</h2>
            <p
              className="leading-relaxed text-black text-[15px]
"
            >
              While we take all reasonable measures to protect your data, transmission over the internet is not
              completely secure. We cannot guarantee the security of data transmitted to our site and any transmission
              is at your own risk. Once we have received your information we use strict procedures and security measures
              to prevent unauthorised access.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Sharing Your Information */}
          <section className="mb-8">
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">Sharing Your Information</h2>
            <p
              className="leading-relaxed text-black text-[15px]
"
            >
              We may share your personal data in the following situations:
            </p>
            <ul
              className="list-disc list-inside space-y-2 text-black text-[15px]
"
            >
              <li>Where we are required to do so by law</li>
              <li>In connection with a business transfer such as the sale of assets</li>
              <li>
                With trusted third-party service providers who help us deliver our services such as payment processors
                or delivery partners
              </li>
            </ul>
            <p
              className="text-black text-[15px]
"
            >
              We do not sell your personal data to third parties.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">Your Rights</h2>
            <p
              className="leading-relaxed text-black text-[15px]
"
            >
              Under UK GDPR you have the right to:
            </p>
            <ul
              className="list-disc list-inside space-y-2 text-black text-[15px]
"
            >
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to certain types of processing including direct marketing</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p
              className="text-black text-[15px]
"
            >
              To exercise your rights please contact us using the details below.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Marketing Communications */}
          <section className="mb-8">
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">
              Marketing Communications and Legitimate Interest
            </h2>
            <p
              className="leading-relaxed text-black text-[15px]
"
            >
              We may contact you where we have a legitimate business interest, for example to provide information
              relevant to your professional work, invite you to publish with us or notify you of new titles.
            </p>
            <p
              className="text-black text-[15px]
"
            >
              You can opt out of marketing communications at any time by using the unsubscribe link in emails or by
              contacting us directly.
            </p>
            <p
              className="text-black text-[15px]
"
            >
              Our legitimate interests do not override your rights. We will not process your data where the impact on
              you outweighs our interest.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Changes */}
          <section className="mb-8">
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">Changes to This Policy</h2>
            <p
              className="leading-relaxed text-black text-[15px]
"
            >
              We may update this privacy policy from time to time. Any changes will be published on this page and we
              encourage you to review it regularly.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Contact */}
          <section className="mb-8">
            <h2 className="font-playfair text-[26px] font-semibold text-black mb-4">Contact Us</h2>
            <p
              className="leading-relaxed text-black text-[15px]
"
            >
              If you have any questions about this policy or how we process your data, please contact:
            </p>
            <p
              className="text-black text-[15px]
"
            >
              Cambridge Scholars Publishing
            </p>
            <p
              className="text-black text-[15px]
"
            >
              Lady Stephenson Library
            </p>
            <p
              className="text-black text-[15px]
"
            >
              Welbeck Road
            </p>
            <p
              className="text-black text-[15px]
"
            >
              Newcastle upon Tyne
            </p>
            <p
              className="text-black text-[15px]
"
            >
              NE6 2PA
            </p>
            <p
              className="text-black text-[15px]
"
            >
              Email: admin@cambridgescholars.com
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
