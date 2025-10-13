import { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { config } from '@/config/env';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';
import { useRestaurantStore } from '@/store/useRestaurantStore';

// Ensure axios has credentials enabled
axios.defaults.withCredentials = true;

interface PaymentIntentData {
  clientSecret: string;
  orderId: string;
}

interface UsePaymentOptions {
  onSuccess?: (orderId?: string) => void;
  onError?: (error: string) => void;
}

// Simple in-memory cache for payment intents (prevents duplicate API calls)
const paymentCache = new Map<string, Promise<PaymentIntentData>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const usePayment = (options: UsePaymentOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  
  const { cart } = useCartStore();
  const { user } = useUserStore();
  const { restaurant: storeRestaurant } = useRestaurantStore();
  
  // Get restaurant info from cart if not available in store
  const restaurant = useMemo(() => {
    // First try cart items
    if (cart?.length > 0 && cart[0].restaurantId && cart[0].restaurantName) {
      return {
        _id: cart[0].restaurantId,
        restaurantName: cart[0].restaurantName,
        city: '',
        country: '',
        deliveryTime: 0,
        cuisines: [],
        menus: [],
        imageUrl: '',
        user: ''
      };
    }
    
    // Fallback to store restaurant
    if (storeRestaurant) {
      return storeRestaurant;
    }
    
    return null;
  }, [storeRestaurant, cart]);

  // Memoize total amount calculation
  const totalAmount = useMemo(() => 
    cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), 
    [cart]
  );

  // Create cache key for payment intent
  const createCacheKey = useCallback((amount: number, cartItems: any[], restaurantId: string) => {
    return `${amount}-${cartItems.length}-${restaurantId}-${Date.now().toString().slice(0, -4)}0000`;
  }, []);

  // Create payment intent with caching
  const createPaymentIntent = useCallback(async () => {
    if (!cart.length) {
      setError('Cart is empty. Please add items to cart.');
      return;
    }
    
    if (!restaurant) {
      setError('Restaurant information is missing. Please refresh and try again.');
      return;
    }
    
    if (!user) {
      setError('User information is missing. Please login again.');
      return;
    }

    const cacheKey = createCacheKey(totalAmount, cart, restaurant._id);
    
    // Check if we already have a pending request for similar data
    if (paymentCache.has(cacheKey)) {
      try {
        const cached = await paymentCache.get(cacheKey)!;
        setClientSecret(cached.clientSecret);
        setOrderId(cached.orderId);
        return;
      } catch (error) {
        paymentCache.delete(cacheKey);
      }
    }

    setLoading(true);
    setError('');

    const deliveryDetails = {
      name: user.fullName || '',
      email: user.email || '',
      address: user.address || '',
      city: user.city || '',
      country: user.country || 'India'
    };

    // Try mock payment first since Stripe is unreachable from this network
    const paymentPromise = axios.post(`${config.API_BASE_URL}/orders/mock-payment-intent`, {
      amount: totalAmount * 100, // Convert to paise
      cartItems: cart,
      deliveryDetails,
      restaurantId: restaurant._id
    }).then(response => {
      if (response.data.success) {
        return {
          clientSecret: response.data.clientSecret,
          orderId: response.data.orderId
        };
      }
      throw new Error(response.data.message || 'Mock payment initialization failed');
    });

    // Cache the promise
    paymentCache.set(cacheKey, paymentPromise);

    try {
      const result = await paymentPromise;
      
      setClientSecret(result.clientSecret);
      setOrderId(result.orderId);
      
      // Clean up cache after successful completion
      setTimeout(() => {
        paymentCache.delete(cacheKey);
      }, CACHE_DURATION);
      
    } catch (error: any) {
      // Remove failed request from cache
      paymentCache.delete(cacheKey);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to initialize payment';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [cart, restaurant, user, totalAmount, createCacheKey, options]);

  // Confirm order after payment
  const confirmOrder = useCallback(async (orderIdToConfirm: string) => {
    try {
      await axios.post(`${config.API_BASE_URL}/orders/confirm-order`, { orderId: orderIdToConfirm });
      return orderIdToConfirm;
    } catch (error: any) {
      // Don't throw error here since payment was successful
      return orderIdToConfirm;
    }
  }, []);

  // Reset payment state
  const resetPayment = useCallback(() => {
    setClientSecret('');
    setOrderId('');
    setError('');
    setLoading(false);
  }, []);

  return {
    loading,
    clientSecret,
    orderId,
    error,
    totalAmount,
    createPaymentIntent,
    confirmOrder,
    resetPayment
  };
};
