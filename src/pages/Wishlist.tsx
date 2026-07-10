import { Link } from "react-router-dom";

const Wishlist = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Wishlist</h1>
        <p className="mb-4 text-xl text-muted-foreground">Your saved items</p>
        <Link to="/products" className="text-primary underline hover:text-primary/90">
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
