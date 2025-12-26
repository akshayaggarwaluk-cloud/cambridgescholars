import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Award, Quote } from "lucide-react";

const EndorsementSubmission = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Endorsement Submitted",
      description: "Thank you for your endorsement. We'll review it and contact you shortly.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-primary py-16">
          <div className="container-wide">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Endorsement Submission
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl">
              Support scholarly work with your professional endorsement
            </p>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-accent/10 text-accent">
                    <Award className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Why Endorsements Matter
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Endorsements from respected scholars and professionals add credibility 
                    and visibility to academic publications. Your endorsement helps readers 
                    understand the significance and quality of the work.
                  </p>
                  <p>
                    We welcome endorsements from:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Academic peers and colleagues</li>
                    <li>Subject matter experts</li>
                    <li>Professional practitioners in the field</li>
                    <li>Distinguished scholars and researchers</li>
                  </ul>
                </div>

                <div className="mt-8 p-6 bg-secondary/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Quote className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="italic text-foreground">
                        "A groundbreaking contribution to the field that will be essential 
                        reading for scholars and practitioners alike."
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        — Example endorsement format
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="bg-card border border-border rounded-lg p-8">
                <h3 className="text-xl font-display font-semibold text-foreground mb-6">
                  Submit Your Endorsement
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="endorserName">Your Name *</Label>
                    <Input id="endorserName" required placeholder="Prof. Jane Smith" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endorserTitle">Title & Affiliation *</Label>
                    <Input 
                      id="endorserTitle" 
                      required 
                      placeholder="Professor of History, University of Oxford" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endorserEmail">Email Address *</Label>
                    <Input 
                      id="endorserEmail" 
                      type="email" 
                      required 
                      placeholder="jane.smith@university.edu" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bookTitle">Book Being Endorsed *</Label>
                    <Input 
                      id="bookTitle" 
                      required 
                      placeholder="Enter the book title" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bookAuthor">Book Author *</Label>
                    <Input 
                      id="bookAuthor" 
                      required 
                      placeholder="Enter the author's name" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endorsement">Your Endorsement *</Label>
                    <Textarea 
                      id="endorsement" 
                      required 
                      rows={5}
                      placeholder="Write your endorsement (50-150 words recommended)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship to Author/Work</Label>
                    <Input 
                      id="relationship" 
                      placeholder="e.g., Colleague, Peer reviewer, etc." 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Endorsement"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EndorsementSubmission;