import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";

export default function AboutSection() {
  return (
    <>
      <Header />

      {/* PAGE HEADER */}
      <div className="bg-[#f4f3ec] min-h-[280px] pt-24 px-6 md:px-16 flex items-center">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <h1 className="text-5xl font-serif text-gray-800">About Us</h1>
          <PageBreadcrumb currentPage="About Us" />
        </div>
      </div>

      {/* FIRST SECTION */}
      <section className="w-full px-6 md:px-16 py-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[65%_35%] gap-16 items-stretch">
          {/* TEXT */}
          <div className="space-y-6 leading-relaxed text-black font-['Nunito_Sans'] text-[15px]">
            <p className="text-base">
              Founded in 2001 by a group of academics, Cambridge Scholars Publishing is an independent academic
              publisher with a strong commitment to original scholarship and academic excellence. We are based in
              Newcastle upon Tyne, in the historic Lady Stephenson Library, with additional offices in Berlin and
              Barcelona.
            </p>

            <p className="text-base">
              We specialise in publishing <strong>monographs, edited collections, and thesis-based works</strong> across
              a broad range of disciplines, including the humanities, social sciences, life sciences, and health and
              physical sciences.
            </p>

            <h2 className="text-3xl font-['Libre_Baskerville'] mt-8">What We Do</h2>

            <p className="text-base">
              At Cambridge Scholars, we support authors at every stage of the publishing journey. Whether you are an
              early-career researcher submitting your first manuscript or an established academic building on previous
              work, we offer a clear, author-centred experience, designed to prioritise your voice and your vision.
            </p>

            <p className="text-base">Our publishing model is founded on three core principles:</p>

            <ul className="list-disc pl-6 space-y-2 text-base">
              <li>
                <strong>No charges to authors</strong> – we do not levy submission or publishing fees
              </li>
              <li>
                <strong>Royalties from the first sale</strong> – authors begin receiving royalties from the very first
                copy sold
              </li>
              <li>
                <strong>Comprehensive editorial support</strong> – we provide full editorial assistance while respecting
                and preserving the author’s individual voice
              </li>
            </ul>

            <h2 className="text-3xl font-serif mt-10">Global Distribution</h2>

            <p className="text-base">
              Our titles are distributed globally to readers and libraries through an extensive network of academic and
              commercial channels. Books are available in hardback and digital formats, and can be ordered through
              platforms including Amazon, ProQuest, EBSCO, Ingram, and more.
            </p>

            <p className="text-base">
              We also offer a unique <strong>Print-on-Time</strong> system, which ensures titles remain continuously
              available without the need for warehousing or distribution delays.
            </p>
          </div>

          {/* IMAGE */}
          <div className="relative min-h-[600px]">
            <img
              src="/lovable-uploads/d53bdc66-5423-4a11-8c1d-a9166b55ead1.png"
              alt="Lady Stephenson Library"
              className="absolute inset-0 w-full h-full object-cover rounded shadow"
            />
          </div>
        </div>
      </section>

      {/* SECOND SECTION */}
      <section className="w-full px-6 md:px-16 py-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[35%_65%] gap-16 items-stretch">
          {/* IMAGE */}
          <div className="relative min-h-[600px]">
            <img
              src="/lovable-uploads/3f1259fa-8061-4dd4-9451-dcb25fd9cc8d.png"
              alt="Our Space"
              className="absolute inset-0 w-full h-full object-cover rounded shadow"
            />
          </div>

          {/* TEXT */}
          <div className="space-y-8 leading-relaxed text-gray-800 bg-white">
            <h2 className="text-4xl font-serif">Why Publish With Us</h2>

            <p className="text-base">
              We understand the academic publishing process and the importance of having your work presented with
              clarity, professionalism, and attention to detail. Authors choose Cambridge Scholars for our:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-base">
              <li>Responsive and personalised approach</li>
              <li>Transparent and collaborative publishing process</li>
              <li>Commitment to editorial excellence</li>
              <li>Extensive global distribution network</li>
              <li>Established relationships with universities, libraries, and key distributors</li>
            </ul>

            <p className="text-base">
              Click <span className="text-blue-600 cursor-pointer">here</span> to read more about our author
              commitments.
            </p>

            <h2 className="text-4xl font-serif mt-10">Our Space</h2>

            <p className="text-base">
              Our headquarters are located in the historic Lady Stephenson Library – a restored Victorian public library
              that provides a fitting setting for our mission to advance knowledge and learning.
            </p>

            <p className="text-base">
              Whether you are submitting a proposal, purchasing a title, or exploring new research in your field,
              Cambridge Scholars Publishing is proud to support a diverse and expanding international academic
              community.
            </p>

            <p className="font-semibold text-base">
              Cambridge Scholars Publishing Limited is not affiliated to, or associated with, Cambridge University Press
              or the University of Cambridge.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
