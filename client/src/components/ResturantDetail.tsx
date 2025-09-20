import { useRestaurantStore } from "@/store/useRestaurantStore";
import AvailableMenu from "./AvailableMenu";
import { Badge } from "./ui/badge";
import { Timer } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { RestaurantSkeleton } from "./skeletons";

const RestaurantDetail = () => {
  const params = useParams();
  const { singleRestaurant, getSingleRestaurant, loading } = useRestaurantStore();

  console.log('=== RESTAURANT DETAIL DEBUG ===');
  console.log('Restaurant ID from URL:', params.id);
  console.log('Single restaurant loaded:', singleRestaurant ? singleRestaurant.restaurantName : 'null');
  console.log('Loading state:', loading);

  useEffect(() => {
    console.log('RestaurantDetail useEffect triggered with ID:', params.id);
    if (params.id) {
      console.log('Calling getSingleRestaurant for ID:', params.id);
      
      // Test API connectivity first
      console.log('Testing restaurant API connectivity...');
      fetch(`http://localhost:5001/api/v1/restaurant/${params.id}`)
        .then(response => {
          console.log('Restaurant API response status:', response.status);
          return response.json();
        })
        .then(data => {
          console.log('Restaurant API response data:', data);
        })
        .catch(error => {
          console.error('Restaurant API connectivity test failed:', error);
        });
      
      getSingleRestaurant(params.id);
    } else {
      console.log('No restaurant ID found in URL params');
    }
  }, [params.id]);

  if (loading) {
    return <RestaurantSkeleton />;
  }

  if (!singleRestaurant) {
    return (
      <div className="max-w-6xl mx-auto my-10 text-center">
        <h1 className="text-2xl font-semibold text-gray-700">Restaurant not found</h1>
        <p className="text-gray-500 mt-2">The restaurant you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="w-full">
        <div className="relative w-full h-32 md:h-64 lg:h-72">
          <img
            src={singleRestaurant?.imageUrl || "Loading..."}
            alt="res_image"
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="my-5">
            <h1 className="font-medium text-xl">{singleRestaurant?.restaurantName || "Loading..."}</h1>
            <div className="flex gap-2 my-2">
              {singleRestaurant?.cuisines.map((cuisine: string, idx: number) => (
                <Badge key={idx}>{cuisine}</Badge>
              ))}
            </div>
            <div className="flex md:flex-row flex-col gap-2 my-5">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                <h1 className="flex items-center gap-2 font-medium">
                  Delivery Time: <span className="text-[#D19254]">{singleRestaurant?.deliveryTime || "NA"} mins</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
       {singleRestaurant?.menus && <AvailableMenu menus = {singleRestaurant?.menus!}/>} 
      </div>
    </div>
  );
};

export default RestaurantDetail;