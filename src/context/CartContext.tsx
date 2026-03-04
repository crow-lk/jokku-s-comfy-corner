import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  addCartItem,
  clearCart as apiClearCart,
  fetchCart,
  removeCartItem as apiRemoveCartItem,
  updateCartItem as apiUpdateCartItem,
  type ApiCart,
  type ApiCartItem,
} from "@/lib/api";

interface CartContextType {
  cart: ApiCart | null;
  items: ApiCartItem[];
  addItem: (variantId: number, quantity: number) => Promise<void>;
  updateItem: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ApiCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadCart = async () => {
      try {
        const data = await fetchCart();
        if (active) {
          setCart(data ?? null);
        }
      } catch {
        if (active) {
          setCart(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      active = false;
    };
  }, []);

  const addItem = useCallback(async (variantId: number, quantity: number) => {
    const response = await addCartItem(variantId, quantity);
    setCart(response.cart ?? null);
  }, []);

  const updateItem = useCallback(async (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      const response = await apiRemoveCartItem(cartItemId);
      setCart(response.cart ?? null);
      return;
    }
    const response = await apiUpdateCartItem(cartItemId, quantity);
    setCart(response.cart ?? null);
  }, []);

  const removeItem = useCallback(async (cartItemId: number) => {
    const response = await apiRemoveCartItem(cartItemId);
    setCart(response.cart ?? null);
  }, []);

  const clearCart = useCallback(async () => {
    const response = await apiClearCart();
    setCart(response.cart ?? null);
  }, []);

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? items.reduce((sum, item) => sum + item.line_total, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        totalItems,
        subtotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
