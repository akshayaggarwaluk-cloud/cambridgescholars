import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import heroImage from "@/assets/publish-a-book-hero.jpg";
import howToPublishIcon from "@/assets/how-to-publish-icon.png";
import submitProposalIcon from "@/assets/submit-proposal-icon.png";
import resourcesIcon from "@/assets/resources-icon.png";

const publishCards = [
  {
    icon: howToPublishIcon,
    title: "How to publish",
    description: "Understand our publication process",
    href: "/how-to-publish",
  },
  {
    icon: submitProposalIcon,
    title: "Submit a proposal",
    description: "Send us your application",
    href: "/submit-proposal",
  },
  {
    icon: resourcesIcon,
    title: "Resources",
    description: "Download all the necessary forms and guidelines",
    href: "/resources",
  },
];

export default function PublishABook() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-transparent" />
        </div>
        <h1 className="relative z-10 font-serif text-white text-5xl md:text-7xl text-center drop-shadow-lg">
          Publish a Book
        </h1>
      </section>

      {/* Breadcrumb */}

      {/* Content Section */}
      <section className="container-wide py-16 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <p className="leading-relaxed mb-6 text-[#333333] text-base">
            Are you ready to publish your book? This section provides a comprehensive guide to the next steps in the
            publishing process. Here, you will find everything you need to begin, including an overview of the
            publication workflow,the proposal submission form, and all the necessary resources and templates
          </p>
          <p className="text-[#333333] text-base">
            If you are unsure where to begin, we recommend starting with the general overview of the publishing process.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {publishCards.map((card) => (
            <div key={card.title} className="group">
              <div className="mb-4">
                <div className="flex items-center gap-4 mb-2">
                  <img src={card.icon} alt={card.title} className="h-14 w-14 object-contain flex-shrink-0" />
                  <h3 className="font-serif text-2xl text-foreground">{card.title}</h3>
                </div>
                <p className="text-sm text-[#333333]">{card.description}</p>
              </div>
              <Link
                to={card.href}
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors uppercase tracking-[0.15em] group-hover:gap-3 text-sm font-medium"
              >
                View More
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-[10px]" />
              </Link>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
