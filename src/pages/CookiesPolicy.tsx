import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";

const CookiesPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col pt-32">
      <Header />
      
      {/* Header Banner */}
      <div className="bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary">
              Cookies Policy
            </h1>
            <PageBreadcrumb 
              items={[
                { label: "Home", href: "/" },
                { label: "Cookies Policy" }
              ]} 
            />
          </div>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-muted-foreground leading-relaxed">
              Cambridge Scholars Publishing uses cookies to improve your browsing experience and to understand how our website is used.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              A cookie is a small text file that is placed on your computer or device when you visit a website. Cookies allow websites to recognise your device and store certain information about your preferences or past actions.
            </p>
          </div>

          <Separator className="my-8" />

          {/* How We Use Cookies */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">How We Use Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use cookies to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Analyse website traffic and understand how visitors use our site</li>
              <li>Improve the performance and usability of the website</li>
              <li>Remember your preferences so that the site is more relevant to you</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The information collected is used for statistical purposes only and does not personally identify you.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Types of Cookies We Use */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">Types of Cookies We Use</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <strong className="text-foreground">Essential cookies</strong> – required for the website to function properly
              </li>
              <li>
                <strong className="text-foreground">Analytics cookies</strong> – help us understand how visitors use our site so we can improve it
              </li>
              <li>
                <strong className="text-foreground">Preference cookies</strong> – remember choices you make to enhance your experience
              </li>
            </ul>
          </section>

          <Separator className="my-8" />

          {/* Your Choices */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">Your Choices</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can choose to accept or decline cookies. Most web browsers automatically accept cookies but you can change your browser settings to refuse them if you prefer.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Please note that disabling cookies may limit the functionality of the website.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Third-Party Cookies */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may also use third-party cookies from services like Google Analytics to help us analyse website traffic. These cookies are governed by the privacy policies of the respective third parties.
            </p>
          </section>

          <Separator className="my-8" />

          {/* Contact Us */}
          <section className="mb-8">
            <h2 className="font-playfair text-2xl font-semibold text-primary mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about our use of cookies, please contact us at{" "}
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

export default CookiesPolicy;
