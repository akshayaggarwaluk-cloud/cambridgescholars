import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, Send, Clock, BookOpen, Globe } from "lucide-react";

const HowToPublish = () => {
  const steps = [
    {
      icon: Send,
      title: "Proposal Submission",
      description: "Submit your book proposal through our online form. Include a synopsis, table of contents, sample chapter, and your CV.",
    },
    {
      icon: FileText,
      title: "Peer Review",
      description: "Your proposal will undergo rigorous peer review by experts in your field to ensure academic quality and relevance.",
    },
    {
      icon: Clock,
      title: "Editorial Assessment",
      description: "Our editorial team evaluates the proposal alongside reviewer feedback to make a publishing decision.",
    },
    {
      icon: CheckCircle,
      title: "Contract & Production",
      description: "Upon acceptance, we issue a publishing contract and begin the production process with professional copyediting and typesetting.",
    },
    {
      icon: BookOpen,
      title: "Publication",
      description: "Your book is published in print and digital formats, with ISBNs assigned and cataloguing completed.",
    },
    {
      icon: Globe,
      title: "Global Distribution",
      description: "Your work is distributed globally through major retailers, libraries, and academic institutions worldwide.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section with Breadcrumb */}
        <section className="bg-secondary/50 py-12">
          <div className="container-wide flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-4xl md:text-5xl font-display font-normal text-foreground">
              How to Publish
            </h1>
            <nav className="mt-4 md:mt-0 text-sm">
              <ol className="flex items-center gap-2">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li className="text-muted-foreground">/</li>
                <li className="text-accent italic">How to Publish</li>
              </ol>
            </nav>
          </div>
        </section>

        {/* Academic Publishing Timeline Section */}
        <section className="py-16 bg-background">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-normal text-foreground mb-6">
                Academic Publishing Timeline
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Cambridge Scholars Publishing offers a clear and well-supported process from initial proposal to global distribution.
                Below is an overview of each stage in the publishing journey.
              </p>
            </div>

            {/* Timeline Steps */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full border-2 border-accent/30 flex items-center justify-center text-accent">
                      <step.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guidelines Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-display font-normal text-foreground mb-8 text-center">
                Submission Guidelines
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p className="text-center">
                  Cambridge Scholars Publishing welcomes proposals for academic monographs, edited 
                  collections, and textbooks across all disciplines in the humanities and social sciences.
                </p>
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-4">
                      What We Look For
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Original, high-quality academic research</li>
                      <li>Clear and accessible writing style</li>
                      <li>Contribution to the field of study</li>
                      <li>Well-organized structure and argument</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-4">
                      Manuscript Requirements
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Minimum 60,000 words for monographs</li>
                      <li>Microsoft Word format preferred</li>
                      <li>Chicago or Harvard referencing style</li>
                      <li>High-resolution images (300 DPI minimum)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowToPublish;
