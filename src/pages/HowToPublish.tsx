import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { FileText, CheckCircle, Send, Clock } from "lucide-react";

const HowToPublish = () => {
  const steps = [
    {
      icon: FileText,
      title: "Prepare Your Manuscript",
      description: "Ensure your manuscript is complete, properly formatted, and ready for review. Include all necessary references, citations, and supporting materials.",
    },
    {
      icon: Send,
      title: "Submit Your Proposal",
      description: "Complete our online submission form with details about your work, including a synopsis, table of contents, and sample chapters.",
    },
    {
      icon: Clock,
      title: "Review Process",
      description: "Our editorial team will review your submission and provide feedback within 4-6 weeks. We may request additional materials or revisions.",
    },
    {
      icon: CheckCircle,
      title: "Publication Agreement",
      description: "Once approved, we'll work with you on a publication agreement and guide you through the production process.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="container-wide pt-4">
          <PageBreadcrumb 
            items={[{ label: "Publish a Book", href: "#" }]} 
            currentPage="How to Publish" 
          />
        </div>

        {/* Hero Section */}
        <section className="bg-primary py-16 mt-4">
          <div className="container-wide">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              How to Publish
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl">
              Your guide to publishing with Cambridge Scholars Publishing
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16">
          <div className="container-wide">
            <h2 className="text-3xl font-display font-bold text-foreground mb-12 text-center">
              Publishing Process
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-medium text-accent mb-2">Step {index + 1}</div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guidelines Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-foreground mb-8">
                Submission Guidelines
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p>
                  Cambridge Scholars Publishing welcomes proposals for academic monographs, edited 
                  collections, and textbooks across all disciplines in the humanities and social sciences.
                </p>
                <h3 className="text-xl font-display font-semibold text-foreground">
                  What We Look For
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Original, high-quality academic research</li>
                  <li>Clear and accessible writing style</li>
                  <li>Contribution to the field of study</li>
                  <li>Well-organized structure and argument</li>
                </ul>
                <h3 className="text-xl font-display font-semibold text-foreground">
                  Manuscript Requirements
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Minimum 60,000 words for monographs</li>
                  <li>Microsoft Word format preferred</li>
                  <li>Chicago or Harvard referencing style</li>
                  <li>High-resolution images (300 DPI minimum)</li>
                </ul>
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