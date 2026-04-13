import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CoverImageUpload } from "@/components/books/CoverImageUpload";
import { toast } from "sonner";
import { BookPlus } from "lucide-react";

const categories = [
  "Fiction",
  "Non-Fiction", 
  "Mystery",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
  "Children",
  "General"
];

const PublishBook = () => {
  const { user } = useExternalAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    cover_image: "",
    category: "General"
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-16">
          <div className="container-wide text-center">
            <BookPlus className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-4">Sign in to Publish</h1>
            <p className="text-muted-foreground mb-6">
              You need to be signed in to publish a book.
            </p>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.author.trim()) {
      toast.error("Title and author are required");
      return;
    }

    const price = parseFloat(formData.price) || 0;
    if (price < 0) {
      toast.error("Price cannot be negative");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("published_books").insert({
        user_id: user.id,
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim() || null,
        price,
        cover_image: formData.cover_image.trim() || null,
        category: formData.category
      });

      if (error) throw error;

      toast.success("Book published successfully!");
      navigate("/books");
    } catch (error: any) {
      toast.error(error.message || "Failed to publish book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-[#f4f3ec] pt-28 sm:pt-32 pb-10 sm:pb-14 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-serif text-gray-800 mb-3">Publish a Book</h1>
          <PageBreadcrumb currentPage="Publish a Book" />
        </div>
      </div>

      <main className="pb-16">
        <div className="container-wide max-w-2xl py-8">

          <div className="bg-card rounded-lg border p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookPlus className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Publish Your Book</h1>
            </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Book Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author Name *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter book description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <CoverImageUpload
              userId={user.id}
              value={formData.cover_image}
              onChange={(url) => setFormData({ ...formData, cover_image: url })}
            />
          </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Publishing..." : "Publish Book"}
            </Button>
          </form>
        </div>
      </div>
    </main>
    <Footer />
  </div>
  );
};

export default PublishBook;
