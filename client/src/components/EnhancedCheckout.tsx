import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';
import { useRestaurantStore } from '@/store/useRestaurantStore';
import { usePayment } from '@/hooks/usePayment';
import { toast } from 'sonner';
import { Loader2, X, XCircle, AlertCircle } from 'lucide-react';
import { PaymentSkeleton } from './skeletons';

// Lazy load Stripe for better initial page load
let stripePromise: Promise<any> | null = null;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
      'pk_test_51QayA6P9k0Xn0PQSFMIGe1LnDI1WgPhX1iC4UiFR7WQBQG4N8dP1qUbIEQNtFRHJZaVOaxmhEvJRRFkCjhGmSkGy00YiFw8RUz'
    );
  }
  return stripePromise;
};

// Stripe appearance configuration for dark mode support
const stripeAppearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#f97316', // Orange color
    colorBackground: '#ffffff',
    colorText: '#374151',
    colorDanger: '#df1b41',
    fontFamily: 'Inter, system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '6px'
  }
};

// Validation functions
const isPlaceholderText = (value: string, field: string): boolean => {
  const placeholderPatterns = {
    city: /^(update your city|enter your city)$/i,
    address: /^(update your address|enter your complete address)$/i,
    country: /^(update your country|enter your country)$/i,
    name: /^(update your|enter your|full name)$/i,
    contact: /^(update your|enter your|contact|phone|mobile)$/i
  };
  
  return placeholderPatterns[field as keyof typeof placeholderPatterns]?.test(value.trim()) || false;
};

const validateDeliveryDetails = (details: any) => {
  const errors: Record<string, string> = {};
  
  // Name validation
  if (!details.name || details.name.trim().length === 0) {
    errors.name = 'Full name is required';
  } else if (isPlaceholderText(details.name, 'name')) {
    errors.name = 'Please enter your actual full name';
  } else if (details.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters long';
  }
  
  // Email validation (already handled by HTML5 validation)
  if (!details.email || details.email.trim().length === 0) {
    errors.email = 'Email is required';
  }
  
  // Contact validation removed - not part of user profile
  
  // City validation
  if (!details.city || details.city.trim().length === 0) {
    errors.city = 'City is required';
  } else if (isPlaceholderText(details.city, 'city')) {
    errors.city = 'Please enter your actual city name';
  } else if (details.city.trim().length < 2) {
    errors.city = 'City name must be at least 2 characters long';
  }
  
  // Address validation
  if (!details.address || details.address.trim().length === 0) {
    errors.address = 'Address is required';
  } else if (isPlaceholderText(details.address, 'address')) {
    errors.address = 'Please enter your actual complete address';
  } else if (details.address.trim().length < 10) {
    errors.address = 'Please provide a more detailed address (at least 10 characters)';
  }
  
  // Country validation
  if (!details.country || details.country.trim().length === 0) {
    errors.country = 'Country is required';
  } else if (isPlaceholderText(details.country, 'country')) {
    errors.country = 'Please enter your actual country name';
  } else if (details.country.trim().length < 2) {
    errors.country = 'Country name must be at least 2 characters long';
  }
  
  return errors;
};

interface DeliveryErrors {
  name?: string;
  email?: string;
  city?: string;
  address?: string;
  country?: string;
}

interface CheckoutFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  clientSecret: string;
  orderId: string;
  totalAmount: number;
};

// Error message component
const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="flex items-center gap-1 mt-1 text-sm text-red-600 dark:text-red-400">
      <AlertCircle className="h-3 w-3" />
      <span>{message}</span>
    </div>
  );
};

