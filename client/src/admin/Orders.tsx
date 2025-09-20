import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectGroup, SelectValue, SelectContent, SelectTrigger } from "@/components/ui/select";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

interface Order {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    contact: string;
  };
  restaurant: {
    _id: string;
    restaurantName: string;
  };
  deliveryDetails: {
    email: string;
    name: string;
    address: string;
    city: string;
  };
  cartItems: Array<{
    menuId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'outfordelivery' | 'delivered';
  createdAt: string;
  updatedAt: string;
}

const Orders = () => {
  const { restaurantOrder, getRestaurantOrders, updateRestaurantOrder, loading } = useRestaurantStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    getRestaurantOrders();
  }, []);

  useEffect(() => {
    if (restaurantOrder) {
      setOrders(restaurantOrder);
    }
  }, [restaurantOrder]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingOrders(prev => new Set([...prev, orderId]));
    
    try {
      await updateRestaurantOrder(orderId, newStatus);
      // Update local state
      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus as any } : order
      ));
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'outfordelivery': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'outfordelivery': return 'Out for Delivery';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-10">
          Orders Overview
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <span className="ml-4 text-gray-600 dark:text-gray-300">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-6 sm:mb-10">
        Orders Overview
      </h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No orders found
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            When customers place orders, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex flex-col xl:flex-row justify-between items-start gap-4 xl:gap-6">
                {/* Order Details */}
                <div className="flex-1">
                  {/* Mobile-friendly header */}
                  <div className="flex flex-col space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h2>
                      <Badge className={`${getStatusColor(order.status)} text-white px-3 py-1 text-sm font-medium whitespace-nowrap rounded-full`}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <div className="text-lg font-bold text-orange">
                      Total: ₹{order.totalAmount}
                    </div>
                  </div>
                  
                  {/* Customer Info - Mobile-friendly layout */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Customer Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Mail size={18} className="text-blue-500" />
                        <span className="text-sm">{order.deliveryDetails.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Phone size={18} className="text-green-500" />
                        <span className="text-sm">{order.user?.contact || 'Not provided'}</span>
                      </div>
                      <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                        <MapPin size={18} className="mt-0.5 text-red-500" />
                        <div className="text-sm">
                          <div className="font-medium text-gray-800 dark:text-gray-200">{order.deliveryDetails.name}</div>
                          <div>{order.deliveryDetails.address}</div>
                          <div>{order.deliveryDetails.city}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cart Items - Modern mobile layout */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Items Ordered ({order.cartItems?.length || 0})</h3>
                    <div className="space-y-3">
                      {order.cartItems?.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4 shadow-sm">
                          {item.image && (
                            <div className="flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100 dark:border-gray-700"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              ₹{item.price} × {item.quantity}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-orange">
                              ₹{item.price * item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Order Timestamp - Mobile-friendly */}
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Clock size={18} className="text-blue-500" />
                    <div className="text-sm">
                      <div className="font-medium">Ordered on</div>
                      <div>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>
                
                {/* Status Update - Full width on mobile */}
                <div className="w-full xl:w-80">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Update Order Status
                    </Label>
                    <Select 
                      value={order.status} 
                      onValueChange={(value) => handleStatusUpdate(order._id, value)}
                      disabled={updatingOrders.has(order._id)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {[
                            { value: "pending", label: "Pending" },
                            { value: "confirmed", label: "Confirmed" },
                            { value: "preparing", label: "Preparing" },
                            { value: "outfordelivery", label: "Out for Delivery" },
                            { value: "delivered", label: "Delivered" },
                          ].map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {updatingOrders.has(order._id) && (
                      <div className="mt-3 text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                        Updating status...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
