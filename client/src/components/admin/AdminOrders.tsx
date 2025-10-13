import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Loader2, Eye, Clock, CheckCircle, XCircle, Truck, ChefHat } from 'lucide-react';
import axios from 'axios';
import { config } from '@/config/env';

// Ensure axios has credentials enabled
axios.defaults.withCredentials = true;
import { toast } from 'sonner';

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
    contact: string;
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
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: Clock,
  },
  confirmed: {
    label: 'CONFIRMED',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: CheckCircle,
  },
  preparing: {
    label: 'PREPARING',
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: ChefHat,
  },
  outfordelivery: {
    label: 'OUT FOR DELIVERY',
    color: 'bg-purple-500',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: Truck,
  },
  delivered: {
    label: 'DELIVERED',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'CANCELLED',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: XCircle,
  }
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Get orders for the restaurant owned by the authenticated admin user
      const response = await axios.get(`${config.API_BASE_URL}/restaurant/order`);
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    try {
      const response = await axios.put(`${config.API_BASE_URL}/restaurant/order/${orderId}/status`, { status: newStatus });
      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus as Order['status'], updatedAt: new Date().toISOString() }
            : order
        ));
        toast.success('Order status updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrder(null);
    }
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
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-orange" />
          <span className="text-gray-600 dark:text-gray-400">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Orders Overview
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track all restaurant orders
            </p>
          </CardHeader>
          
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">No orders found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Orders Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Restaurant</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => {
                        const statusInfo = statusConfig[order.status];
                        const StatusIcon = statusInfo.icon;
                        
                        return (
                          <TableRow key={order._id}>
                            <TableCell className="font-mono text-sm">
                              {order._id.slice(-8).toUpperCase()}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{order.restaurant?.restaurantName || 'N/A'}</p>
                                <p className="text-sm text-gray-500">{order.restaurant?.city}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{order.deliveryDetails.name}</p>
                                <p className="text-sm text-gray-500">{order.deliveryDetails.contact}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {order.cartItems.slice(0, 2).map((item, idx) => (
                                  <div key={idx} className="flex items-center space-x-2 mb-1">
                                    <span>{item.name}</span>
                                    <span className="text-gray-500">×{item.quantity}</span>
                                  </div>
                                ))}
                                {order.cartItems.length > 2 && (
                                  <p className="text-gray-500">+{order.cartItems.length - 2} more</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">
                              ₹{order.totalAmount}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${statusInfo.bgColor} ${statusInfo.textColor} hover:${statusInfo.bgColor}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Select
                                  value={order.status}
                                  onValueChange={(value) => updateOrderStatus(order._id, value)}
                                  disabled={updatingOrder === order._id}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="preparing">Preparing</SelectItem>
                                    <SelectItem value="outfordelivery">Out for Delivery</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                                {updatingOrder === order._id && (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrders;
