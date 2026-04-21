import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { BackToTop } from "@/components/layout/BackToTop";

export default function AboutSection() {
  return (
    <>
      <Header />

      {/* PAGE HEADER */}
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28 px-12 md:px-32 lg:px-48 xl:px-56">
        <div className="w-full max-w-7xl mx-auto h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">About Us</h1>
          <PageBreadcrumb currentPage="About Us" />
        </div>
      </div>

      {/* FIRST SECTION */}
      <section className="w-full px-6 md:px-20 py-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[70%_30%] gap-12 items-stretch">
          {/* TEXT */}
          <div className="space-y-6 leading-[1.7] text-[#333333] font-nav text-[16px] font-normal">
            <p>
              Founded in 2001 by a group of academics, Cambridge Scholars Publishing is an independent academic
              publisher with a strong commitment to original scholarship and academic excellence. We are based in
              Newcastle upon Tyne, in the historic Lady Stephenson Library, with additional offices in Berlin and
              Barcelona.
            </p>

            <p>
              We specialise in publishing <strong>monographs, edited collections, and thesis-based works</strong> across
              a broad range of disciplines, including the humanities, social sciences, life sciences, and health and
              physical sciences.
            </p>

            <h2 className="text-[28px] font-baskerville font-normal text-[#333333] mt-10 mb-2">What We Do</h2>

            <p>
              At Cambridge Scholars, we support authors at every stage of the publishing journey. Whether you are an
              early-career researcher submitting your first manuscript or an established academic building on previous
              work, we offer a clear, author-centred experience, designed to prioritise your voice and your vision.
            </p>

            <p>Our publishing model is founded on three core principles:</p>

            <ul className="list-disc pl-6 space-y-2">
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

            <h2 className="text-[28px] font-baskerville font-normal text-[#333333] mt-10 mb-2">Global Distribution</h2>

            <p>
              Our titles are distributed globally to readers and libraries through an extensive network of academic and
              commercial channels. Books are available in hardback and digital formats, and can be ordered through
              platforms including Amazon, ProQuest, EBSCO, Ingram, and more.
            </p>

            <p>
              We also offer a unique <strong>Print-on-Time</strong> system, which ensures titles remain continuously
              available without the need for warehousing or distribution delays.
            </p>
          </div>

          {/* IMAGE */}
          <div className="relative w-full h-full min-h-[300px]">
            <img
              src="/lovable-uploads/d53bdc66-5423-4a11-8c1d-a9166b55ead1.png"
              alt="Lady Stephenson Library"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* SECOND SECTION */}
      <section className="w-full px-6 md:px-20 py-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[30%_70%] gap-12 items-stretch">
          {/* IMAGE */}
          <div className="relative w-full h-full min-h-[300px]">
            <img
              src="/lovable-uploads/3f1259fa-8061-4dd4-9451-dcb25fd9cc8d.png"
              alt="Our Space"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* TEXT */}
          <div className="space-y-6 leading-[1.7] text-[#333333] font-nav text-[16px] font-normal bg-white">
            <h2 className="text-[28px] font-baskerville font-normal text-[#333333] mb-2">Why Publish With Us</h2>

            <p>
              We understand the academic publishing process and the importance of having your work presented with
              clarity, professionalism, and attention to detail. Authors choose Cambridge Scholars for our:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Responsive and personalised approach</li>
              <li>Transparent and collaborative publishing process</li>
              <li>Commitment to editorial excellence</li>
              <li>Extensive global distribution network</li>
              <li>Established relationships with universities, libraries, and key distributors</li>
            </ul>

            <p>
              Click <a href="/our-author-promises" className="text-[#C75B2A] hover:underline">here</a> to read more about our author
              commitments.
            </p>

            <h2 className="text-[28px] font-baskerville font-normal text-[#333333] mt-10 mb-2">Our Space</h2>

            <p>
              Our headquarters are located in the historic Lady Stephenson Library – a restored Victorian public library
              that provides a fitting setting for our mission to advance knowledge and learning.
            </p>

            <p>
              Whether you are submitting a proposal, purchasing a title, or exploring new research in your field,
              Cambridge Scholars Publishing is proud to support a diverse and expanding international academic
              community.
            </p>

            <p className="font-semibold">
              Cambridge Scholars Publishing Limited is not affiliated to, or associated with, Cambridge University Press
              or the University of Cambridge.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}
