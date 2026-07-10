import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="zigzag-divider" />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-3xl font-heading text-secondary mb-4">JOKKU.lk</h3>
            <p className="font-body text-background/70">
              Sri Lanka's most fun underwear brand! Comfort meets cartoon style.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-heading text-primary mb-3">QUICK LINKS</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-background/70 hover:text-secondary transition-colors font-body">Home</Link>
              <Link to="/products" className="text-background/70 hover:text-secondary transition-colors font-body">Shop All</Link>
              <Link to="/cart" className="text-background/70 hover:text-secondary transition-colors font-body">Cart</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-heading text-primary mb-3">POLICIES</h4>
            <div className="flex flex-col gap-2">
              <Link to="/terms" className="text-background/70 hover:text-secondary transition-colors font-body">Terms and Conditions</Link>
              <Link to="/privacy" className="text-background/70 hover:text-secondary transition-colors font-body">Privacy Policy</Link>
              <Link to="/refund-returns" className="text-background/70 hover:text-secondary transition-colors font-body">Refund and Returns Policy</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-heading text-primary mb-3">CONTACT US</h4>
            <p className="text-background/70 font-body">hello@jokku.lk</p>
            <p className="text-background/70 font-body">+94717156558</p>
            <p className="text-background/70 font-body">Colombo, Sri Lanka</p>
          </div>
        </div>
        <div className="border-t border-background/20 mt-8 pt-6 text-center">
          <p className="text-background/50 font-body">© 2026 Jokku.lk — All rights reserved. Stay comfy!</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