// Mock checkout form for development
const MockCheckoutForm: React.FC<CheckoutFormProps> = React.memo(({ 
  onSuccess, 
  onError, 
  clientSecret, 
  orderId, 
  totalAmount 
}) => {
  const { clearCart } = useCartStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<DeliveryErrors>({});
  
  const [deliveryDetails, setDeliveryDetails] = useState(() => ({
    name: user?.fullName || '',
    email: user?.email || '',
    address: user?.address || 'Update your address',
    city: user?.city || 'Update your city',
    country: user?.country || 'Update your country'
  }));
  
  const { confirmOrder } = usePayment({ onError });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof DeliveryErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    setDeliveryDetails(prev => ({
      ...prev,
      [name]: value
    }));
  }, [errors]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate delivery details
    const validationErrors = validateDeliveryDetails(deliveryDetails);
    setErrors(validationErrors);
    
    // If there are validation errors, don't proceed
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the errors in the delivery details before proceeding');
      return;
    }
    
    setLoading(true);

    try {
      console.log('Processing mock payment...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const confirmedOrderId = await confirmOrder(orderId);
        clearCart();
        onSuccess(confirmedOrderId);
      } catch (error) {
        console.error('Mock order confirmation failed:', error);
        clearCart();
        onSuccess(orderId);
      }
    } catch (error: any) {
      onError(error.response?.data?.message || 'Mock payment failed');
    } finally {
      setLoading(false);
    }
  }, [deliveryDetails, orderId, confirmOrder, clearCart, onSuccess, onError]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Delivery Details - Same as real form */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={deliveryDetails.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
            />
            <ErrorMessage message={errors.name} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={deliveryDetails.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              disabled
              className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
            />
            <ErrorMessage message={errors.email} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              type="text"
              required
              value={deliveryDetails.city}
              onChange={handleInputChange}
              placeholder="Update your city"
              className={errors.city ? 'border-red-500 focus:border-red-500' : ''}
            />
            <ErrorMessage message={errors.city} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              type="text"
              required
              value={deliveryDetails.address}
              onChange={handleInputChange}
              placeholder="Update your address"
              className={errors.address ? 'border-red-500 focus:border-red-500' : ''}
            />
            <ErrorMessage message={errors.address} />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              type="text"
              required
              value={deliveryDetails.country}
              onChange={handleInputChange}
              placeholder="Update your country"
              className={errors.country ? 'border-red-500 focus:border-red-500' : ''}
            />
            <ErrorMessage message={errors.country} />
          </div>
        </div>
      </div>

      <Separator />

      {/* Mock Payment Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <div className="text-blue-600 dark:text-blue-400 mr-2">⚠️</div>
          <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Development Mode</h4>
        </div>
        <p className="text-blue-700 dark:text-blue-300 mb-4">
          Stripe is currently unavailable. Using mock payment for testing.
        </p>
        <div className="bg-white dark:bg-gray-800 p-3 rounded border">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Mock Payment Details:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><strong>Card:</strong> 4242 4242 4242 4242</div>
            <div><strong>Expiry:</strong> 12/28</div>
            <div><strong>CVC:</strong> 123</div>
            <div><strong>ZIP:</strong> 12345</div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-orange hover:bg-hoverOrange text-white py-3 text-lg font-semibold"
      >
        {loading ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Mock Payment...
          </div>
        ) : (
          `Mock Pay ₹${totalAmount} (Dev Mode)`
        )}
      </Button>

      <div className="text-center text-sm text-gray-500">
        <p>🔒 Mock payment for development purposes only</p>
      </div>
    </form>
  );
});

// Real Stripe checkout form
const CheckoutForm: React.FC<CheckoutFormProps> = React.memo(({ 
  onSuccess, 
  onError, 
  clientSecret, 
  orderId, 
  totalAmount 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCartStore();
  const { user } = useUserStore();
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<DeliveryErrors>({});
  
  // Memoize delivery details to prevent unnecessary re-renders
  const [deliveryDetails, setDeliveryDetails] = useState(() => ({
    name: user?.fullName || '',
    email: user?.email || '',
    address: user?.address || 'Update your address',
    city: user?.city || 'Update your city',
    country: user?.country || 'Update your country'
  }));
  
  // Use optimized payment hook for order confirmation
  const { confirmOrder } = usePayment({
    onError
  });

  // Optimize input change handler with useCallback
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof DeliveryErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    setDeliveryDetails(prev => ({
      ...prev,
      [name]: value
    }));
  }, [errors]);

  // Optimize submit handler with useCallback
  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate delivery details
    const validationErrors = validateDeliveryDetails(deliveryDetails);
    setErrors(validationErrors);
    
    // If there are validation errors, don't proceed
    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix the errors in the delivery details before proceeding');
      return;
    }

    if (!clientSecret) {
      return;
    }

    setLoading(true);

    try {
      // Handle mock payments
      if (clientSecret.startsWith('mock_')) {
        console.log('Processing mock payment...');
        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Auto-confirm mock payment
        try {
          const confirmedOrderId = await confirmOrder(orderId);
          clearCart();
          onSuccess(confirmedOrderId);
        } catch (error) {
          console.error('Mock order confirmation failed:', error);
          clearCart();
          onSuccess(orderId);
        }
        return;
      }

      // Handle real Stripe payments
      if (!stripe || !elements) {
        onError('Payment system not initialized');
        return;
      }

      // Confirm payment with PaymentElement
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order/status`,
          payment_method_data: {
            billing_details: {
              name: deliveryDetails.name,
              email: deliveryDetails.email,
              address: {
                line1: deliveryDetails.address,
                city: deliveryDetails.city,
                country: 'IN',
              }
            }
          }
        },
        redirect: 'if_required'
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else {
        // Confirm the order after successful payment
        try {
          const confirmedOrderId = await confirmOrder(orderId);
          // Only clear cart after successful confirmation
          clearCart();
          // Pass the order ID to success handler
          onSuccess(confirmedOrderId);
        } catch (error) {
          console.error('Order confirmation failed:', error);
          // Still proceed since payment was successful
          clearCart();
          onSuccess(orderId); // Use original order ID as fallback
        }
      }
    } catch (error: any) {
      onError(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  }, [stripe, elements, clientSecret, deliveryDetails, orderId, confirmOrder]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Delivery Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={deliveryDetails.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={errors.name ? 'border-red-500 focus:border-red-500' : ''}
            />
            <ErrorMessage message={errors.name} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={deliveryDetails.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              disabled
              className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
            />
            <ErrorMessage message={errors.email} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              type="text"
              required
              value={deliveryDetails.city}
              onChange={handleInputChange}
              placeholder="Update your city"
              className={errors.city ? 'border-red-500 focus:border-red-500' : ''}
            />
            <ErrorMessage message={errors.city} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              type="text"
              required
              value={deliveryDetails.address}
              onChange={handleInputChange}
              placeholder="Update your address"
              className={errors.address ? 'border-red-500 focus:border-red-500' : ''}
            />
            <ErrorMessage message={errors.address} />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              type="text"
              required
              value={deliveryDetails.country}
              onChange={handleInputChange}
              placeholder="Update your country"
              className={errors.country ? 'border-red-500 focus:border-red-500' : ''}
            />
            <ErrorMessage message={errors.country} />
          </div>
        </div>
      </div>

      <Separator />

      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Method</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose from credit/debit cards, UPI, Google Pay, and more payment options
        </p>
        
        {/* Payment method UI is now handled by the respective form components */}
        
        <p className="text-sm text-gray-500 mt-2">
          🔒 Your payment information is secure and encrypted
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!clientSecret || loading}
        className="w-full bg-orange hover:bg-hoverOrange text-white py-3 text-lg font-semibold"
      >
        {loading ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {clientSecret?.startsWith('mock_') ? 'Processing Mock Payment...' : 'Processing Payment...'}
          </div>
        ) : (
          clientSecret?.startsWith('mock_') ? 
            `Mock Pay ₹${totalAmount} (Dev Mode)` : 
            `Pay ₹${totalAmount}`
        )}
      </Button>

      <div className="text-center text-sm text-gray-500">
        <p>🔒 Your payment is secured by 256-bit SSL encryption</p>
      </div>
    </form>
  );
});

