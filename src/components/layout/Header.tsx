import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Search, Moon, Sun, BookOpen, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
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
  { name: "Shop", href: "/books" },
  { name: "Categories", href: "/categories" },
  { name: "Authors", href: "/authors" },
  { name: "Publish", href: "/publish" },
  { name: "News", href: "/news" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    setIsSearchOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-background/98 backdrop-blur-sm shadow-sm border-b border-border" 
        : "bg-primary"
    )}>
      {/* Top Bar */}
      <div className={cn(
        "border-b transition-colors duration-300",
        isScrolled ? "border-border bg-secondary/50" : "border-primary-foreground/10 bg-primary"
      )}>
        <div className="container-wide">
          <div className="flex items-center justify-between h-10 text-xs">
            <span className={cn(
              "transition-colors",
              isScrolled ? "text-muted-foreground" : "text-primary-foreground/70"
            )}>
              Independent Academic Publisher
            </span>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 px-2 text-xs transition-colors",
                  isScrolled 
                    ? "text-muted-foreground hover:text-foreground" 
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                )}
                onClick={() => setIsDark(!isDark)}
              >
                {isDark ? <Sun className="h-3 w-3 mr-1" /> : <Moon className="h-3 w-3 mr-1" />}
                {isDark ? "Light" : "Dark"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <nav className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <BookOpen className={cn(
              "h-7 w-7 transition-colors duration-300",
              isScrolled ? "text-accent" : "text-accent"
            )} />
            <div className="flex flex-col">
              <span className={cn(
                "font-serif text-lg font-semibold leading-none transition-colors duration-300",
                isScrolled ? "text-foreground" : "text-primary-foreground"
              )}>Cambridge Scholars</span>
              <span className={cn(
                "text-[10px] uppercase tracking-widest transition-colors duration-300",
                isScrolled ? "text-muted-foreground" : "text-primary-foreground/60"
              )}>Publishing</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-accent",
                  location.pathname === item.href 
                    ? "text-accent" 
                    : isScrolled 
                      ? "text-foreground" 
                      : "text-primary-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isSearchOpen ? (
              <div className="w-64 animate-fade-in">
                <SearchAutocomplete onClose={() => setIsSearchOpen(false)} />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 transition-colors duration-300",
                  isScrolled ? "text-foreground hover:bg-secondary" : "text-primary-foreground hover:bg-primary-foreground/10"
                )}
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            )}

            <Link to="/cart" className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-9 w-9 transition-colors duration-300",
                  isScrolled ? "text-foreground hover:bg-secondary" : "text-primary-foreground hover:bg-primary-foreground/10"
                )}
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "h-9 w-9 transition-colors duration-300",
                      isScrolled ? "text-foreground hover:bg-secondary" : "text-primary-foreground hover:bg-primary-foreground/10"
                    )}
                  >
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
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
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
              className={cn(
                "h-9 w-9",
                isScrolled ? "text-foreground" : "text-primary-foreground"
              )}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Link to="/cart" className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-9 w-9",
                  isScrolled ? "text-foreground" : "text-primary-foreground"
                )}
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={cn(
                "h-9 w-9",
                isScrolled ? "text-foreground" : "text-primary-foreground"
              )}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="lg:hidden pb-4 animate-fade-in">
            <SearchAutocomplete onClose={() => setIsSearchOpen(false)} />
          </div>
        )}

        {/* Mobile Menu */}
        <div className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          isMenuOpen ? "max-h-screen pb-6" : "max-h-0"
        )}>
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-sm font-medium py-2 transition-colors duration-200",
                  location.pathname === item.href ? "text-accent" : "text-foreground hover:text-accent"
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
              <Link 
                to="/auth" 
                onClick={() => setIsMenuOpen(false)} 
                className="text-sm font-medium py-2 text-accent"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
