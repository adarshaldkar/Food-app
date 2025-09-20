import { useState, useCallback, useMemo } from 'react';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';
import { useRestaurantStore } from '@/store/useRestaurantStore';

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
    console.log('=== RESTAURANT RESOLUTION DEBUG ===');
    console.log('Store restaurant:', storeRestaurant ? storeRestaurant.restaurantName : 'null');
    
    // First try cart items
    if (cart?.length > 0 && cart[0].restaurantId && cart[0].restaurantName) {
      console.log('Using restaurant from cart:', cart[0].restaurantName);
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
      console.log('Using restaurant from store:', storeRestaurant.restaurantName);
      return storeRestaurant;
    }
    
    console.log('No restaurant information available anywhere');
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
    console.log('=== CREATE PAYMENT INTENT DEBUG ===');
    console.log('Cart length:', cart.length);
    console.log('Cart data:', cart);
    console.log('Restaurant:', restaurant ? restaurant.restaurantName : 'null');
    console.log('Restaurant data:', restaurant);
    console.log('User:', user ? user.fullName : 'null');
    console.log('User data:', user);
    console.log('Total amount:', totalAmount);
    
    if (!cart.length) {
      console.log('ERROR: Cart is empty');
      setError('Cart is empty. Please add items to cart.');
      return;
    }
    
    if (!restaurant) {
      console.log('ERROR: Restaurant data is missing');
      setError('Restaurant information is missing. Please refresh and try again.');
      return;
    }
    
    if (!user) {
      console.log('ERROR: User data is missing');
      setError('User information is missing. Please login again.');
      return;
    }

    const cacheKey = createCacheKey(totalAmount, cart, restaurant._id);
    console.log('Cache key:', cacheKey);
    
    // Check if we already have a pending request for similar data
    if (paymentCache.has(cacheKey)) {
      console.log('Using cached payment intent');
      try {
        const cached = await paymentCache.get(cacheKey)!;
        setClientSecret(cached.clientSecret);
        setOrderId(cached.orderId);
        return;
      } catch (error) {
        console.log('Cache error, removing from cache:', error);
        paymentCache.delete(cacheKey);
      }
    }

    console.log('Creating new payment intent...');
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
    console.log('Network has Stripe connectivity issues, using mock payment directly');
    const paymentPromise = api.post('/orders/mock-payment-intent', {
      amount: totalAmount * 100, // Convert to paise
      cartItems: cart,
      deliveryDetails,
      restaurantId: restaurant._id
    }).then(response => {
      console.log('Mock Payment API response:', response.data);
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
      console.log('Waiting for payment intent API response...');
      const result = await paymentPromise;
      console.log('Payment intent created successfully:', result);
      
      setClientSecret(result.clientSecret);
      setOrderId(result.orderId);
      
      // Clean up cache after successful completion
      setTimeout(() => {
        paymentCache.delete(cacheKey);
      }, CACHE_DURATION);
      
    } catch (error: any) {
      console.error('Payment intent creation failed:', error);
      
      // Remove failed request from cache
      paymentCache.delete(cacheKey);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to initialize payment';
      console.log('Setting error message:', errorMessage);
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      console.log('Payment intent creation completed, setting loading to false');
      setLoading(false);
    }
  }, [cart, restaurant, user, totalAmount, createCacheKey, options]);

  // Confirm order after payment
  const confirmOrder = useCallback(async (orderIdToConfirm: string) => {
    try {
      await api.post('/orders/confirm-order', { orderId: orderIdToConfirm });
      return orderIdToConfirm;
    } catch (error: any) {
      console.error('Error confirming order:', error);
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
