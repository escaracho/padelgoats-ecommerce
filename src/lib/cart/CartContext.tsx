import { createContext, useContext, useState, ReactNode } from 'react';
import { Producto } from '@/app/models/types';

interface CartItem extends Producto {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Producto) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext; 