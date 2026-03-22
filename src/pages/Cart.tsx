import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Cart = () => {
  const { items, updateItem, removeItem, clearCart, subtotal, totalItems, isLoading } = useCart();

  const handleUpdate = async (cartItemId: number, quantity: number) => {
    try {
      await updateItem(cartItemId, quantity);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update cart.";
      toast.error(message);
    }
  };

  const handleRemove = async (cartItemId: number) => {
    try {
      await removeItem(cartItemId);
      toast.success("Item removed from cart");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to remove item.";
      toast.error(message);
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to clear cart.";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground font-body">Loading your cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingCart className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-4xl md:text-5xl font-heading text-foreground mb-4">YOUR CART IS EMPTY!</h1>
        <p className="text-muted-foreground font-body text-lg mb-8">Don't worry, we've got plenty of comfy undies waiting for you!</p>
        <Link to="/products" className="comic-btn-primary text-xl">
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Link to="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Continue Shopping
      </Link>

      <h1 className="text-4xl md:text-5xl font-heading text-foreground mb-8">
        YOUR CART ({totalItems} item{totalItems !== 1 ? "s" : ""})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="comic-card p-4 flex gap-4">
              <Link to={`/product/${item.product_id}`} className="shrink-0">
                <img
                  src={item.image_url ?? "/placeholder.svg"}
                  alt={item.product_name}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl border-2 border-foreground"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product_id}`}>
                  <h3 className="font-heading text-xl text-foreground truncate">{item.product_name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground font-body">
                  {item.size ? `Size: ${item.size}` : item.variant_display_name}
                </p>
                <p className="font-heading text-xl text-primary mt-1">Rs.{item.unit_price}</p>

                <div className="flex items-center gap-4 mt-3">
                <div className="inline-flex items-center border-2 border-foreground rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleUpdate(item.id, Number(item.quantity) - 1)}
                      className="px-3 py-1 hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-1 font-heading text-lg border-x-2 border-foreground">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdate(item.id, Number(item.quantity) + 1)}
                      className="px-3 py-1 hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-heading text-2xl text-foreground">Rs.{item.line_total}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="comic-card p-6 sticky top-24">
            <h3 className="font-heading text-2xl text-foreground mb-4">ORDER SUMMARY</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between font-body">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">Rs.{subtotal}</span>
              </div>
              <div className="flex justify-between font-body">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-bold text-primary">{subtotal >= 3000 ? "FREE" : "Rs.350"}</span>
              </div>
              {subtotal < 3000 && (
                <p className="text-xs text-muted-foreground font-body">
                  Add Rs.{3000 - subtotal} more for free delivery.
                </p>
              )}
              <div className="border-t-2 border-foreground pt-3 flex justify-between">
                <span className="font-heading text-xl">TOTAL</span>
                <span className="font-heading text-2xl text-primary">
                  Rs.{subtotal + (subtotal >= 3000 ? 0 : 350)}
                </span>
              </div>
            </div>
            <Link to="/checkout" className="comic-btn-accent text-xl w-full justify-center mb-3">
              CHECKOUT
            </Link>
            <button
              onClick={handleClear}
              className="comic-btn bg-muted text-muted-foreground text-sm w-full justify-center"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
