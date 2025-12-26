import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const SubmitProposal = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Proposal Submitted",
      description: "Thank you for your submission. We'll review it and get back to you within 4-6 weeks.",
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
              Submit a Proposal
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl">
              Share your research with the world through Cambridge Scholars Publishing
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16">
          <div className="container-wide">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" required placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" required placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" required placeholder="john.doe@university.edu" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliation">Institutional Affiliation</Label>
                  <Input id="affiliation" placeholder="University of Cambridge" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Proposed Book Title *</Label>
                  <Input id="title" required placeholder="Enter your proposed book title" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Subject Area *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="humanities">Humanities</SelectItem>
                      <SelectItem value="social-sciences">Social Sciences</SelectItem>
                      <SelectItem value="sciences">Sciences</SelectItem>
                      <SelectItem value="arts">Arts & Literature</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="philosophy">Philosophy</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="synopsis">Synopsis *</Label>
                  <Textarea 
                    id="synopsis" 
                    required 
                    rows={6}
                    placeholder="Provide a brief synopsis of your proposed book (300-500 words)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toc">Proposed Table of Contents</Label>
                  <Textarea 
                    id="toc" 
                    rows={4}
                    placeholder="Outline the proposed chapters and structure"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Expected Completion Date</Label>
                  <Input id="timeline" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional">Additional Information</Label>
                  <Textarea 
                    id="additional" 
                    rows={3}
                    placeholder="Any additional information you'd like to share"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Proposal
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitProposal;