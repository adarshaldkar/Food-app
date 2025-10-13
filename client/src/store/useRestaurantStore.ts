import { Orders } from "@/types/orderType";
import { MenuItem, RestaurantState } from "@/types/restaurantType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { config } from "@/config/env";

const API_END_POINT = `${config.API_BASE_URL}/restaurant`;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 15000;


export const useRestaurantStore = create<RestaurantState>()(persist((set, get) => ({
    loading: false,
    restaurant: null,
    searchedRestaurant: null,
    appliedFilter: [],
    singleRestaurant: null,
    restaurantOrder: [],
    createRestaurant: async (formData: FormData) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    getRestaurant: async () => {
        try {
            set({ loading: true });
            const response = await axios.get(`${API_END_POINT}/`);
            if (response.data.success) {
                set({ loading: false, restaurant: response.data.restaurant });
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                set({ restaurant: null });
            }
            set({ loading: false });
        }
    },
    updateRestaurant: async (formData: FormData) => {
        try {
            set({ loading: true });
            const response = await axios.put(`${API_END_POINT}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    searchRestaurant: async (searchText: string, searchQuery: string, selectedCuisines: any) => {
        try {
            set({ loading: true });

            // If no search term and no filters, get all restaurants
            if ((!searchText || searchText === 'all') && (!searchQuery || searchQuery === '') && selectedCuisines.length === 0) {
                const response = await axios.get(`${API_END_POINT}/all`);
                if (response.data.success) {
                    set({ loading: false, searchedRestaurant: { data: response.data.restaurants } });
                }
                return;
            }

            const params = new URLSearchParams();
            params.set("searchQuery", searchQuery);
            params.set("selectedCuisines", selectedCuisines.join(","));

            // await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await axios.get(`${API_END_POINT}/search/${searchText}?${params.toString()}`);
            if (response.data.success) {
                set({ loading: false, searchedRestaurant: { data: response.data.restaurants } });
            }
        } catch (error) {
            set({ loading: false });
        }
    },
    getAllRestaurants: async () => {
        try {
            set({ loading: true });
            const response = await axios.get(`${API_END_POINT}/all`);
            if (response.data.success) {
                set({ loading: false, searchedRestaurant: { data: response.data.restaurants } });
            }
        } catch (error) {
            set({ loading: false });
        }
    },
    addMenuToRestaurant: (menu: MenuItem) => {
        set((state: any) => ({
            restaurant: state.restaurant ? { ...state.restaurant, menus: [...(state.restaurant.menus || []), menu] } : null,
        }))
    },
    updateMenuToRestaurant: (updatedMenu: MenuItem) => {
        set((state: any) => {
            
            if (state.restaurant) {
                const updatedMenuList = (state.restaurant.menus || []).map((menu: any) => menu._id === updatedMenu._id ? updatedMenu : menu);
                return {
                    restaurant: {
                        ...state.restaurant,
                        menus: updatedMenuList
                    }
                }
            }
            // if state.restaruant is undefined then return state
            return state;
        })
    },
    removeMenuFromRestaurant: (menuId: string) => {
        set((state: any) => {
            if (state.restaurant) {
                const filteredMenus = (state.restaurant.menus || []).filter((menu: any) => menu._id !== menuId);
                return {
                    restaurant: {
                        ...state.restaurant,
                        menus: filteredMenus
                    }
                }
            }
            return state;
        })
    },
    setAppliedFilter: (value: string) => {
        set((state) => {
            const isAlreadyApplied = state.appliedFilter.includes(value);
            const updatedFilter = isAlreadyApplied ? state.appliedFilter.filter((item) => item !== value) : [...state.appliedFilter, value];
            return { appliedFilter: updatedFilter }
        })
    },
    resetAppliedFilter: () => {
        set({ appliedFilter: [] });
    },
    getSingleRestaurant: async (restaurantId: string) => {
        try {
            const response = await axios.get(`${API_END_POINT}/${restaurantId}`);
            
            if (response.data.success) {
                set({ singleRestaurant: response.data.restaurant })
            } else {
                set({ singleRestaurant: null });
            }
        } catch (error: any) {
            set({ singleRestaurant: null });
        }
    },
    getRestaurantOrders: async () => {
        try {
            const response = await axios.get(`${API_END_POINT}/order`);
            if (response.data.success) {
                set({ restaurantOrder: response.data.orders });
            }
        } catch (error) {
            // Handle error silently
        }
    },
    updateRestaurantOrder: async (orderId: string, status: string) => {
        try {
            const response = await axios.put(`${API_END_POINT}/order/${orderId}/status`, { status }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                const updatedOrder = get().restaurantOrder.map((order: Orders) => {
                    return order._id === orderId ? { ...order, status: response.data.status } : order;
                })
                set({ restaurantOrder: updatedOrder });
                toast.success(response.data.message);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    },
    
    // Add method to clear restaurant cache
    clearRestaurantCache: () => {
        set({ restaurant: null, restaurantOrder: [], singleRestaurant: null });
    }

}), {
    name: 'restaurant-name',
    storage: createJSONStorage(() => localStorage)
}))