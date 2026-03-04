import { Link, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const orderNumber = (location.state as { orderNumber?: string } | null)?.orderNumber;

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl md:text-5xl font-heading text-foreground mb-4">Order placed successfully</h1>
      {orderNumber && (
        <p className="text-muted-foreground font-body mb-2">Order number: {orderNumber}</p>
      )}
      <p className="text-muted-foreground font-body mb-8">
        Thank you for your purchase. We will start processing your order shortly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/products" className="comic-btn-primary text-xl">
          Continue shopping
        </Link>
        <Link to="/" className="comic-btn-secondary text-xl">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
