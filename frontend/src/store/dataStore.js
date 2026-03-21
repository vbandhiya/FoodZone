import { create } from 'zustand';

export const useDataStore = create((set, get) => ({
  restaurants: [],
  foods: [],
  isLoadingRestaurants: false,
  isLoadingFoods: false,

  fetchRestaurants: async () => {
    // Return early if cache is already hydrated
    if (get().restaurants.length > 0) return;
    
    set({ isLoadingRestaurants: true });
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/restaurants`);
      if (res.ok) {
        const data = await res.json();
        set({ restaurants: data });
      }
    } catch (error) {
      console.error("Failed to fetch restaurants globally:", error);
    } finally {
      set({ isLoadingRestaurants: false });
    }
  },

  fetchFoods: async () => {
    // Return early if cache is already hydrated
    if (get().foods.length > 0) return;

    set({ isLoadingFoods: true });
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/food`);
      if (res.ok) {
        const data = await res.json();
        set({ foods: data });
      }
    } catch (error) {
      console.error("Failed to fetch foods globally:", error);
    } finally {
      set({ isLoadingFoods: false });
    }
  }
}));
