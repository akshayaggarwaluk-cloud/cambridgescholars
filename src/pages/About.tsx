import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AboutSection() {
  return (
    <>
      <Header />
      <div className="pt-32 bg-[#f9f7f2] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Page Title */}
          <h1 className="text-3xl font-serif text-gray-800">About Us</h1>

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600">
            <ol className="flex space-x-1 md:space-x-2">
              <li>
                <a href="/" className="hover:underline italic">
                  Home
                </a>
              </li>
              <li>
                <span className="mx-1">/</span>
              </li>
              <li>
                <span className="text-red-500 italic">About Us</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* FIRST SECTION */}
      <section className="w-full px-6 md:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* LEFT SIDE — TEXT CONTENT */}
          <div className="space-y-6 leading-relaxed ">
            <p>
              Founded in 2001 by a group of academics, Cambridge Scholars Publishing is an independent academic
              publisher with a strong commitment to original scholarship and academic excellence. We are based in
              Newcastle upon Tyne, in the historic Lady Stephenson Library, with additional offices in Berlin and
              Barcelona.
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

          {/* RIGHT SIDE — IMAGE */}
          <div className="flex justify-center ">
            <img alt="Decorative" className="w-80 h-auto md:h-[700px] object-cover rounded-lg shadow" src="/lovable-uploads/d53bdc66-5423-4a11-8c1d-a9166b55ead1.png" />
          </div>
        </div>
      </section>

      {/* SECOND SECTION */}
      <section className="w-full px-6 md:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT SIDE IMAGE */}
          <div className="flex justify-center">
            <img alt="Green Door" className="w-full md:w-[420px] h-full rounded shadow" src="/lovable-uploads/3f1259fa-8061-4dd4-9451-dcb25fd9cc8d.png" />
          </div>

          {/* RIGHT SIDE TEXT */}
          <div className="text-gray-800 space-y-8 leading-relaxed">
            <h2 className="text-3xl md:text-4xl font-semibold">Why Publish With Us</h2>

            <p className="text-base md:text-lg">
              We understand the academic publishing process and the importance of presenting your work with clarity and
              professionalism.
            </p>

            <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
              <li>Responsive and personalised approach</li>
              <li>Transparent publishing process</li>
              <li>Commitment to editorial excellence</li>
              <li>Extensive global distribution network</li>
              <li>Strong relationships with universities and libraries</li>
            </ul>

            <p className="text-base md:text-lg">
              Click <span className="text-blue-600 cursor-pointer">here</span> to read more.
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold">Our Space</h2>

            <p className="text-base md:text-lg">
              Our headquarters are located in the historic Lady Stephenson Library.
            </p>

            <p className="text-base md:text-lg">We proudly support a diverse global academic community.</p>

            <p className="text-base md:text-lg font-semibold">
              Cambridge Scholars Publishing Limited is not affiliated with Cambridge University Press.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}