interface EnhancedCheckoutProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const EnhancedCheckout: React.FC<EnhancedCheckoutProps> = React.memo(({ open, setOpen }) => {
  const { cart } = useCartStore();
  const { user } = useUserStore();
  const { restaurant: storeRestaurant } = useRestaurantStore();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Get restaurant info from cart items if not available in store
  const restaurant = useMemo(() => {
    // Always prioritize cart items for restaurant info since they contain the actual order context
    const firstCartItem = cart[0];
    if (firstCartItem?.restaurantId && firstCartItem?.restaurantName) {
      return {
        _id: firstCartItem.restaurantId,
        restaurantName: firstCartItem.restaurantName,
        // Add other required fields with defaults
        city: '',
        country: '',
        deliveryTime: 0,
        cuisines: [],
        menus: [],
        imageUrl: '',
        user: ''
      };
    }
    
    // Fallback to store restaurant if cart doesn't have restaurant info
    if (storeRestaurant) {
      return storeRestaurant;
    }
    
    return null;
  }, [cart, storeRestaurant]);
  
  // Remove debug logs for production
  
  // Use optimized payment hook
  const { 
    loading: isInitializing, 
    clientSecret, 
    orderId, 
    error: paymentError, 
    totalAmount,
    createPaymentIntent,
    resetPayment 
  } = usePayment({
    onError: (error) => {
      toast.error(error);
    }
  });

  // Create payment intent when dialog opens
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (open) {
      // Ensure we have all required data before creating payment intent
      if (!cart?.length) {
        return;
      }
      
      if (!user) {
        return;
      }
      
      if (!restaurant) {
        return;
      }
      
      // Add small delay to prevent too eager API calls
      timeoutId = setTimeout(() => {
        createPaymentIntent();
      }, 150); // Slightly increased delay for better UX
    } else {
      // Reset state when dialog closes
      resetPayment();
      setPaymentSuccess(false);
    }
    
    return () => clearTimeout(timeoutId);
  }, [open, cart, user, restaurant, createPaymentIntent, resetPayment]);

  // Optimize callbacks with useCallback
  const handlePaymentSuccess = useCallback((orderId?: string) => {
    setPaymentSuccess(true);
    toast.success('Payment successful! Redirecting to order status...');
    
    // Store order ID for tracking
    if (orderId) {
      localStorage.setItem('currentOrderId', orderId);
    }
    
    // Redirect to order status page after 2 seconds
    setTimeout(() => {
      setOpen(false);
      window.location.href = `/order/status${orderId ? `?orderId=${orderId}` : ''}`;
    }, 2000);
  }, [setOpen]);

  const handlePaymentError = useCallback((error: string) => {
    setPaymentError(error);
    toast.error(error);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {paymentSuccess ? (
          // Payment Success Screen
          <div className="p-8 text-center">
            <div className="text-6xl text-green-500 mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your order has been placed successfully. You will be redirected to the order status page.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Header with close button */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h2>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 p-4 sm:p-6">
              {/* Left Side - Order Summary */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h3>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4 max-h-80 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">Total Amount:</span>
                    <span className="text-orange text-xl">₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Payment Form */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
                
                {!cart?.length ? (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      Cart is Empty
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                      Please add items to your cart before proceeding to payment.
                    </p>
                    <Button onClick={() => setOpen(false)} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      Close
                    </Button>
                  </div>
                ) : !user ? (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      Please Login
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300 mb-4">
                      You need to be logged in to proceed with payment.
                    </p>
                    <Button onClick={() => setOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Close
                    </Button>
                  </div>
                ) : !restaurant ? (
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
                      Restaurant Information Missing
                    </h3>
                    <p className="text-purple-700 dark:text-purple-300 mb-4">
                      Unable to load restaurant information. Please refresh and try again.
                    </p>
                    <Button onClick={() => setOpen(false)} className="bg-purple-600 hover:bg-purple-700 text-white">
                      Close
                    </Button>
                  </div>
                ) : clientSecret ? (
                  clientSecret.startsWith('mock_') ? (
                    <MockCheckoutForm 
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      clientSecret={clientSecret}
                      orderId={orderId}
                      totalAmount={totalAmount}
                    />
                  ) : (
                    <Suspense fallback={<PaymentSkeleton />}>
                      <Elements 
                        stripe={getStripe()} 
                        options={{
                          clientSecret,
                          appearance: stripeAppearance,
                          loader: 'auto'
                        }}
                      >
                        <CheckoutForm 
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                          clientSecret={clientSecret}
                          orderId={orderId}
                          totalAmount={totalAmount}
                        />
                      </Elements>
                    </Suspense>
                  )
                ) : paymentError ? (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
                    <div className="text-red-600 dark:text-red-400 mb-4">
                      <XCircle className="h-12 w-12 mx-auto mb-3" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                      Payment Initialization Failed
                    </h3>
                    <p className="text-red-700 dark:text-red-300 mb-4">{paymentError}</p>
                    <Button 
                      onClick={() => {
                        resetPayment();
                        createPaymentIntent();
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {isInitializing ? 'Preparing payment...' : 'Loading payment options...'}
                    </span>
                  </div>
                )}

                {paymentError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                    <p className="text-red-700 dark:text-red-400">{paymentError}</p>
                  </div>
                )}
            </div>
          </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
});

export default EnhancedCheckout;
