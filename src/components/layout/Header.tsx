import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Search, User, LogOut, Heart, ChevronDown } from "lucide-react";
import logoImage from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
];


const publishDropdownItems = [
  { name: "How to Publish", href: "/how-to-publish" },
  { name: "Submit a Proposal", href: "/submit-proposal" },
  { name: "Resources", href: "/resources" },
  { name: "Endorsement Submission", href: "/endorsement-submission" },
];

const trailingNav = [
  { name: "FAQs", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [isPublishDropdownOpen, setIsPublishDropdownOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useExternalAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    logout();
  };

  const isActiveRoute = (href: string) => location.pathname === href;
  
  const isPublishActive =
    isActiveRoute("/publish-a-book") ||
    publishDropdownItems.some((i) => isActiveRoute(i.href));

  return (
    <TooltipProvider delayDuration={300}>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white",
          isScrolled && "shadow-md bg-white/95 backdrop-blur-sm"
        )}
      >
        <nav className="container-wide">
          <div className="relative flex items-center justify-between h-20 lg:h-24 text-foreground">
            {/* Mobile hamburger + search (left) */}
            <div className="flex lg:hidden items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Logo — centered on mobile via absolute positioning, inline on desktop */}
            <Link
              to="/"
              className="flex items-center gap-3 lg:flex-none absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            >
              <img
                src={logoImage}
                alt="Cambridge Scholars Publishing"
                className="h-10 lg:h-14 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-12 uppercase font-nav">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm py-2 transition-colors hover:text-foreground font-bold border-b-2",
                    isActiveRoute(item.href) ? "text-foreground border-black" : "text-muted-foreground border-transparent"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* Buy a Book */}
              <Link
                to="/books"
                className={cn(
                  "text-sm py-2 transition-colors hover:text-foreground font-bold border-b-2",
                  isActiveRoute("/books") ? "text-foreground border-black" : "text-muted-foreground border-transparent"
                )}
              >
                Buy a Book
              </Link>

              {/* Publish a Book Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsPublishDropdownOpen(true)}
                onMouseLeave={() => setIsPublishDropdownOpen(false)}
              >
                <Link
                  to="/publish-a-book"
                  className={cn(
                    "text-sm flex items-center gap-1.5 py-2 hover:text-foreground font-bold border-b-2",
                    isPublishActive ? "text-foreground border-black" : "text-muted-foreground border-transparent"
                  )}
                >
                  Publish a Book
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isPublishDropdownOpen && "rotate-180"
                    )}
                  />
                </Link>

                {isPublishDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                     <div className="bg-white border shadow-xl py-2 w-60 rounded-none">
                      {publishDropdownItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            "block px-5 py-2.5 text-base font-semibold capitalize hover:bg-white hover:text-accent transition-colors",
                            isActiveRoute(item.href)
                              ? "text-accent"
                              : "text-muted-foreground"
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {trailingNav.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm py-2 hover:text-foreground font-bold border-b-2",
                    isActiveRoute(item.href) ? "text-foreground border-black" : "text-muted-foreground border-transparent"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions with Tooltips */}
            <div className="hidden lg:flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 hover:text-accent"
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Search"
                  >
                    <Search className="h-7 w-7" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/wishlist" className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-accent"
                      aria-label="Wishlist"
                    >
                      <Heart className="h-7 w-7" />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Wishlist</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/cart" className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-accent"
                      aria-label="Cart"
                    >
                      <ShoppingCart className="h-7 w-7" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Cart</TooltipContent>
              </Tooltip>

              {user ? (
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-accent"
                          aria-label="My Account"
                        >
                          <User className="h-7 w-7" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>My Account</TooltipContent>
                  </Tooltip>
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
                </DropdownMenu>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/auth">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-accent"
                        aria-label="Sign In"
                      >
                        <User className="h-7 w-7" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Sign In</TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Mobile: hamburger left, logo center, icons right — handled via order */}
            <div className="flex lg:hidden items-center gap-1">
              <Link to="/wishlist" className="relative">
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              {user ? (
                <Link to="/profile">
                  <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Account">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Sign In">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Slide-out Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 top-0">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsMenuOpen(false)}
            />
            {/* Panel */}
            <div className="relative w-72 h-full bg-[#4a4a4a] shadow-xl flex flex-col animate-in slide-in-from-left duration-200">
              {/* Search bar + close */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#4a4a4a]">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search ..."
                    className="w-full border border-white/20 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent bg-[#4a4a4a] text-[#ebe5e5] placeholder:text-[#ebe5e5]/60"
                    onFocus={() => {
                      setIsMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    readOnly
                  />
                  <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ebe5e5]" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-[#ebe5e5] hover:bg-white/10 hover:text-[#ebe5e5]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto py-2 bg-[#4a4a4a] text-[#ebe5e5]">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "block px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors",
                      isActiveRoute(item.href)
                        ? "text-[#ebe5e5]"
                        : "text-[#ebe5e5]"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}

                <Link
                  to="/books"
                  className={cn(
                    "block px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors",
                    isActiveRoute("/books") ? "text-[#ebe5e5]" : "text-[#ebe5e5]"
                  )}
                >
                  Buy a Book
                </Link>

                {/* Publish a Book with expandable sub-items */}
                <div>
                  <button
                    onClick={() => setIsPublishDropdownOpen(!isPublishDropdownOpen)}
                    className={cn(
                      "flex items-center justify-between w-full px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors",
                      isPublishActive ? "text-[#ebe5e5]" : "text-[#ebe5e5]"
                    )}
                  >
                    Publish a Book
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isPublishDropdownOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isPublishDropdownOpen && (
                    <div className="bg-black/20">
                      {publishDropdownItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            "block px-10 py-2.5 text-sm font-medium transition-colors",
                            isActiveRoute(item.href) ? "text-[#ebe5e5]" : "text-[#ebe5e5]"
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {trailingNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "block px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors",
                      isActiveRoute(item.href) ? "text-[#ebe5e5]" : "text-[#ebe5e5]"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Search Overlay */}
        {isSearchOpen && (
          <SearchOverlay onClose={() => setIsSearchOpen(false)} />
        )}
      </header>
    </TooltipProvider>
  );
}
