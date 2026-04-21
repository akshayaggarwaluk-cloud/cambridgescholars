import { useState } from "react";
import { Star, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ReviewsSectionProps {
  bookId: string;
}

/**
 * Stubbed reviews section.
 * The CSP API does not (yet) expose a user-reviews endpoint, so the form is
 * kept for visual consistency but submitting just shows a "coming soon" toast.
 */
export function ReviewsSection({ bookId: _bookId }: ReviewsSectionProps) {
  const { user } = useExternalAuth();
  const [loading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const resetForm = () => {
    setShowForm(false);
    setRating(5);
    setTitle("");
    setContent("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setTimeout(() => {
      toast.info("User reviews are coming soon.");
      resetForm();
      setSubmitting(false);
    }, 300);
  };

  return (
    <section className="container-wide mt-[100px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Customer Reviews
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            User reviews are coming soon.
          </p>
        </div>

        {user && !showForm && (
          <Button variant="gold" onClick={() => setShowForm(true)}>
            Write a Review
          </Button>
        )}

        {!user && (
          <Button asChild variant="outline">
            <Link to="/auth">Sign in to review</Link>
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-secondary rounded-xl p-6 mb-8">
          <h3 className="font-serif text-xl font-semibold mb-4">Write Your Review</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Your Rating</Label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors",
                        (hoverRating || rating) > i
                          ? "fill-accent text-accent"
                          : "text-muted",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-title">Review Title (Optional)</Label>
              <Input
                id="review-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-content">Your Review (Optional)</Label>
              <Textarea
                id="review-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What did you like or dislike about this book?"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="gold" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="text-center py-12 bg-secondary/50 rounded-xl">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            User reviews aren't available yet. Press reviews appear in the book
            details below where applicable.
          </p>
        </div>
      )}
    </section>
  );
}
