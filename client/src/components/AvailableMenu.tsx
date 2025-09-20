import { MenuItem } from "@/types/restaurantType"
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useCartStore } from "@/store/useCartStore";
import { useUserStore } from "@/store/useUserStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useNavigate } from "react-router-dom";

const AvailableMenu = ({ menus }: { menus: MenuItem[] }) => {
  const { addToCart } = useCartStore();
  const { user } = useUserStore();
  const { singleRestaurant } = useRestaurantStore();
  const navigate = useNavigate();
  return (
    <div className="md:p-4">
      <h1 className="text-xl md:text-2xl font-extrabold mb-6">
        Available Menus
      </h1>
      <div className="grid md:grid-cols-3 space-y-4 md:space-y-0">
        {menus.map((menu: MenuItem) => (
          <Card className="max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden">
            <img src={menu.image} alt="" className="w-full h-40 object-cover" />
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {menu.name}
                </h2>
              <p className="text-sm text-gray-600 mt-2">{menu.description}</p>
              <h3 className="text-lg font-semibold mt-4">
                Price: <span className="text-[#D19254]">₹{menu.price}</span>
              </h3>
            </CardContent>
            <CardFooter className="p-4">
              {!user?.admin && (
                <Button
                  onClick={() => {
                    console.log('=== ADD TO CART DEBUG ===');
                    console.log('Menu item:', menu.name);
                    console.log('Single restaurant data:', singleRestaurant);
                    console.log('Restaurant ID:', singleRestaurant?._id);
                    console.log('Restaurant name:', singleRestaurant?.restaurantName);
                    
                    if (!singleRestaurant) {
                      console.error('CRITICAL: singleRestaurant is null/undefined');
                      // Try to get restaurant ID from URL
                      const urlParts = window.location.pathname.split('/');
                      const restaurantIdFromUrl = urlParts[urlParts.length - 1];
                      console.log('Trying to use restaurant ID from URL:', restaurantIdFromUrl);
                      
                      if (restaurantIdFromUrl && restaurantIdFromUrl !== 'restaurant') {
                        addToCart(menu, restaurantIdFromUrl, 'Unknown Restaurant');
                        console.log('Added to cart with URL restaurant ID');
                      } else {
                        console.error('Cannot determine restaurant ID, not adding to cart');
                        return;
                      }
                    } else if (!singleRestaurant._id || !singleRestaurant.restaurantName) {
                      console.error('CRITICAL: singleRestaurant exists but missing ID or name:', singleRestaurant);
                      return;
                    } else {
                      console.log('Adding to cart with complete restaurant info');
                      addToCart(menu, singleRestaurant._id, singleRestaurant.restaurantName);
                    }
                    
                    navigate("/cart");
                  }}
                  className="w-full bg-orange hover:bg-hoverOrange"
                >
                  Add to Cart
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableMenu;