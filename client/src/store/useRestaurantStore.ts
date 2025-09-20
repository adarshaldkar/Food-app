import { Orders } from "@/types/orderType";
import { MenuItem, RestaurantState } from "@/types/restaurantType";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = "http://localhost:5001/api/v1/restaurant"; // Update with your actual API endpoint
axios.defaults.withCredentials = true;


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
            console.log('Fetching restaurant from frontend...');
            const response = await axios.get(`${API_END_POINT}/`);
            console.log('Restaurant API response:', response.data);
            if (response.data.success) {
                console.log('Setting restaurant:', response.data.restaurant?.restaurantName);
                set({ loading: false, restaurant: response.data.restaurant });
            }
        } catch (error: any) {
            console.log('Error fetching restaurant:', error.response?.data || error.message);
            if (error.response?.status === 404) {
                console.log('No restaurant found, setting to null');
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
            console.error('Search error:', error);
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
            console.error('Get all restaurants error:', error);
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
            console.log('=== GET SINGLE RESTAURANT DEBUG ===');
            console.log('Fetching restaurant ID:', restaurantId);
            
            const response = await axios.get(`${API_END_POINT}/${restaurantId}`);
            console.log('Restaurant API response:', response.data);
            
            if (response.data.success) {
                console.log('Setting single restaurant:', response.data.restaurant?.restaurantName);
                set({ singleRestaurant: response.data.restaurant })
            } else {
                console.log('Restaurant API returned success=false:', response.data.message);
                set({ singleRestaurant: null });
            }
        } catch (error: any) {
            console.error('Error fetching single restaurant:', error);
            console.error('Error details:', error.response?.data || error.message);
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
            console.log(error);
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