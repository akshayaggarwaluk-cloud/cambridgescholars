import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Send, Upload } from "lucide-react";

const TOTAL_STEPS = 7;

const SubmitProposal = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCoAuthors, setHasCoAuthors] = useState<string>("");
  const [coAuthorCount, setCoAuthorCount] = useState("1");
  const [bookType, setBookType] = useState("");
  const [manuscriptStage, setManuscriptStage] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [sampleFiles, setSampleFiles] = useState<File[]>([]);
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);
  const [country, setCountry] = useState("");

  const progress = Math.round((currentStep / TOTAL_STEPS) * 100);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Proposal Submitted",
      description: "Thank you for your submission. We'll review it and get back to you within 4-6 weeks.",
    });
    setIsSubmitting(false);
  };

  const renderCoAuthorFields = () => {
    const count = parseInt(coAuthorCount) || 1;
    return Array.from({ length: count }, (_, i) => (
      <div key={i} className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-base font-semibold text-foreground">
          Co-authors / Editors / Contributors / Translators {i + 1}
        </h3>
        <div className="space-y-1">
          <Label className="text-foreground font-semibold">
            Role <span className="text-accent font-normal">(Required)</span>
          </Label>
          <RadioGroup className="flex flex-wrap gap-4 pt-1">
            {["Co-authors", "Editors", "Contributors", "Translators"].map(role => (
              <div key={role} className="flex items-center space-x-2">
                <RadioGroupItem value={role.toLowerCase()} id={`role-${i}-${role}`} />
                <Label htmlFor={`role-${i}-${role}`} className="font-normal cursor-pointer">{role}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <FieldInput label="Name" required />
        <FieldInput label="Email" type="email" required />
        <FieldInput label="Affiliation" required />
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero / Breadcrumb Section */}
        <section className="bg-[hsl(var(--primary))] py-12 mt-0 bg-[#f4f3ec]">
          <div className="container-wide flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-display text-primary-foreground">
              Book Proposal Form
            </h1>
            <PageBreadcrumb
              items={[{ label: "Home", href: "/" }]}
              currentPage="Book Proposal Form"
            />
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 bg-background">
          <div className="container-wide max-w-4xl mx-auto">
            {/* Notice */}
            <p className="text-muted-foreground mb-8 text-sm md:text-base">
              Please note that we publish in English only and do not provide translation services at this time. Submissions in languages other than English will not be considered for publication.
            </p>

            {/* Progress */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-2">Step {currentStep} of {TOTAL_STEPS}</p>
              <div className="relative w-full">
                <Progress value={progress} className="h-6 bg-muted" />
                <span className="absolute inset-0 flex items-center justify-start pl-2 text-xs font-semibold text-primary-foreground" style={{ width: `${progress}%` }}>
                  {progress}%
                </span>
              </div>
            </div>

            {/* Step Content */}
            <div className="space-y-6">
              {currentStep === 1 && (
                <>
                  <FieldInput label="Full Name" required />
                  <FieldInput label="Email Address" type="email" required />
                  <FieldInput label="Phone Number" type="tel" required />
                  <FieldInput label="Institution or Organisation" required />
                  <FieldInput label="Current Position" required />
                  <FieldInput label="Academic/Professional Qualifications" required />

                  <div className="space-y-1">
                    <Label className="text-foreground font-semibold">
                      CV Upload (PDF/DOCX) <span className="text-accent font-normal">(Required)</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2 border border-input bg-background cursor-pointer hover:bg-muted transition-colors text-sm">
                        <Upload className="w-4 h-4" />
                        Choose File
                        <input
                          type="file"
                          accept=".pdf,.docx"
                          className="hidden"
                          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                        />
                      </label>
                      <span className="text-sm text-muted-foreground">
                        {cvFile ? cvFile.name : "No file chosen"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Max. file size: 10 MB.</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-foreground font-semibold">
                      Co-authors / Editors / Contributors / Translators <span className="text-accent font-normal">(Required)</span>
                    </Label>
                    <RadioGroup value={hasCoAuthors} onValueChange={setHasCoAuthors} className="flex gap-6 pt-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="coauthors-yes" />
                        <Label htmlFor="coauthors-yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="coauthors-no" />
                        <Label htmlFor="coauthors-no" className="font-normal cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {hasCoAuthors === "yes" && (
                    <>
                      <div className="space-y-1">
                        <Label className="text-foreground font-semibold">
                          How many Co-authors / Editors / Contributors / Translators <span className="text-accent font-normal">(Required)</span>
                        </Label>
                        <Select value={coAuthorCount} onValueChange={setCoAuthorCount}>
                          <SelectTrigger className="max-w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {renderCoAuthorFields()}
                    </>
                  )}
                </>
              )}

              {currentStep === 2 && (
                <>
                  <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Mailing</h2>
                  <div className="space-y-1">
                    <Label className="text-foreground font-semibold">
                      Country <span className="text-accent font-normal">(Required)</span>
                    </Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Please Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Afghanistan","Albania","Algeria","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Chad","Chile","China","Colombia","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czechia","Denmark","Djibouti","Dominican Republic","Ecuador","Egypt","El Salvador","Estonia","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Guatemala","Guinea","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Latvia","Lebanon","Liberia","Libya","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mexico","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russian Federation","Rwanda","Saudi Arabia","Senegal","Serbia","Sierra Leone","Singapore","Slovakia","Slovenia","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Trinidad and Tobago","Tunisia","Türkiye","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Viet Nam","Yemen","Zambia","Zimbabwe"].map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FieldInput label="State / Province / Region" required />
                  <FieldInput label="City" required />
                  <FieldInput label="Address" required />
                  <FieldInput label="ZIP / Postal Code" required />
                </>
              )}

              {currentStep === 3 && (
                <>
                  <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Book Details</h2>
                  <FieldInput label="Proposed Title" required />
                  <FieldInput label="Proposed Subtitle" required />
                  <div className="space-y-1">
                    <Label className="text-foreground font-semibold">
                      Type of Book <span className="text-accent font-normal">(Required)</span>
                    </Label>
                    <RadioGroup value={bookType} onValueChange={setBookType} className="flex gap-6 pt-1">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monograph" id="type-monograph" />
                        <Label htmlFor="type-monograph" className="font-normal cursor-pointer">Monograph</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="edited" id="type-edited" />
                        <Label htmlFor="type-edited" className="font-normal cursor-pointer">Edited Collection</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Book Description</h2>
                  <FieldTextarea label="Brief Summary of the Book (approx. 200–500 words)" required rows={6} />
                  <FieldTextarea label="Key Features or Selling Points" required rows={4} />
                  <FieldTextarea label="Intended Audience" required rows={3} />
                  <FieldInput label="Estimated final word count (between 35,000 and 200,000 words)" required />
                  <FieldInput label="Number of illustrations/figures/tables (if any)" required />
                  <FieldInput label="Languages used (if more than English)" required />
                </>
              )}

              {currentStep === 5 && (
                <>
                  <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Marketing and Promotion</h2>
                  <FieldTextarea label="Competing Titles (minimum two examples with author, title, and publisher)" required rows={4} />
                  <FieldTextarea label="What unique contribution does your book make compared to these existing titles?" required rows={4} />
                </>
              )}

              {currentStep === 6 && (
                <>
                  <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Manuscript Status</h2>
                  <div className="space-y-1">
                    <Label className="text-foreground font-semibold">
                      Current stage of the manuscript <span className="text-accent font-normal">(Required)</span>
                    </Label>
                    <Select value={manuscriptStage} onValueChange={setManuscriptStage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-started">Not yet started</SelectItem>
                        <SelectItem value="in-progress">In progress</SelectItem>
                        <SelectItem value="draft-completed">Draft completed</SelectItem>
                        <SelectItem value="finalised">Finalised</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FieldInput label="When do you expect to submit the final manuscript?" type="date" required />
                </>
              )}

              {currentStep === 7 && (
                <>
                  <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Sample Material</h2>

                  <div className="space-y-1">
                    <Label className="text-foreground font-semibold">
                      Upload at least one sample chapter <span className="text-accent font-normal">(Required)</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2 border border-input bg-background cursor-pointer hover:bg-muted transition-colors text-sm">
                        <Upload className="w-4 h-4" />
                        Choose Files
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => setSampleFiles(Array.from(e.target.files || []))}
                        />
                      </label>
                      <span className="text-sm text-muted-foreground">
                        {sampleFiles.length > 0 ? sampleFiles.map(f => f.name).join(", ") : "No files chosen"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Max. file size: 2 GB.</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-foreground font-semibold">
                      Upload additional supporting files <span className="text-accent font-normal">(Required)</span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2 border border-input bg-background cursor-pointer hover:bg-muted transition-colors text-sm">
                        <Upload className="w-4 h-4" />
                        Choose Files
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => setSupportingFiles(Array.from(e.target.files || []))}
                        />
                      </label>
                      <span className="text-sm text-muted-foreground">
                        {supportingFiles.length > 0 ? supportingFiles.map(f => f.name).join(", ") : "No files chosen"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Max. file size: 2 GB.</p>
                  </div>

                  <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 pt-4">Additional Comments and Permissions</h2>
                  <FieldTextarea label="Any additional notes or context from the author" required rows={4} />
                  <FieldTextarea label="Are there any permissions you need to obtain from other copyright holders?" required rows={3} />

                  <p className="text-sm text-muted-foreground pt-4">
                    Please check over your information thoroughly and click the submit button below.
                  </p>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-border">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={handlePrevious} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  PREVIOUS
                </Button>
              ) : (
                <div />
              )}

              {currentStep < TOTAL_STEPS ? (
                <Button onClick={handleNext} className="gap-2">
                  NEXT
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? "SUBMITTING..." : (
                    <>
                      <Send className="w-4 h-4" />
                      SUBMIT
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const FieldInput = ({ label, required, type = "text" }: { label: string; required?: boolean; type?: string }) => (
  <div className="space-y-1">
    <Label className="text-foreground font-semibold">
      {label} {required && <span className="text-accent font-normal">(Required)</span>}
    </Label>
    <Input type={type} required={required} className="border-b border-input border-t-0 border-l-0 border-r-0 rounded-none shadow-none focus-visible:ring-0 px-0 bg-transparent" />
  </div>
);

const FieldTextarea = ({ label, required, rows = 4 }: { label: string; required?: boolean; rows?: number }) => (
  <div className="space-y-1">
    <Label className="text-foreground font-semibold">
      {label} {required && <span className="text-accent font-normal">(Required)</span>}
    </Label>
    <Textarea required={required} rows={rows} className="border-b border-input border-t-0 border-l-0 border-r-0 rounded-none shadow-none focus-visible:ring-0 px-0 bg-transparent resize-none" />
  </div>
);

export default SubmitProposal;
