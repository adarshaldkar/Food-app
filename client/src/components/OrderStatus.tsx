import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Loader2, CheckCircle, Clock, XCircle, Truck, ChefHat, AlertTriangle } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

// Utility function to clean up delivery details display
const cleanDeliveryDetail = (value: string, fieldName: string): string => {
  if (!value || value.trim() === '') {
    return `[${fieldName} not provided]`;
  }
  
  // Check for common placeholder patterns
  const placeholderPatterns = [
    /^update your (address|city|country)$/i,
    /^enter your (address|city|country)$/i,
    /^(address|city|country)$/i,
    /^unknown$/i
  ];
  
  const isPlaceholder = placeholderPatterns.some(pattern => pattern.test(value.trim()));
  
  if (isPlaceholder) {
    return `[${fieldName} not provided]`;
  }
  
  return value;
};

// Check if delivery details are incomplete
const hasIncompleteDeliveryDetails = (details: DeliveryDetails): boolean => {
  const fields = {
    address: details.address,
    city: details.city,
    country: details.country
  };
  
  return Object.entries(fields).some(([fieldName, value]) => {
    const cleaned = cleanDeliveryDetail(value, fieldName);
    return cleaned.startsWith('[') && cleaned.endsWith(']');
  });
};

interface OrderItem {
  menuId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface DeliveryDetails {
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
}

interface Order {
  _id: string;
  user: string;
  restaurant: {
    _id: string;
    restaurantName: string;
    city: string;
    address: string;
  };
  deliveryDetails: DeliveryDetails;
  cartItems: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'outfordelivery' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  pending: {
    label: 'PENDING',
    color: 'bg-yellow-500',
    icon: Clock,
    description: 'Your order is being processed'
  },
  confirmed: {
    label: 'CONFIRMED',
    color: 'bg-blue-500',
    icon: CheckCircle,
    description: 'Your order has been confirmed'
  },
  preparing: {
    label: 'PREPARING',
    color: 'bg-orange-500',
    icon: ChefHat,
    description: 'Your order is being prepared'
  },
  outfordelivery: {
    label: 'OUT FOR DELIVERY',
    color: 'bg-purple-500',
    icon: Truck,
    description: 'Your order is on the way'
  },
  delivered: {
    label: 'DELIVERED',
    color: 'bg-green-500',
    icon: CheckCircle,
    description: 'Your order has been delivered'
  },
  cancelled: {
    label: 'CANCELLED',
    color: 'bg-red-500',
    icon: XCircle,
    description: 'Your order has been cancelled'
  }
};

const OrderStatus: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const orderId = searchParams.get('orderId') || localStorage.getItem('currentOrderId');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/orders/${orderId}`);
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError('Order not found');
        }
      } catch (error: any) {
        console.error('Error fetching order:', error);
        setError('Failed to fetch order details');
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Poll for status updates every 30 seconds
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  const handleContinueShopping = () => {
    // Clear the stored order ID
    localStorage.removeItem('currentOrderId');
    navigate('/');
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      setCancelling(true);
      const response = await api.put(`/orders/${order._id}/cancel`);
      
      if (response.data.success) {
        // Update the order status locally
        setOrder(prev => prev ? {
          ...prev,
          status: 'cancelled',
          updatedAt: response.data.order.updatedAt
        } : null);
        toast.success('Order cancelled successfully');
        
        // Clear stored order ID and navigate to home page after a short delay
        localStorage.removeItem('currentOrderId');
        setTimeout(() => {
          navigate('/');
        }, 1500); // 1.5 second delay to show the success message
      } else {
        toast.error('Failed to cancel order');
      }
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      const errorMessage = error.response?.data?.message || 'Failed to cancel order';
      toast.error(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-orange" />
            <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center">{error}</p>
            <Button onClick={() => navigate('/')} className="bg-orange hover:bg-hoverOrange">
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <StatusIcon className={`h-8 w-8 text-white p-1 rounded-full ${statusInfo.color}`} />
              <CardTitle className="text-2xl">
                Order Status: <span className={`text-white px-3 py-1 rounded-full text-sm ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </CardTitle>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{statusInfo.description}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Restaurant Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                {order.restaurant.restaurantName}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {order.restaurant.address}, {order.restaurant.city}
              </p>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-1">
                Order ID: {order._id.slice(-8).toUpperCase()}
              </p>
            </div>

            <Separator />

            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
              <div className="space-y-3">
                {order.cartItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
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

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount:</span>
                  <span className="text-xl font-bold text-orange">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Delivery Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delivery Details</h3>
              
              {/* Warning for incomplete delivery details */}
              {hasIncompleteDeliveryDetails(order.deliveryDetails) && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4 flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                      Incomplete Delivery Information
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Some delivery details are missing or incomplete. Please contact the restaurant if delivery issues occur.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                <p className="text-gray-900 dark:text-white font-medium">
                  {order.deliveryDetails.name || '[Name not provided]'}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.deliveryDetails.email || '[Email not provided]'}
                </p>
                <div className="text-gray-600 dark:text-gray-400">
                  <p>{cleanDeliveryDetail(order.deliveryDetails.address, 'Address')}</p>
                  <p>{cleanDeliveryDetail(order.deliveryDetails.city, 'City')}, {cleanDeliveryDetail(order.deliveryDetails.country, 'Country')}</p>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Timeline</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order Placed:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(order.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-3">
              {/* Cancel Button - Show only for pending and confirmed orders */}
              {(order.status === 'pending' || order.status === 'confirmed') && (
                <Button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold disabled:opacity-50"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-5 w-5" />
                      Cancel Order
                    </>
                  )}
                </Button>
              )}
              
              {/* Continue Shopping Button */}
              <Button
                onClick={handleContinueShopping}
                className="w-full bg-orange hover:bg-hoverOrange text-white py-3 text-lg font-semibold"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderStatus;
