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
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    setIsSearchOpen(false);
  }, [location.pathname]);
  const handleSignOut = async () => {
    await signOut();
  };
  return <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background", isScrolled && "shadow-md bg-background/95 backdrop-blur-sm")}>
      <nav className="container-wide">
        <div className="flex items-center justify-between h-24 text-[#696969]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImage} alt="Logo" className="h-14 w-auto text-[#696969]" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            {navigation.slice(0, 3).map(item => <Link key={item.name} to={item.href} className={cn("text-lg py-2 transition-colors hover:text-[#E4573D] font-semibold", location.pathname === item.href ? "text-[#E4573D]" : "text-foreground")}>
                {item.name}
              </Link>)}

            {/* Publish Dropdown */}
            <div className="relative" onMouseEnter={() => setIsPublishDropdownOpen(true)} onMouseLeave={() => setIsPublishDropdownOpen(false)}>
              <Link to="/publish-a-book" className={cn("text-lg flex items-center gap-1.5 py-2 hover:text-[#E4573D] font-semibold", location.pathname === "/publish-a-book" || publishDropdownItems.some(i => location.pathname === i.href) ? "text-[#E4573D]" : "text-foreground")}>
                Publish a Book
                <ChevronDown className={cn("h-4 w-4 transition-transform", isPublishDropdownOpen && "rotate-180")} />
              </Link>

              {isPublishDropdownOpen && <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                  <div className="bg-background border rounded-lg shadow-xl py-2 w-60">
                    {publishDropdownItems.map(item => <Link key={item.name} to={item.href} className={cn("block px-5 py-2.5 hover:bg-secondary", location.pathname === item.href ? "text-[#E4573D] font-medium" : "text-foreground")}>
                        {item.name}
                      </Link>)}
                  </div>
                </div>}
            </div>

            {navigation.slice(3).map(item => <Link key={item.name} to={item.href} className={cn("text-lg py-2 hover:text-[#E4573D] font-semibold", location.pathname === item.href ? "text-[#E4573D]" : "text-foreground")}>
                {item.name}
              </Link>)}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-11 w-11 hover:text-[#E4573D]" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-6 w-6" />
            </Button>

            <Link to="/wishlist" className="relative">
              <Button variant="ghost" size="icon" className="hover:text-[#E4573D]">
                <Heart className="h-6 w-6" />
                {wishlistCount > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#E4573D] text-white text-xs flex items-center justify-center">
                    {wishlistCount}
                  </span>}
              </Button>
            </Link>

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="hover:text-[#E4573D]">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#E4573D] text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>}
              </Button>
            </Link>

            {user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:text-[#E4573D]">
                    <User className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Link to="/auth">
                <Button variant="ghost" size="icon" className="hover:text-[#E4573D]">
                  <User className="h-6 w-6" />
                </Button>
              </Link>}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </nav>
    </header>;
}