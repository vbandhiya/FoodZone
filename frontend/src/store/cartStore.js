import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) => set((state) => {
        const existing = state.cart.find(i => i.id === item.id);
        if (existing) {
          return { cart: state.cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
      }),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id)
      })),
      updateQuantity: (id, change) => set((state) => ({
        cart: state.cart.map(i => {
          if (i.id === id) {
            const newQuantity = i.quantity + change;
            return { ...i, quantity: newQuantity > 0 ? newQuantity : 1 };
          }
          return i;
        })
      })),
      clearCart: () => set({ cart: [] }),
      cartTotal: () => get().cart.reduce((total, item) => total + (item.price * item.quantity), 0),
      cartCount: () => get().cart.reduce((count, item) => count + item.quantity, 0)
    }),
    {
      name: 'foodzone-cart', // name of item in the storage (must be unique)
    }
  )
);
