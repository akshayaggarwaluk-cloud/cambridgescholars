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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const navigation = [{
  name: "Home",
  href: "/"
}, {
  name: "About Us",
  href: "/about"
}, {
  name: "Buy a Book",
  href: "/books"
}, {
  name: "FAQs",
  href: "/faq"
}, {
  name: "Contact",
  href: "/contact"
}];
const publishDropdownItems = [{
  name: "How to Publish",
  href: "/how-to-publish"
}, {
  name: "Submit a Proposal",
  href: "/submit-proposal"
}, {
  name: "Resources",
  href: "/resources"
}, {
  name: "Endorsement Submission",
  href: "/endorsement-submission"
}];
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPublishDropdownOpen, setIsPublishDropdownOpen] = useState(false);
  const location = useLocation();
  const {
    cartCount
  } = useCart();
  const {
    wishlistCount
  } = useWishlist();
  const {
    user,
    signOut
  } = useAuth();
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
  return <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background border-b border-border/50", isScrolled && "shadow-md bg-background/95 backdrop-blur-sm")}>
      <nav className="container-wide">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoImage} alt="Cambridge Scholars Publishing" className="h-14 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            {navigation.slice(0, 3).map(item => <Link key={item.name} to={item.href} className={cn("xl:text-lg font-medium  duration-200 hover:text-[#E4573D] relative py-2 text-lg", location.pathname === item.href ? "text-accent after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent" : "text-foreground")}>
                {item.name}
              </Link>)}

            {/* Publish a Book Dropdown */}
            <div className="relative" onMouseEnter={() => setIsPublishDropdownOpen(true)} onMouseLeave={() => setIsPublishDropdownOpen(false)}>
              <Link to="/publish-a-book" className={cn("xl:text-lg font-medium duration-200 flex items-center gap-1.5 relative py-2 text-lg hover-text-[E4573D]", location.pathname === "/publish-a-book" || publishDropdownItems.some(item => location.pathname === item.href) ? "text-accent after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent" : "text-foreground")}>
                Publish a Book
                <ChevronDown className={cn("h-4 w-4 xl:h-5 xl:w-5 transition-transform", isPublishDropdownOpen && "rotate-180")} />
              </Link>

              {isPublishDropdownOpen && <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                  <div className="bg-background border border-border rounded-lg shadow-xl py-2 w-60">
                    {publishDropdownItems.map(item => <Link key={item.name} to={item.href} className={cn("block px-5 py-2.5 text-base hover:bg-secondary transition-colors", location.pathname === item.href ? "text-accent font-medium" : "text-foreground")}>
                        {item.name}
                      </Link>)}
                  </div>
                </div>}
            </div>

            {navigation.slice(3).map(item => <Link key={item.name} to={item.href} className={cn("xl:text-lg font-medium transition-colors duration-200 relative py-2 text-black text-lg hover:text-[#E4573D]", location.pathname === item.href ? "text-accent after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent" : "text-foreground")}>
                {item.name}
              </Link>)}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {isSearchOpen ? <div className="w-64 animate-fade-in">
                <SearchAutocomplete onClose={() => setIsSearchOpen(false)} />
              </div> : <Button variant="ghost" size="icon" className="h-11 w-11 text-foreground hover:bg-secondary/80 hover:text-accent transition-all duration-200 hover:scale-110 active:scale-95" onClick={() => setIsSearchOpen(true)}>
                <Search className="transition-transform duration-200 w-[26px] h-[26px]" />
              </Button>}

            <Link to="/wishlist" className="relative group">
              <Button variant="ghost" size="icon" className="h-11 w-11 text-foreground hover:bg-secondary/80 hover:text-accent transition-all duration-200 hover:scale-110 active:scale-95">
                <Heart className="h-6 w-6 transition-transform duration-200 group-hover:fill-accent/20" />
                {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center animate-scale-in">
                    {wishlistCount}
                  </span>}
              </Button>
            </Link>

            <Link to="/cart" className="relative group">
              <Button variant="ghost" size="icon" className="h-11 w-11 text-foreground hover:bg-secondary/80 hover:text-accent transition-all duration-200 hover:scale-110 active:scale-95">
                <ShoppingCart className="h-6 w-6 transition-transform duration-200" />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center animate-scale-in">
                    {cartCount}
                  </span>}
              </Button>
            </Link>

            {user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-11 w-11 text-foreground hover:bg-secondary/80 hover:text-accent transition-all duration-200 hover:scale-110 active:scale-95">
                    <User className="h-6 w-6 transition-transform duration-200" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 animate-scale-in">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-3 py-2 transition-colors hover:text-accent">
                      <User className="h-5 w-5" />
                      <span className="text-base">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center gap-3 py-2 transition-colors hover:text-accent">
                      <ShoppingCart className="h-5 w-5" />
                      <span className="text-base">Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-3 py-2 transition-colors hover:text-accent">
                    <LogOut className="h-5 w-5" />
                    <span className="text-base">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Link to="/auth">
                <Button variant="ghost" size="icon" className="h-11 w-11 text-foreground hover:bg-secondary/80 hover:text-accent transition-all duration-200 hover:scale-110 active:scale-95">
                  <User className="h-6 w-6 transition-transform duration-200" />
                </Button>
              </Link>}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-1">
            <Button variant="ghost" size="icon" className="h-11 w-11 text-foreground transition-all duration-200 hover:scale-110 active:scale-95 hover:text-accent" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-6 w-6" />
            </Button>
            <Link to="/wishlist" className="relative group">
              <Button variant="ghost" size="icon" className="h-11 w-11 text-foreground transition-all duration-200 hover:scale-110 active:scale-95 hover:text-accent">
                <Heart className="h-6 w-6 group-hover:fill-accent/20" />
                {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center animate-scale-in">
                    {wishlistCount}
                  </span>}
              </Button>
            </Link>
            <Link to="/cart" className="relative group">
              <Button variant="ghost" size="icon" className="h-11 w-11 text-foreground transition-all duration-200 hover:scale-110 active:scale-95 hover:text-accent">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center animate-scale-in">
                    {cartCount}
                  </span>}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="h-11 w-11 text-foreground transition-all duration-200 hover:scale-110 active:scale-95 hover:text-accent">
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && <div className="lg:hidden pb-3 animate-fade-in">
            <SearchAutocomplete onClose={() => setIsSearchOpen(false)} />
          </div>}

        {/* Mobile Menu */}
        <div className={cn("lg:hidden overflow-hidden transition-all duration-300", isMenuOpen ? "max-h-screen pb-4" : "max-h-0")}>
          <div className="flex flex-col gap-1 pt-3 border-t border-border">
            {navigation.slice(0, 3).map(item => <Link key={item.name} to={item.href} onClick={() => setIsMenuOpen(false)} className={cn("text-sm font-medium py-2 transition-colors duration-200", location.pathname === item.href ? "text-accent" : "text-foreground hover:text-accent")}>
                {item.name}
              </Link>)}

            {/* Publish a Book - Mobile */}
            <div className="py-2">
              <Link to="/publish-a-book" onClick={() => setIsMenuOpen(false)} className={cn("text-sm font-medium transition-colors duration-200", location.pathname === "/publish-a-book" ? "text-accent" : "text-foreground hover:text-accent")}>
                Publish a Book
              </Link>
              <div className="ml-4 mt-1 flex flex-col gap-1">
                {publishDropdownItems.map(item => <Link key={item.name} to={item.href} onClick={() => setIsMenuOpen(false)} className={cn("text-sm py-1.5 transition-colors duration-200", location.pathname === item.href ? "text-accent" : "text-muted-foreground hover:text-accent")}>
                    {item.name}
                  </Link>)}
              </div>
            </div>

            {navigation.slice(3).map(item => <Link key={item.name} to={item.href} onClick={() => setIsMenuOpen(false)} className={cn("text-sm font-medium py-2 transition-colors duration-200", location.pathname === item.href ? "text-accent" : "text-foreground hover:text-accent")}>
                {item.name}
              </Link>)}

            {user ? <>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium py-2 text-foreground hover:text-accent">
                  Profile
                </Link>
                <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium py-2 text-foreground hover:text-accent">
                  Orders
                </Link>
                <button onClick={() => {
              handleSignOut();
              setIsMenuOpen(false);
            }} className="text-sm font-medium py-2 text-foreground hover:text-accent text-left">
                  Sign Out
                </button>
              </> : <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium py-2 text-accent">
                Sign In
              </Link>}
          </div>
        </div>
      </nav>
    </header>;
}