import { Minus, Plus, Trash2, ShoppingBag, IndianRupee } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EnhancedCheckout from "./EnhancedCheckout";
import { useCartStore } from "@/store/useCartStore";
import { useUserStore } from "@/store/useUserStore";
import { CartItem } from "@/types/cartType";
import { CartSkeleton } from "./skeletons";

const Cart = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { cart, decrementQuantity, incrementQuantity, removeFromTheCart, clearCart, debugCart } = useCartStore();
  
  // Ensure cart is hydrated from localStorage
  useEffect(() => {
    setIsHydrated(true);
    // Debug cart after hydration
    setTimeout(() => {
      debugCart();
    }, 100);
  }, [debugCart]);
  
  // Debug cart state on component load
  console.log('=== CART COMPONENT DEBUG ===');
  console.log('Is hydrated:', isHydrated);
  console.log('Cart items count:', cart?.length || 0);
  console.log('Full cart data:', cart);
  
  if (cart?.length > 0) {
    cart.forEach((item, index) => {
      console.log(`Cart item ${index}:`, {
        name: item.name,
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName,
        hasRestaurantInfo: !!(item.restaurantId && item.restaurantName)
      });
    });
  }

  let totalAmount = cart.reduce((acc, ele) => {
    return acc + ele.price * ele.quantity;
  }, 0);

  // Show loading state before hydration
  if (!isHydrated) {
    return <CartSkeleton />;
  }

  // Show empty cart state when cart is actually empty
  if (cart.length === 0) {
    return (
      <div className="flex flex-col max-w-7xl mx-auto my-10">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add some delicious items to get started!
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-orange hover:bg-hoverOrange"
          >
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Shopping Cart
        </h1>
        <Button onClick={clearCart} variant="outline" className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Clear All
        </Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Items</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Title</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Price</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Quantity</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Total</TableHead>
              <TableHead className="text-right text-gray-700 dark:text-gray-200 font-semibold">Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.map((item: CartItem) => (
              <TableRow key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <TableCell>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={item.image} alt={item.name} />
                    <AvatarFallback className="bg-orange text-white font-semibold">
                      {item.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium text-gray-900 dark:text-gray-100">{item.name}</TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">₹{item.price}</TableCell>
                <TableCell>
                  <div className="flex items-center rounded-full border border-gray-200 dark:border-gray-600 shadow-sm w-fit">
                    <Button
                      onClick={() => decrementQuantity(item._id)}
                      size={"icon"}
                      variant={"outline"}
                      className="rounded-full bg-gray-100 dark:bg-gray-700 border-0 h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-3 py-1 font-semibold text-gray-900 dark:text-gray-100 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <Button
                      onClick={() => incrementQuantity(item._id)}
                      size={"icon"}
                      className="rounded-full bg-orange hover:bg-hoverOrange border-0 h-8 w-8"
                      variant={"outline"}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">₹{item.price * item.quantity}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    onClick={() => removeFromTheCart(item._id)}
                    size={"sm"} 
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-gray-50 dark:bg-gray-700">
              <TableCell colSpan={5} className="text-xl font-bold text-gray-900 dark:text-white">Total</TableCell>
              <TableCell className="text-right text-xl font-bold text-gray-900 dark:text-white">₹{totalAmount}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {cart.map((item: CartItem) => (
          <div key={item._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex gap-4">
              {/* Item Image */}
              <div className="flex-shrink-0">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  <AvatarImage src={item.image} alt={item.name} />
                  <AvatarFallback className="bg-orange text-white font-semibold text-lg">
                    {item.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="h-4 w-4 text-gray-500" />
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">{item.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">per item</span>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-gray-200 dark:border-gray-600 shadow-sm">
                    <Button
                      onClick={() => decrementQuantity(item._id)}
                      size={"icon"}
                      variant={"outline"}
                      className="rounded-full bg-gray-100 dark:bg-gray-700 border-0 h-9 w-9 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 font-semibold text-gray-900 dark:text-gray-100 min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <Button
                      onClick={() => incrementQuantity(item._id)}
                      size={"icon"}
                      className="rounded-full bg-orange hover:bg-hoverOrange border-0 h-9 w-9"
                      variant={"outline"}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Subtotal */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Remove Button */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                onClick={() => removeFromTheCart(item._id)}
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Remove from Cart
              </Button>
            </div>
          </div>
        ))}
        
        {/* Mobile Total */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-gray-500" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="mt-6">
        <Button
          onClick={() => {
            console.log('=== CHECKOUT BUTTON CLICKED ===');
            console.log('Cart state when opening checkout:', cart);
            console.log('Opening checkout dialog...');
            setOpen(true);
          }}
          className="w-full bg-orange hover:bg-hoverOrange text-white font-semibold py-3 text-lg flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-5 w-5" />
          Proceed To Checkout (₹{totalAmount})
        </Button>
      </div>
      <EnhancedCheckout open={open} setOpen={setOpen} />
    </div>
  );
};

export default Cart;