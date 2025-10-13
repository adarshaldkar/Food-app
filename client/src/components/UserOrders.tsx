import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Loader2, CheckCircle, Clock, XCircle, Truck, ChefHat, Eye, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { config } from '@/config/env';
import { toast } from 'sonner';

// Ensure axios has credentials enabled
axios.defaults.withCredentials = true;

interface OrderItem {
  menuId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
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
  deliveryDetails: {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
  };
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
    description: 'Order is being processed'
  },
  confirmed: {
    label: 'CONFIRMED',
    color: 'bg-blue-500',
    icon: CheckCircle,
    description: 'Order has been confirmed'
  },
  preparing: {
    label: 'PREPARING',
    color: 'bg-orange-500',
    icon: ChefHat,
    description: 'Order is being prepared'
  },
  outfordelivery: {
    label: 'OUT FOR DELIVERY',
    color: 'bg-purple-500',
    icon: Truck,
    description: 'Order is on the way'
  },
  delivered: {
    label: 'DELIVERED',
    color: 'bg-green-500',
    icon: CheckCircle,
    description: 'Order has been delivered'
  },
  cancelled: {
    label: 'CANCELLED',
    color: 'bg-red-500',
    icon: XCircle,
    description: 'Order has been cancelled'
  }
};

const UserOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_BASE_URL}/orders/`);
      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (error: any) {
      setError('Failed to fetch orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/order/status?orderId=${orderId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-orange" />
            <p className="text-gray-600 dark:text-gray-400">Loading your orders...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Failed to Load Orders</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center">{error}</p>
            <Button onClick={fetchOrders} className="bg-orange hover:bg-hoverOrange">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-orange" />
              Your Orders
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage your food orders
            </p>
          </CardHeader>

          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No Orders Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  You haven't placed any orders yet. Start exploring restaurants and order your favorite food!
                </p>
                <Button onClick={() => navigate('/')} className="bg-orange hover:bg-hoverOrange">
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const statusInfo = statusConfig[order.status];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <Card key={order._id} className="border border-gray-200 dark:border-gray-700">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Order #{order._id.slice(-8).toUpperCase()}
                              </h3>
                              <Badge className={`${statusInfo.color} text-white px-3 py-1 text-xs font-medium`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>

                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {order.restaurant.restaurantName}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {order.restaurant.address}, {order.restaurant.city}
                              </p>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Items:</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {order.cartItems.length} item{order.cartItems.length > 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount:</span>
                                <span className="text-lg font-bold text-orange">₹{order.totalAmount}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Order Date:</span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {formatDate(order.createdAt)}
                                </span>
                              </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Items ordered:</div>
                              <div className="flex flex-wrap gap-2">
                                {order.cartItems.slice(0, 3).map((item, idx) => (
                                  <span key={idx} className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                                    {item.name} ×{item.quantity}
                                  </span>
                                ))}
                                {order.cartItems.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                                    +{order.cartItems.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2 md:ml-4">
                            <Button
                              onClick={() => handleViewOrder(order._id)}
                              className="bg-orange hover:bg-hoverOrange text-white px-4 py-2 text-sm"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserOrders;