import { IndianRupee, Clock, CheckCircle, Truck, Package, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Separator } from "@radix-ui/react-separator";
import HeroImage from "@/assets/Hero-img.jpg";
import { useOrderStore } from "@/store/useOrderStore";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { OrderSkeleton } from "./skeletons";
import { Badge } from "./ui/badge";

const Success = () => {
  const { orders, loading, getOrderDetails } = useOrderStore();
  const { cart } = useCartStore();
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getOrderDetails();
    
    // Set up auto-refresh every 30 seconds to get latest order status
    const interval = setInterval(() => {
      getOrderDetails();
    }, 30000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);
  
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'preparing': return <ChefHat className="w-5 h-5 text-orange-500" />;
      case 'outfordelivery': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered': return <Package className="w-5 h-5 text-green-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'outfordelivery': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'outfordelivery': return 'Out for Delivery';
      case 'pending': return 'Order Placed';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Being Prepared';
      case 'delivered': return 'Delivered';
      default: return 'Processing';
    }
  };
  
  const getStatusDescription = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'Your order has been placed and is waiting for restaurant confirmation.';
      case 'confirmed': return 'Your order has been confirmed by the restaurant and will be prepared soon.';
      case 'preparing': return 'The chef is preparing your delicious meal right now.';
      case 'outfordelivery': return 'Your order is on its way to you!';
      case 'delivered': return 'Your order has been delivered. Enjoy your meal!';
      default: return 'Your order is being processed.';
    }
  };

  if (loading) {
    return <OrderSkeleton />;
  }

  // Show message if no orders and no cart items
  if (orders.length === 0 && cart.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
          Order not found!
        </h1>
      </div>
    );
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-2xl w-full">
        {orders.length > 0 && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              {getStatusIcon(orders[0]?.status || 'pending')}
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 ml-3">
                {getStatusText(orders[0]?.status || 'pending')}
              </h1>
            </div>
            <Badge className={`${getStatusColor(orders[0]?.status || 'pending')} text-white text-sm px-4 py-2`}>
              {orders[0]?.status?.toUpperCase() || 'PROCESSING'}
            </Badge>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm">
              {getStatusDescription(orders[0]?.status || 'pending')}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Last updated: {new Date().toLocaleTimeString()} • Auto-refreshing every 30 seconds
            </div>
          </div>
        )}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Order Summary
          </h2>
          {/* Display order items */}
          {orders.length > 0 ? (
            orders.map((order: any, orderIndex: number) => (
              <div key={order._id || orderIndex} className="mb-6 border rounded-lg p-4">
                <div className="mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Order ID: {order._id || `ORDER-${orderIndex + 1}`}
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Status: <span className="text-orange-500">{order.status || "CONFIRMED"}</span>
                  </p>
                </div>
                {order.cartItems?.map((item: any, itemIndex: number) => (
                  <div key={itemIndex} className="mb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img
                          src={item.image || HeroImage}
                          alt={item.name || "Item"}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div className="ml-3">
                          <h3 className="text-gray-800 dark:text-gray-200 font-medium text-sm">
                            {item.name || "Order Item"}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity || 1}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-800 dark:text-gray-200 flex items-center">
                          <IndianRupee size={14} />
                          <span className="text-sm font-medium">
                            {parseInt(item.price) * parseInt(item.quantity || 1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No items found</p>
                )}
                <Separator className="my-3" />
                <div className="flex justify-between items-center font-bold">
                  <span className="text-gray-800 dark:text-gray-200">Order Total:</span>
                  <div className="text-gray-800 dark:text-gray-200 flex items-center">
                    <IndianRupee size={16} />
                    <span>{order.totalAmount || 0}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Fallback to show cart items if no orders
            cart.map((item: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src={item.image || HeroImage}
                      alt={item.name || "Item"}
                      className="w-14 h-14 rounded-md object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="text-gray-800 dark:text-gray-200 font-medium">
                        {item.name || "Cart Item"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-800 dark:text-gray-200 flex items-center">
                      <IndianRupee size={16} />
                      <span className="text-lg font-medium">
                        {item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
                {index < cart.length - 1 && <Separator className="my-4" />}
              </div>
            ))
          )}
          
          {/* Grand Total */}
          {orders.length === 0 && cart.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center font-bold text-lg">
                <span className="text-gray-800 dark:text-gray-200">Total:</span>
                <div className="text-gray-800 dark:text-gray-200 flex items-center">
                  <IndianRupee size={18} />
                  <span>
                    {cart.reduce((total: number, item: any) => total + (item.price * item.quantity), 0)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      <Link to="/">
        <Button className="bg-orange hover:bg-hoverOrange w-full py-3 rounded-md shadow-lg">
          Continue Shopping
        </Button>
      </Link>
      </div>
    </div>
  );
};

export default Success;
