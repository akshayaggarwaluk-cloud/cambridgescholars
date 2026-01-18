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

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <div className="pt-32 bg-[#f9f7f2] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-serif text-gray-800">Contact Us</h1>
          <PageBreadcrumb currentPage="Contact" />
        </div>
      </div>

      <main className="py-16">
        {/* Keep In Touch */}
        <section className="pb-16">
          <div className="container-wide">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Keep In Touch With Us</h2>
            <p className="text-muted-foreground max-w-5xl mb-12">
              If you have any questions regarding proposal submissions, book purchases, or any aspect of our publication
              process, we would be happy to hear from you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactInfo.map((info, index) => (
                <div
                  key={info.title}
                  className="flex items-start gap-4 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <info.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{info.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form (Centered) */}
        <section className="pb-24">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto">
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
