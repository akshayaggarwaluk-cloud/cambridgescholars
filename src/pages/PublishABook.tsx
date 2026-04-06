import { Link } from "react-router-dom";
import { FileText, Send, Download, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import heroImage from "@/assets/hero-bookstore.jpg";

const publishCards = [
  {
    icon: FileText,
    title: "How to publish",
    description: "Understand our publication process",
    href: "/how-to-publish",
  },
  {
    icon: Send,
    title: "Submit a proposal",
    description: "Send us your application",
    href: "/submit-proposal",
  },
  {
    icon: Download,
    title: "Resources",
    description: "Download all the necessary forms and guidelines",
    href: "/resources",
  },
];

export default function PublishABook() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="relative h-[350px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="font-serif text-5xl md:text-5xl lg:text-6xl text-white font-light italic">Publish a Book</h1>
        </div>
      </section>

      {/* Breadcrumb */}

      {/* Content Section */}
      <section className="container-wide py-16">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Are you ready to publish your book? This section provides a comprehensive guide to the next steps in the
            publishing process. Here, you will find everything you need to begin, including an overview of the
            publication workflow,the proposal submission form, and all the necessary resources and templates
          </p>
          <p className="text-muted-foreground">
            If you are unsure where to begin, we recommend starting with the general overview of the publishing process.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {publishCards.map((card) => (
            <div key={card.title} className="group">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-lg bg-secondary">
                  <card.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-foreground mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm">{card.description}</p>
                </div>
              </div>
              <Link
                to={card.href}
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm font-medium uppercase tracking-wide group-hover:gap-3"
              >
                View More
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
