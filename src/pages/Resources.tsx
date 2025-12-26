import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BookOpen, HelpCircle, ExternalLink } from "lucide-react";

const Resources = () => {
  const resources = [
    {
      icon: FileText,
      title: "Style Guide",
      description: "Comprehensive guidelines for manuscript formatting, citations, and academic writing standards.",
      downloadable: true,
    },
    {
      icon: BookOpen,
      title: "Author Handbook",
      description: "Everything you need to know about the publishing process, from submission to publication.",
      downloadable: true,
    },
    {
      icon: FileText,
      title: "Manuscript Template",
      description: "A pre-formatted Word template to help you structure your manuscript correctly.",
      downloadable: true,
    },
    {
      icon: HelpCircle,
      title: "FAQ for Authors",
      description: "Answers to commonly asked questions about publishing with Cambridge Scholars.",
      downloadable: false,
    },
  ];

  const guides = [
    {
      title: "Writing an Effective Abstract",
      description: "Learn how to write a compelling abstract that captures the essence of your research.",
    },
    {
      title: "Preparing Your Manuscript",
      description: "Step-by-step guide to preparing your manuscript for submission.",
    },
    {
      title: "Copyright and Permissions",
      description: "Understanding copyright requirements and how to obtain necessary permissions.",
    },
    {
      title: "Working with Images and Tables",
      description: "Best practices for including visual elements in your academic work.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-primary py-16">
          <div className="container-wide">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Resources
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl">
              Helpful materials and guides for authors
            </p>
          </div>
        </section>

        {/* Downloads Section */}
        <section className="py-16">
          <div className="container-wide">
            <h2 className="text-3xl font-display font-bold text-foreground mb-8">
              Downloadable Resources
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-accent/10 text-accent">
                        <resource.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{resource.title}</CardTitle>
                        <CardDescription className="mt-2">{resource.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button variant={resource.downloadable ? "default" : "outline"} className="w-full">
                      {resource.downloadable ? (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Resource
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Guides Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container-wide">
            <h2 className="text-3xl font-display font-bold text-foreground mb-8">
              Author Guides
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {guides.map((guide, index) => (
                <div 
                  key={index} 
                  className="p-6 bg-background rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                >
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-muted-foreground">{guide.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container-wide text-center">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Need More Help?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Our editorial team is here to assist you throughout the publishing process. 
              Don't hesitate to reach out if you have any questions.
            </p>
            <Button size="lg" asChild>
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;