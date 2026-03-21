import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAddressStore = create(
  persist(
    (set, get) => ({
      addresses: [
        { id: '1', label: 'Home', fullAddress: '123 Foodie Lane, Apartment 4B, Food City, FC 12345', isDefault: true }
      ],
      addAddress: (address) => set((state) => ({ 
        addresses: [...state.addresses, { ...address, id: Date.now().toString() }] 
      })),
      updateAddress: (id, updatedAddress) => set((state) => ({
        addresses: state.addresses.map((addr) => addr.id === id ? { ...addr, ...updatedAddress } : addr)
      })),
      deleteAddress: (id) => set((state) => ({
        addresses: state.addresses.filter((addr) => addr.id !== id)
      })),
      setDefaultAddress: (id) => set((state) => ({
        addresses: state.addresses.map((addr) => ({ ...addr, isDefault: addr.id === id }))
      })),
      getDefaultAddress: () => get().addresses.find(addr => addr.isDefault) || get().addresses[0]
    }),
    {
      name: 'foodzone-addresses',
    }
  )
);
