import { Link } from "react-router-dom";

const Search = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Search</h1>
        <p className="mb-4 text-xl text-muted-foreground">Find your favorite products</p>
        <Link to="/products" className="text-primary underline hover:text-primary/90">
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default Search;
