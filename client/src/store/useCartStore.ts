import { CartState } from "@/types/cartType";
import { MenuItem } from "@/types/restaurantType";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


export const useCartStore = create<CartState>()(persist((set, get) => ({
    cart: [],
    addToCart: (item: MenuItem, restaurantId?: string, restaurantName?: string) => {
        set((state) => {
            const exisitingItem = state.cart.find((cartItem) => cartItem._id === item._id);
            if (exisitingItem) {
                // already added in cart then inc qty
                return {
                    cart: state?.cart.map((cartItem) => cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                    )
                };
            } else {
                // add cart with restaurant info
                const newCartItem = { 
                    ...item, 
                    quantity: 1,
                    restaurantId: restaurantId || '',
                    restaurantName: restaurantName || ''
                };
                return {
                    cart: [...state.cart, newCartItem]
                }
            }
        })
    },
    clearCart: () => {
        set({ cart: [] });
    },
    removeFromTheCart: (id: string) => {
        set((state) => ({
            cart: state.cart.filter((item) => item._id !== id)
        }))
    },
    incrementQuantity: (id: string) => {
        set((state) => ({
            cart: state.cart.map((item) => item._id === id ? { ...item, quantity: item.quantity + 1 } : item)
        }))
    },
    decrementQuantity: (id: string) => {
        set((state) => ({
            cart: state.cart.map((item) => item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)
        }))
    },
    // Debug method to check cart state
    debugCart: () => {
        const state = get();
        return state.cart;
    }
}),
    {
        name: 'cart-name',
        storage: createJSONStorage(() => localStorage)
    }
))