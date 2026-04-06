import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Search, User, LogOut, Heart, ChevronDown } from "lucide-react";
import logoImage from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useExternalAuth } from "@/contexts/ExternalAuthContext";
import { SearchAutocomplete } from "@/components/search/SearchAutocomplete";
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

const buyABookDropdownItems = [
  { name: "Browse All", href: "/books" },
  { name: "Browse by Subject", href: "/books/subjects" },
  { name: "Browse by Series", href: "/books/series" },
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
  const [isBuyDropdownOpen, setIsBuyDropdownOpen] = useState(false);
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
  const isBuyActive = buyABookDropdownItems.some((i) => isActiveRoute(i.href));
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
          <div className="flex items-center justify-between h-24 text-foreground">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logoImage}
                alt="Cambridge Scholars Publishing"
                className="h-14 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-12 uppercase">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-base py-2 transition-colors hover:text-accent font-semibold",
                    isActiveRoute(item.href) ? "text-accent" : "text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* Buy a Book Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsBuyDropdownOpen(true)}
                onMouseLeave={() => setIsBuyDropdownOpen(false)}
              >
                <Link
                  to="/books"
                  className={cn(
                    "text-base flex items-center gap-1.5 py-2 hover:text-accent font-semibold",
                    isBuyActive ? "text-accent" : "text-foreground"
                  )}
                >
                  Buy a Book
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isBuyDropdownOpen && "rotate-180"
                    )}
                  />
                </Link>

                {isBuyDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                    <div className="bg-background border rounded-lg shadow-xl py-2 w-60">
                      {buyABookDropdownItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            "block px-5 py-2.5 text-base font-semibold uppercase hover:bg-secondary transition-colors",
                            isActiveRoute(item.href)
                              ? "text-accent"
                              : "text-foreground"
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Publish a Book Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsPublishDropdownOpen(true)}
                onMouseLeave={() => setIsPublishDropdownOpen(false)}
              >
                <Link
                  to="/publish-a-book"
                  className={cn(
                    "text-base flex items-center gap-1.5 py-2 hover:text-accent font-semibold",
                    isPublishActive ? "text-accent" : "text-foreground"
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
                    <div className="bg-background border rounded-lg shadow-xl py-2 w-60">
                      {publishDropdownItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            "block px-5 py-2.5 text-base font-semibold uppercase hover:bg-secondary transition-colors",
                            isActiveRoute(item.href)
                              ? "text-accent"
                              : "text-foreground"
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
                    "text-base py-2 hover:text-accent font-semibold",
                    isActiveRoute(item.href) ? "text-accent" : "text-foreground"
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

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" aria-label="Cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-background border-t border-border shadow-lg">
            <div className="container-wide py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-4 py-3 rounded-lg font-medium transition-colors",
                    isActiveRoute(item.href)
                      ? "text-accent bg-accent/5"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* Buy a Book mobile section */}
              <div className="px-4 py-3 font-medium text-foreground">Buy a Book</div>
              {buyABookDropdownItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-8 py-2.5 rounded-lg text-sm transition-colors",
                    isActiveRoute(item.href)
                      ? "text-accent bg-accent/5"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* Publish a Book mobile section */}
              <div className="px-4 py-3 font-medium text-foreground">Publish a Book</div>
              {publishDropdownItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-8 py-2.5 rounded-lg text-sm transition-colors",
                    isActiveRoute(item.href)
                      ? "text-accent bg-accent/5"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {trailingNav.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-4 py-3 rounded-lg font-medium transition-colors",
                    isActiveRoute(item.href)
                      ? "text-accent bg-accent/5"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-border pt-3 mt-3 space-y-1">
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary"
                >
                  <Heart className="h-5 w-5" />
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="ml-auto h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary"
                    >
                      <User className="h-5 w-5" />
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Orders
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary"
                  >
                    <User className="h-5 w-5" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Overlay */}
        {isSearchOpen && (
          <SearchAutocomplete onClose={() => setIsSearchOpen(false)} />
        )}
      </header>
    </TooltipProvider>
  );
}
