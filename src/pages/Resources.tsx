import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Link } from "react-router-dom";
import proposalImg from "@/assets/resources/proposal-and-publishing-forms.jpg";
import manuscriptImg from "@/assets/resources/preparing-your-manuscript.jpg";
import coverImg from "@/assets/resources/preparing-your-book-cover.jpg";
import postPubImg from "@/assets/resources/post-publication.jpg";

const resources = [
  {
    title: "Proposal and Publishing Forms",
    description:
      "Guidance and templates for submitting your book proposal and formalising the publishing agreement – used at the start of the process.",
    image: proposalImg,
    link: "/resources/proposal-and-publishing-forms",
  },
  {
    title: "Preparing Your Manuscript",
    description:
      "Instructions on formatting, style, and submission requirements – needed when finalising your manuscript for production.",
    image: manuscriptImg,
    link: "/resources/preparing-your-manuscript",
  },
  {
    title: "Preparing Your Book Cover",
    description:
      "Guidelines for cover design elements, including images and author information – completed before the book enters production.",
    image: coverImg,
    link: "/resources/preparing-your-book-cover",
  },
  {
    title: "Post Publication",
    description:
      "Resources on marketing, author discounts, and how to promote your book – used once your title is published.",
    image: postPubImg,
    link: "/resources/post-publication",
  },
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Top Banner */}
      <div className="w-full bg-[#F4F3EC] pt-24 sm:pt-28">
        <div className="container-wide h-[200px] flex items-center justify-between">
          <h1 className="text-[40px] leading-[1.2] font-baskerville font-normal text-[#333333] my-[10px]">Resources</h1>
          <PageBreadcrumb currentPage="Resources" />
        </div>
      </div>

      <main className="py-16 bg-white">
        <section className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {resources.map((item, index) => (
              <div key={index} className="group">
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="mt-6">
                  <h2 className="font-baskerville text-[21px] text-[#333333] mb-3">{item.title}</h2>
                  <p className="font-nav text-[15px] text-[#7E7E7E] leading-relaxed mb-4 max-w-md">{item.description}</p>

                  <Link
                    to={item.link}
                    className="inline-flex items-center text-[13px] font-nav font-semibold tracking-widest text-[#E4573D] hover:underline"
                  >
                    READ MORE
                    <span className="ml-1">›</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
