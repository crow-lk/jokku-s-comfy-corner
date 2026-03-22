import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import logoImg from "@/assets/Jokku_logo.png";

const Header = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
    { to: "/cart", label: "Cart" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary border-b-[3px] border-foreground">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoImg} alt="Jokku.lk" className="h-10 md:h-12 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-heading text-xl tracking-wide transition-all duration-200 hover:text-secondary ${
                location.pathname === link.to
                  ? "text-secondary"
                  : "text-primary-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/cart" className="relative comic-btn-secondary py-2 px-4 text-base">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-foreground bounce-in">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/cart" className="relative text-primary-foreground">
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 border-foreground">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-primary-foreground">
            {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary border-t-2 border-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block py-3 px-6 font-heading text-xl text-primary-foreground hover:bg-primary/80 border-b border-primary-foreground/20"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
