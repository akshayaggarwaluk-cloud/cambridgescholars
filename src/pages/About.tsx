import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

export default function AboutSection() {
  return (
    <>
      <Header />
      <div className="pt-32 bg-[#f9f7f2] py-10 px-6 md:px-16">
        <div className="max-w-8xl mx-auto flex justify-between items-center">
          {/* Page Title */}
          <h1 className="text-5xl font-serif text-gray-800">About Us</h1>

          {/* Breadcrumb */}
          <PageBreadcrumb currentPage="About Us" />
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
              We specialise in publishing monographs, edited collections, and thesis-based works across a broad range of
              disciplines, including the humanities, social sciences, life sciences, and health and physical sciences.
            </p>

            <h2 className="text-2xl font-semibold">What We Do</h2>

            <p>
              At Cambridge Scholars, we support authors at every stage of the publishing journey. Whether you are an
              early-career researcher submitting your first manuscript or an established academic building on previous
              work, we offer a clear, author-centred experience, designed to prioritise your voice and your vision.
            </p>
            <p>Our publishing model is founded on three core principles:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>No charges to authors</strong> - we do not levy submission or publishing fees
              </li>
              <li>
                <strong>Royalties from the first sale</strong>- authors begin receiving royalties from the very first
                copy sold
              </li>
              <li>
                <strong>Comprehensive editorial support </strong>- we provide full editorial assistance while respecting
                and preserving the author’s individual voice.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold">Global Distribution</h2>

            <p>
              Our titles are distributed globally to readers and libraries through an extensive network of academic and
              commercial channels. Books are available in hardback and digital formats, and can be ordered through
              platforms including Amazon, ProQuest, EBSCO, Ingram, and more.
            </p>

            <p>
              We also offer a unique Print-on-Time system, which ensures titles remain continuously available without
              the need for warehousing or distribution delays.
            </p>
          </div>

          {/* RIGHT SIDE — IMAGE */}
          <div className="flex justify-center ">
            <img
              alt="Decorative"
              className="w-80 h-auto md:h-[700px] object-cover rounded-lg shadow"
              src="/lovable-uploads/d53bdc66-5423-4a11-8c1d-a9166b55ead1.png"
            />
          </div>
        </div>
      </section>

      {/* SECOND SECTION */}
      <section className="w-full px-6 md:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT SIDE IMAGE */}
          <div className="flex justify-center">
            <img
              alt="Green Door"
              className="w-full md:w-[420px] h-full rounded shadow"
              src="/lovable-uploads/3f1259fa-8061-4dd4-9451-dcb25fd9cc8d.png"
            />
          </div>

          {/* RIGHT SIDE TEXT */}
          <div className="text-gray-800 space-y-8 leading-relaxed">
            <h2 className="text-3xl md:text-4xl font-semibold">Why Publish With Us</h2>

            <p className="text-base md:text-lg">
              We understand the academic publishing process and the importance of having your work presented with
              clarity, professionalism, and attention to detail. Authors choose Cambridge Scholars for our:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-base md:text-lg">
              <li>Responsive and personalised approach</li>
              <li>Transparent and collaborative publishing process</li>
              <li>Commitment to editorial excellence</li>
              <li>Extensive global distribution network</li>
              <li>Established relationships with universities, libraries, and key distributors</li>
            </ul>

            <p className="text-base md:text-lg">
              Click <span className="text-blue-600 cursor-pointer">here</span> to read more about our author
              commitments.
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold">Our Space</h2>

            <p className="text-base md:text-lg">
              Our headquarters are located in the historic Lady Stephenson Library - a restored Victorian public library
              that provides a fitting setting for our mission to advance knowledge and learning.
            </p>

            <p className="text-base md:text-lg">
              Whether you are submitting a proposal, purchasing a title, or exploring new research in your field,
              Cambridge Scholars Publishing is proud to support a diverse and expanding international academic community
            </p>

            <p className="text-base md:text-lg font-semibold">
              Please note that Cambridge Scholars Publishing Limited is not affiliated to, or associated with, Cambridge
              University Press or the University of Cambridge.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
