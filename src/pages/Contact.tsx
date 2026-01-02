import { useState } from "react";
import { Mail, MapPin, Clock, Send } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    content: "Lady Stephenson Library, Newcastle upon Tyne NE6 2PA, United Kingdom",
  },
  {
    icon: Mail,
    title: "Contact",
    content: "Mail: admin@cambridgescholars.com",
  },
  {
    icon: Clock,
    title: "Hours Of Operation",
    content: "Monday – Friday: 09:00 – 17:00",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 bg-[#f9f7f2] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Page Title */}
          <h1 className="text-3xl font-serif text-gray-800">Contact Us</h1>

          {/* Breadcrumb */}
          <PageBreadcrumb currentPage="Contact" />
        </div>
      </div>

      <main className="py-16">
        {/* Keep In Touch Section */}
        <section className="pb-16">
          <div className="container-wide">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Keep In Touch With Us</h2>
            <p className="text-muted-foreground max-w-5xl mb-12">
              If you have any questions regarding proposal submissions, book purchases, or any aspect of our publication process, we would be happy to hear from you. Please use the contact details below to get in touch, and we will respond as promptly as possible.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactInfo.map((info, index) => (
                <div
                  key={info.title}
                  className="flex items-start gap-4 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0">
                    <info.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{info.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="pb-24">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="bg-card rounded-2xl shadow-card p-8">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message..."
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit" variant="gold" size="lg" className="w-full">
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>

              {/* Map Placeholder */}
              <div className="bg-secondary rounded-2xl overflow-hidden flex items-center justify-center min-h-[500px]">
                <div className="text-center p-8">
                  <MapPin className="h-16 w-16 text-accent mx-auto mb-4" />
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">Visit Our Store</h3>
                  <p className="text-muted-foreground mb-1">123 Book Street, Literary District</p>
                  <p className="text-muted-foreground">New York, NY 10001</p>
                  <Button variant="outline" className="mt-6">
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
