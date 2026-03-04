import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import {
  fetchPaymentMethods,
  getAuthToken,
  getSessionId,
  initPayment,
  createOrder,
  type ApiPaymentMethod,
} from "@/lib/api";

interface ShippingForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  country: string;
  postal_code: string;
}

const defaultShipping: ShippingForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  country: "Sri Lanka",
  postal_code: "",
};

const Checkout = () => {
  const { items, subtotal, totalItems, isLoading, clearCart } = useCart();
  const navigate = useNavigate();
  const paymentMethodsQuery = useQuery({
    queryKey: ["payment-methods"],
    queryFn: fetchPaymentMethods,
  });

  const [shipping, setShipping] = useState<ShippingForm>(defaultShipping);
  const [notes, setNotes] = useState("");
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeMethods = useMemo(() => {
    return (paymentMethodsQuery.data ?? []).filter((method) => method.active);
  }, [paymentMethodsQuery.data]);

  const selectedMethod = useMemo(() => {
    return activeMethods.find((method) => method.id === selectedMethodId) ?? null;
  }, [activeMethods, selectedMethodId]);

  useEffect(() => {
    if (selectedMethodId) return;
    if (activeMethods.length > 0) {
      setSelectedMethodId(activeMethods[0].id);
    }
  }, [activeMethods, selectedMethodId]);

  const deliveryFee = subtotal >= 3000 ? 0 : 350;
  const grandTotal = subtotal + deliveryFee;

  const updateField = (field: keyof ShippingForm, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const requiredFields: Array<keyof ShippingForm> = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "address_line1",
      "city",
      "country",
    ];
    for (const field of requiredFields) {
      if (!shipping[field].trim()) {
        toast.error("Please fill in all required fields.");
        return false;
      }
    }
    if (!selectedMethod) {
      toast.error("Please select a payment method.");
      return false;
    }
    if (selectedMethod.gateway === "manual_bank" && !receiptFile) {
      toast.error("Please upload a payment receipt.");
      return false;
    }
    return true;
  };

  const buildPayload = (method: ApiPaymentMethod) => {
    const sessionId = getAuthToken() ? null : getSessionId();
    return {
      payment_method_id: method.id,
      session_id: sessionId,
      currency: "LKR",
      shipping_total: deliveryFee,
      notes: notes.trim() || undefined,
      shipping: {
        first_name: shipping.first_name.trim(),
        last_name: shipping.last_name.trim(),
        email: shipping.email.trim(),
        phone: shipping.phone.trim(),
        address_line1: shipping.address_line1.trim(),
        address_line2: shipping.address_line2.trim() || undefined,
        city: shipping.city.trim(),
        country: shipping.country.trim(),
        postal_code: shipping.postal_code.trim() || undefined,
      },
      payment_receipt: receiptFile,
    };
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate() || !selectedMethod) return;
    setIsSubmitting(true);

    try {
      const payload = buildPayload(selectedMethod);

      if (selectedMethod.type === "online") {
        const payment = await initPayment(payload);
        const checkout = payment.checkout ?? {};
        const redirectUrl =
          (checkout as { redirect_url?: string }).redirect_url ||
          (checkout as { payment_url?: string }).payment_url ||
          (checkout as { url?: string }).url ||
          (checkout as { checkout_url?: string }).checkout_url;

        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }

        if (payment.payment?.id) {
          const order = await createOrder({
            ...payload,
            payment_id: payment.payment.id,
            payment_method_id: null,
          });
          await clearCart();
          toast.success("Order placed successfully.");
          navigate("/order-success", { state: { orderNumber: order.order.order_number } });
          return;
        }

        toast.error("Payment initialized, but redirect URL is missing.");
        return;
      }

      const order = await createOrder(payload);
      await clearCart();
      toast.success("Order placed successfully.");
      navigate("/order-success", { state: { orderNumber: order.order.order_number } });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Checkout failed.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-4xl font-heading text-foreground mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground font-body mb-8">Add items before checking out.</p>
        <Link to="/products" className="comic-btn-primary text-xl">Shop now</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-body mb-6 transition-colors">
        ← Back to Cart
      </Link>

      <h1 className="text-4xl md:text-5xl font-heading text-foreground mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="comic-card p-6">
            <h2 className="font-heading text-2xl text-foreground mb-4">Shipping Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="font-body text-sm text-muted-foreground">First name *</span>
                <input
                  className="comic-input"
                  value={shipping.first_name}
                  onChange={(e) => updateField("first_name", e.target.value)}
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="font-body text-sm text-muted-foreground">Last name *</span>
                <input
                  className="comic-input"
                  value={shipping.last_name}
                  onChange={(e) => updateField("last_name", e.target.value)}
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="font-body text-sm text-muted-foreground">Email *</span>
                <input
                  type="email"
                  className="comic-input"
                  value={shipping.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="font-body text-sm text-muted-foreground">Phone *</span>
                <input
                  className="comic-input"
                  value={shipping.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  required
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="font-body text-sm text-muted-foreground">Address line 1 *</span>
                <input
                  className="comic-input"
                  value={shipping.address_line1}
                  onChange={(e) => updateField("address_line1", e.target.value)}
                  required
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="font-body text-sm text-muted-foreground">Address line 2</span>
                <input
                  className="comic-input"
                  value={shipping.address_line2}
                  onChange={(e) => updateField("address_line2", e.target.value)}
                />
              </label>
              <label className="space-y-2">
                <span className="font-body text-sm text-muted-foreground">City *</span>
                <input
                  className="comic-input"
                  value={shipping.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  required
                />
              </label>
              <label className="space-y-2">
                <span className="font-body text-sm text-muted-foreground">Postal code</span>
                <input
                  className="comic-input"
                  value={shipping.postal_code}
                  onChange={(e) => updateField("postal_code", e.target.value)}
                />
              </label>
              <label className="space-y-2">
                <span className="font-body text-sm text-muted-foreground">Country *</span>
                <input
                  className="comic-input"
                  value={shipping.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  required
                />
              </label>
            </div>
          </div>

          <div className="comic-card p-6">
            <h2 className="font-heading text-2xl text-foreground mb-4">Payment Method</h2>
            {paymentMethodsQuery.isLoading ? (
              <p className="text-muted-foreground font-body">Loading payment methods...</p>
            ) : paymentMethodsQuery.error ? (
              <p className="text-destructive font-body">Unable to load payment methods.</p>
            ) : (
              <div className="space-y-3">
                {activeMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`comic-card border-2 p-4 flex items-start gap-3 cursor-pointer ${
                      selectedMethodId === method.id ? "border-primary" : "border-foreground/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      className="mt-1"
                      checked={selectedMethodId === method.id}
                      onChange={() => setSelectedMethodId(method.id)}
                    />
                    <div>
                      <p className="font-heading text-lg text-foreground">{method.name}</p>
                      {method.description && (
                        <p className="text-sm text-muted-foreground font-body">{method.description}</p>
                      )}
                      {method.instructions && (
                        <p className="text-xs text-muted-foreground font-body mt-2">{method.instructions}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {selectedMethod?.gateway === "manual_bank" && (
              <div className="mt-4">
                <label className="space-y-2 block">
                  <span className="font-body text-sm text-muted-foreground">Upload payment receipt *</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="comic-card p-6">
            <h2 className="font-heading text-2xl text-foreground mb-4">Order Notes</h2>
            <textarea
              className="comic-input min-h-[120px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions?"
            />
          </div>
        </div>

        <div>
          <div className="comic-card p-6 sticky top-24">
            <h2 className="font-heading text-2xl text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between font-body">
                <span className="text-muted-foreground">Items</span>
                <span className="font-bold">{totalItems}</span>
              </div>
              <div className="flex justify-between font-body">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">Rs.{subtotal}</span>
              </div>
              <div className="flex justify-between font-body">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-bold text-primary">{deliveryFee === 0 ? "FREE" : `Rs.${deliveryFee}`}</span>
              </div>
              <div className="border-t-2 border-foreground pt-3 flex justify-between">
                <span className="font-heading text-xl">TOTAL</span>
                <span className="font-heading text-2xl text-primary">Rs.{grandTotal}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`comic-btn-accent text-xl w-full justify-center ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? "Placing order..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
