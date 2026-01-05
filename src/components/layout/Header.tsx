import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Search, User, LogOut, Heart, ChevronDown } from "lucide-react";
import logoImage from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { SearchAutocomplete } from "@/components/search/SearchAutocomplete";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Buy a Book", href: "/books" },
  { name: "FAQs", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

const publishDropdownItems = [
  { name: "How to Publish", href: "/how-to-publish" },
  { name: "Submit a Proposal", href: "/submit-proposal" },
  { name: "Resources", href: "/resources" },
  { name: "Endorsement Submission", href: "/endorsement-submission" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPublishDropdownOpen, setIsPublishDropdownOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsSearchOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background ",
        isScrolled && "shadow-sm",
      )}
    >
      <nav className="container-wide">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoImage} alt="Cambridge Scholars Publishing" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navigation.slice(0, 3).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-lg transition-colors duration-200 hover:text-accent",
                  location.pathname === item.href ? "text-accent" : "text-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Publish a Book Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsPublishDropdownOpen(true)}
              onMouseLeave={() => setIsPublishDropdownOpen(false)}
            >
              <button
                className={cn(
                  "text-lg transition-colors duration-200 hover:text-accent flex items-center gap-1",
                  publishDropdownItems.some((item) => location.pathname === item.href)
                    ? "text-accent"
                    : "text-foreground",
                )}
              >
                Publish a Book
                <ChevronDown className={cn("h-4 w-4 transition-transform", isPublishDropdownOpen && "rotate-180")} />
              </button>

              {isPublishDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <div className="bg-background border border-border rounded-md shadow-lg py-2 w-56">
                    {publishDropdownItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "block px-4 py-2 text-sm hover:bg-secondary transition-colors",
                          location.pathname === item.href ? "text-accent" : "text-foreground",
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navigation.slice(3).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-lg transition-colors duration-200 hover:text-accent",
                  location.pathname === item.href ? "text-accent" : "text-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {isSearchOpen ? (
              <div className="w-56 animate-fade-in">
                <SearchAutocomplete onClose={() => setIsSearchOpen(false)} />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-foreground hover:bg-secondary"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            )}

            <Link to="/wishlist" className="relative">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground hover:bg-secondary">
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground hover:bg-secondary">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground hover:bg-secondary">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                size="sm"
                className="h-8 bg-accent hover:bg-accent/90 text-accent-foreground text-xs px-4"
              >
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-foreground"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Link to="/wishlist" className="relative">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground">
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-8 w-8 text-foreground"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="lg:hidden pb-3 animate-fade-in">
            <SearchAutocomplete onClose={() => setIsSearchOpen(false)} />
          </div>
        )}

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isMenuOpen ? "max-h-screen pb-4" : "max-h-0",
          )}
        >
          <div className="flex flex-col gap-1 pt-3 border-t border-border">
            {navigation.slice(0, 3).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-sm font-medium py-2 transition-colors duration-200",
                  location.pathname === item.href ? "text-accent" : "text-foreground hover:text-accent",
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Publish a Book - Mobile */}
            <div className="py-2">
              <span className="text-sm font-medium text-foreground">Publish a Book</span>
              <div className="ml-4 mt-1 flex flex-col gap-1">
                {publishDropdownItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "text-sm py-1.5 transition-colors duration-200",
                      location.pathname === item.href ? "text-accent" : "text-muted-foreground hover:text-accent",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {navigation.slice(3).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-sm font-medium py-2 transition-colors duration-200",
                  location.pathname === item.href ? "text-accent" : "text-foreground hover:text-accent",
                )}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium py-2 text-foreground hover:text-accent"
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium py-2 text-foreground hover:text-accent"
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="text-sm font-medium py-2 text-foreground hover:text-accent text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium py-2 text-accent">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
