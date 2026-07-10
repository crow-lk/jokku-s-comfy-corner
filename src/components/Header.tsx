import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, User, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import logoImg from "@/assets/b_logo.png";

const Header = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const leftNavLinks = [
    { to: "/", label: "Home", exact: true },
    { to: "/products", label: "Shop" },
  ];

  const rightLinks = [
    { to: "/search", icon: Search, label: "Search" },
    { to: "/login", icon: User, label: "Login" },
    { to: "/wishlist", icon: Heart, label: "Wishlist" },
  ];

  const mobileLinks = [
    ...leftNavLinks,
    ...rightLinks,
    { to: "/cart", label: "Cart", icon: ShoppingCart, badge: totalItems },
  ];

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname === to || location.pathname.startsWith(to + "/");
  };

  return (
    <header className="sticky top-0 z-50 bg-primary border-secondary/30">
      <div className="container mx-auto px-4 grid grid-cols-3 items-center gap-4 py-3">
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            {leftNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-heading text-base font-medium tracking-wide transition-colors duration-200 hover:text-secondary ${
                  isActive(link.to, link.exact) ? "text-secondary" : "text-primary-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-primary-foreground"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        <div className="flex justify-center">
          <Link to="/">
            <img src={logoImg} alt="Jokku.lk" className="h-10 md:h-20 w-auto" />
          </Link>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            to="/cart"
            className={`md:hidden flex items-center justify-center text-primary-foreground relative ${
              isActive("/cart") ? "text-secondary" : ""
            }`}
            aria-label="Cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-foreground text-primary w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-5">
            {rightLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 font-heading text-sm font-medium transition-colors duration-200 ${
                  isActive(link.to) ? "text-secondary" : "text-primary-foreground hover:text-secondary"
                }`}
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            ))}
            <Link
              to="/cart"
              className={`relative flex items-center gap-1.5 font-heading text-sm font-medium transition-colors duration-200 ${
                isActive("/cart") ? "text-secondary" : "text-primary-foreground hover:text-secondary"
              }`}
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2.5 left-2 bg-secondary text-secondary-foreground w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-primary border-t border-secondary/30">
          {mobileLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 py-3 px-6 font-heading text-base text-primary-foreground hover:bg-primary/80 border-b border-secondary/20"
            >
              {link.icon && <link.icon className="w-5 h-5" />}
              <span>{link.label}</span>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="ml-auto bg-primary-foreground text-primary px-2 py-0.5 rounded-full text-xs font-bold border-2 border-foreground">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
