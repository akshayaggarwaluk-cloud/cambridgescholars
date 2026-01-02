import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, LogOut, Camera, BookOpen, Pencil, Trash2, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CoverImageUpload } from "@/components/books/CoverImageUpload";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { categories } from "@/data/books";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface PublishedBook {
  id: string;
  title: string;
  author: string;
  description: string | null;
  price: number;
  category: string;
  cover_image: string | null;
  created_at: string;
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Published books state
  const [publishedBooks, setPublishedBooks] = useState<PublishedBook[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<PublishedBook | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadPublishedBooks();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPublishedBooks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("published_books")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPublishedBooks(data || []);
    } catch (error) {
      console.error("Error loading published books:", error);
    } finally {
      setBooksLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleEditBook = (book: PublishedBook) => {
    setEditingBook({ ...book });
    setEditDialogOpen(true);
  };

  const handleSaveBook = async () => {
    if (!editingBook) return;

    setEditSaving(true);
    try {
      const { error } = await supabase
        .from("published_books")
        .update({
          title: editingBook.title,
          author: editingBook.author,
          description: editingBook.description,
          price: editingBook.price,
          category: editingBook.category,
          cover_image: editingBook.cover_image,
        })
        .eq("id", editingBook.id);

      if (error) throw error;
      
      toast.success("Book updated successfully!");
      setEditDialogOpen(false);
      loadPublishedBooks();
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const { error } = await supabase
        .from("published_books")
        .delete()
        .eq("id", bookId);

      if (error) throw error;
      
      toast.success("Book deleted successfully!");
      setPublishedBooks(prev => prev.filter(b => b.id !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-16">
          <div className="container-wide text-center">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Sign in to view profile
            </h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to access your profile settings.
            </p>
            <Button asChild variant="gold" size="lg">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container-wide max-w-4xl">
          {/* Breadcrumb */}
          <div className="pb-4">
            <PageBreadcrumb currentPage="Profile" />
          </div>

          <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
            My Profile
          </h1>

          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Profile Card */}
              <div className="bg-card rounded-xl shadow-card p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Avatar"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-accent" />
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-accent rounded-full text-primary hover:bg-accent/90 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-foreground">
                      {profile?.full_name || "Reader"}
                    </h2>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user.email || ""} disabled />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <Button
                    variant="gold"
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-4"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>

              {/* My Published Books */}
              <div className="bg-card rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-accent" />
                    My Published Books
                  </h3>
                  <Button asChild variant="gold" size="sm">
                    <Link to="/publish">Publish New Book</Link>
                  </Button>
                </div>

                {booksLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : publishedBooks.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">You haven't published any books yet.</p>
                    <Button asChild variant="outline">
                      <Link to="/publish">Publish Your First Book</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {publishedBooks.map((book) => (
                      <div
                        key={book.id}
                        className="flex gap-4 p-4 bg-secondary/50 rounded-lg"
                      >
                        <img
                          src={book.cover_image || "/placeholder.svg"}
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">{book.title}</h4>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                          <p className="text-sm text-accent font-medium mt-1">${book.price.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground mt-1">{book.category}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBook(book)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Book</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{book.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteBook(book.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Links */}
              <div className="bg-card rounded-xl shadow-card p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <Package className="h-5 w-5 text-accent" />
                    <span className="text-foreground">Order History</span>
                  </Link>
                </div>
              </div>

              {/* Sign Out */}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Edit Book Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          {editingBook && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-author">Author</Label>
                <Input
                  id="edit-author"
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingBook.description || ""}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price ($)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingBook.price}
                    onChange={(e) => setEditingBook({ ...editingBook, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={editingBook.category}
                    onValueChange={(value) => setEditingBook({ ...editingBook, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <CoverImageUpload
                  userId={user?.id || ""}
                  value={editingBook.cover_image || ""}
                  onChange={(url) => setEditingBook({ ...editingBook, cover_image: url })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" onClick={handleSaveBook} disabled={editSaving}>
              {editSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
