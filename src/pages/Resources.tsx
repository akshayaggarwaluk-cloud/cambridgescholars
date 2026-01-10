import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Link } from "react-router-dom";

const resources = [
  {
    title: "Proposal and Publishing Forms",
    description:
      "Guidance and templates for submitting your book proposal and formalising the publishing agreement – used at the start of the process.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    link: "/resources/proposal-and-publishing-forms",
  },
  {
    title: "Preparing Your Manuscript",
    description:
      "Instructions on formatting, style, and submission requirements – needed when finalising your manuscript for production.",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc",
    link: "/resources/preparing-your-manuscript",
  },
  {
    title: "Preparing Your Book Cover",
    description:
      "Guidelines for cover design elements, including images and author information – completed before the book enters production.",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
    link: "/resources/preparing-your-book-cover",
  },
  {
    title: "Post Publication",
    description:
      "Resources on marketing, author discounts, and how to promote your book – used once your title is published.",
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d",
    link: "/resources/post-publication",
  },
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Top Banner */}
      <div className="pt-32 bg-[#f9f7f2] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-serif text-gray-800">Resources</h1>
          <PageBreadcrumb currentPage="Resources" />
        </div>
      </div>

      <main className="py-16">
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
                  <h2 className="font-serif text-xl text-foreground mb-2">{item.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-md">{item.description}</p>

                  <Link
                    to={item.link}
                    className="inline-flex items-center text-xs font-semibold tracking-widest text-red-500 hover:underline"
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
