import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  menuItemId: string;
  quantity: number;
  name: string;
  priceMad: number;
  imageUrl?: string;
}

export interface CartState {
  standId: string | null;
  items: CartItem[];
}

interface AppState {
  fanSessionId: string | null;
  riderId: string | null;
  adminId: string | null;
  cart: CartState;
  
  setFanSessionId: (id: string | null) => void;
  setRiderId: (id: string | null) => void;
  setAdminId: (id: string | null) => void;
  
  addToCart: (standId: string, item: CartItem) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      fanSessionId: null,
      riderId: null,
      adminId: null,
      cart: { standId: null, items: [] },
      
      setFanSessionId: (id) => set({ fanSessionId: id }),
      setRiderId: (id) => set({ riderId: id }),
      setAdminId: (id) => set({ adminId: id }),
      
      addToCart: (standId, item) => set((state) => {
        if (state.cart.standId && state.cart.standId !== standId) {
          // If switching stands, we expect the caller to have confirmed this already.
          // Or we can just overwrite. The caller should handle the confirmation dialog.
          return { cart: { standId, items: [item] } };
        }
        
        const existingItem = state.cart.items.find(i => i.menuItemId === item.menuItemId);
        if (existingItem) {
          return {
            cart: {
              standId,
              items: state.cart.items.map(i => 
                i.menuItemId === item.menuItemId 
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            }
          };
        }
        
        return {
          cart: {
            standId,
            items: [...state.cart.items, item]
          }
        };
      }),
      
      removeFromCart: (menuItemId) => set((state) => ({
        cart: {
          ...state.cart,
          items: state.cart.items.filter(i => i.menuItemId !== menuItemId)
        }
      })),
      
      updateQuantity: (menuItemId, quantity) => set((state) => ({
        cart: {
          ...state.cart,
          items: state.cart.items.map(i => 
            i.menuItemId === menuItemId ? { ...i, quantity } : i
          )
        }
      })),
      
      clearCart: () => set({ cart: { standId: null, items: [] } }),
    }),
    {
      name: 'se-storage',
    }
  )
);
