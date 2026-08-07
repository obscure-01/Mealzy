import React, { createContext, useContext, useState, useMemo } from 'react';
import { OrderItem } from '@/services/orderService';
import { BackendItem } from '@/services/homeService';

interface CartItem extends BackendItem {
  cartQuantity: number;
}

interface CartContextData {
  canteenId: number | null;
  items: CartItem[];
  addItem: (canteenId: number, item: BackendItem, quantity: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [canteenId, setCanteenId] = useState<number | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (newCanteenId: number, item: BackendItem, quantity: number) => {
    if (canteenId !== null && canteenId !== newCanteenId) {
      // Clear cart if switching canteens (per typical food delivery app logic)
      setCanteenId(newCanteenId);
      setItems([{ ...item, cartQuantity: quantity }]);
      return;
    }

    setCanteenId(newCanteenId);
    setItems((prev) => {
      const existing = prev.find((i) => i.item_id === item.item_id);
      if (existing) {
        return prev.map((i) =>
          i.item_id === item.item_id
            ? { ...i, cartQuantity: i.cartQuantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, cartQuantity: quantity }];
    });
  };

  const removeItem = (itemId: number) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.item_id !== itemId);
      if (updated.length === 0) {
        setCanteenId(null);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCanteenId(null);
    setItems([]);
  };

  const totalPrice = useMemo(() => {
    return items.reduce((acc, item) => acc + parseFloat(item.price) * item.cartQuantity, 0);
  }, [items]);

  return (
    <CartContext.Provider value={{ canteenId, items, addItem, removeItem, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
