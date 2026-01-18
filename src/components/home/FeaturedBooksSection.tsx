import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

export default function AboutSection() {
  return (
    <>
      <Header />

      {/* PAGE HEADER */}
      <div className="pt-32 bg-[#f9f7f2] py-10 px-6 md:px-16">
        <div className="max-w-8xl mx-auto flex justify-between items-center">
          <h1 className="text-5xl font-serif text-gray-800">About Us</h1>
          <PageBreadcrumb currentPage="About Us" />
        </div>
      </div>

      {/* FIRST SECTION */}
      <section className="w-full px-6 md:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          {/* LEFT — TEXT */}
          <div className="space-y-6 leading-relaxed">
            <p>
              Founded in 2001 by a group of academics, Cambridge Scholars Publishing is an independent academic
              publisher with a strong commitment to original scholarship and academic excellence.
            </p>

            <p>
              We specialise in publishing <strong>monographs, edited collections, and thesis-based works</strong>
              across a broad range of disciplines.
            </p>

            <h2 className="text-2xl font-semibold">What We Do</h2>

            <p>At Cambridge Scholars, we support authors at every stage of the publishing journey.</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>No charges to authors</strong> – no submission fees.
              </li>
              <li>
                <strong>Royalties from the first sale</strong>.
              </li>
              <li>
                <strong>Comprehensive editorial support</strong>.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold">Global Distribution</h2>

            <p>Our titles are distributed globally through academic and commercial networks.</p>
            <p>
              We offer a unique <strong>Print-on-Time</strong> system ensuring titles remain available.
            </p>
          </div>

          {/* RIGHT — IMAGE (HEIGHT MATCHES TEXT) */}
          <div className="relative min-h-[520px] md:min-h-full">
            <img
              src="/lovable-uploads/d53bdc66-5423-4a11-8c1d-a9166b55ead1.png"
              alt="Decorative"
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow"
            />
          </div>
        </div>
      </section>

      {/* SECOND SECTION */}
      <section className="w-full px-6 md:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          {/* LEFT — IMAGE */}
          <div className="relative min-h-[520px] md:min-h-full">
            <img
              src="/lovable-uploads/3f1259fa-8061-4dd4-9451-dcb25fd9cc8d.png"
              alt="Green Door"
              className="absolute inset-0 w-full h-full object-cover rounded shadow"
            />
          </div>

          {/* RIGHT — TEXT */}
          <div className="space-y-8 leading-relaxed text-gray-800">
            <h2 className="text-3xl md:text-4xl font-semibold">Why Publish With Us</h2>

            <p>
              We understand the academic publishing process and the importance of presenting your work with clarity and
              professionalism.
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Responsive and personalised approach</li>
              <li>Transparent publishing process</li>
              <li>Commitment to editorial excellence</li>
              <li>Extensive global distribution network</li>
              <li>Strong relationships with universities and libraries</li>
            </ul>

            <p>
              Click <span className="text-blue-600 cursor-pointer">here</span> to read more.
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold">Our Space</h2>

            <p>Our headquarters are located in the historic Lady Stephenson Library.</p>

            <p className="font-semibold">
              Cambridge Scholars Publishing Limited is not affiliated with Cambridge University Press.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
