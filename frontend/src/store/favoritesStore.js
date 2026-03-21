import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (restaurantId) => {
        const { favorites } = get();
        if (favorites.includes(restaurantId)) {
          set({ favorites: favorites.filter((id) => id !== restaurantId) });
        } else {
          set({ favorites: [...favorites, restaurantId] });
        }
      },
      isFavorite: (restaurantId) => get().favorites.includes(restaurantId),
    }),
    {
      name: 'foodzone-favorites',
    }
  )
);
