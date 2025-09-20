import { Link, useParams } from "react-router-dom";
import FilterPage from "./FilterPage";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Globe, MapPin, X, Search } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { RestaurantCardSkeleton } from "./skeletons";
import { Restaurant } from "@/types/restaurantType";

const SearchPage = () => {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const {
    loading,
    searchedRestaurant,
    searchRestaurant,
    setAppliedFilter,
    appliedFilter,
    resetAppliedFilter,
  } = useRestaurantStore();

  // Safely get the data array
  const restaurantData: Restaurant[] = searchedRestaurant?.data || [];

  // Initial search on component mount
  useEffect(() => {
    const searchTerm = params.text || "";
    console.log("Initial search with:", { searchTerm, appliedFilter }); // Debug log
    searchRestaurant(searchTerm, "", appliedFilter);
    // eslint-disable-next-line
  }, [params.text]);

  // Search when filters change - THIS IS IMPORTANT
  useEffect(() => {
    const searchTerm = params.text || "";
    console.log(
      "Filter changed, searching with:",
      { searchTerm, searchQuery, appliedFilter } // Debug log
    );
    searchRestaurant(searchTerm, searchQuery, appliedFilter);
    // eslint-disable-next-line
  }, [appliedFilter]); // This will trigger when filters change

  // Handle search button click
  const handleSearch = () => {
    const searchTerm = params.text || "";
    searchRestaurant(searchTerm, searchQuery, appliedFilter);
  };

  // Handle enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Remove filter
  const removeFilter = (filterToRemove: string) => {
    setAppliedFilter(filterToRemove);
  };

  // Clear all filters
  const clearAllFilters = () => {
    resetAppliedFilter();
  };

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <div className="flex flex-col lg:flex-row justify-between gap-10">
        {/* Filter Sidebar */}
        <div className="lg:w-1/4">
          <FilterPage />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:w-3/4">
          {/* Search Input Section */}
          <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Search Restaurants
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  type="text"
                  value={searchQuery}
                  placeholder="Search by restaurant name, cuisine, or location..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-orange hover:bg-hoverOrange px-6"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {/* Results Header and Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ({restaurantData.length}) Restaurant
                {restaurantData.length !== 1 ? "s" : ""} Found
                {params.text && params.text !== "all" && (
                  <span className="text-orange ml-2">for "{params.text}"</span>
                )}
              </h1>

              {appliedFilter.length > 0 && (
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Clear All Filters
                </Button>
              )}
            </div>

            {/* Applied Filters */}
            {appliedFilter.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                  Active Filters:
                </span>
                {appliedFilter.map((selectedFilter: string, idx: number) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="flex items-center gap-1 bg-orange/10 text-orange border-orange/20 hover:bg-orange/20"
                  >
                    {selectedFilter}
                    <X
                      onClick={() => removeFilter(selectedFilter)}
                      size={14}
                      className="cursor-pointer hover:text-red-600"
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Restaurant Cards Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-[float_2s_ease-in-out_infinite]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <RestaurantCardSkeleton />
                </div>
              ))
            ) : restaurantData.length === 0 ? (
              <NoResultFound
                searchText={params.text || ""}
                appliedFilters={appliedFilter}
              />
            ) : (
              restaurantData.map((restaurant: Restaurant) => (
                <Card
                  key={restaurant._id}
                  className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className="relative">
                    <AspectRatio ratio={16 / 10}>
                      <img
                        src={restaurant.imageUrl || "/placeholder-restaurant.jpg"}
                        alt={restaurant.restaurantName}
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                    <div className="absolute top-3 left-3 bg-white dark:bg-gray-800 bg-opacity-90 rounded-full px-3 py-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Featured
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {restaurant.restaurantName}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-2">
                      <MapPin size={16} />
                      <span className="text-sm">
                        {restaurant.city}, {restaurant.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-3">
                      <Globe size={16} />
                      <span className="text-sm">
                        Delivery: {restaurant.deliveryTime} mins
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(restaurant.cuisines || [])
                        .slice(0, 3)
                        .map((cuisine: string, idx: number) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            {cuisine}
                          </Badge>
                        ))}
                      {restaurant.cuisines && restaurant.cuisines.length > 3 && (
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          +{restaurant.cuisines.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 bg-gray-50 dark:bg-gray-900 flex justify-end">
                    <Link to={`/restaurant/${restaurant._id}`}>
                      <Button className="bg-orange hover:bg-hoverOrange text-white px-6">
                        View Menu
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

// Loading Skeleton Component
const SearchPageSkeleton = () => {
  return (
    <>
      {[...Array(6)].map((_, index) => (
        <Card
          key={index}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden"
        >
          <div className="relative">
            <AspectRatio ratio={16 / 10}>
              <Skeleton className="w-full h-full" />
            </AspectRatio>
          </div>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </CardContent>
          <CardFooter className="p-4 bg-gray-50 dark:bg-gray-900 flex justify-end">
            <Skeleton className="h-10 w-24 rounded" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

// No Results Component
const NoResultFound = ({
  searchText,
  appliedFilters,
}: {
  searchText: string;
  appliedFilters: string[];
}) => {
  return (
    <div className="col-span-full text-center py-12">
      <div className="text-6xl mb-4">🍽️</div>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
        No restaurants found
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {searchText && searchText !== "all"
          ? `We couldn't find any restaurants matching "${searchText}"`
          : "We couldn't find any restaurants matching your criteria"}{" "}
        {appliedFilters.length > 0 && (
          <span>
            {" "}
            with the selected filters: {appliedFilters.join(", ")}
          </span>
        )}
      </p>
      <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
        <p>Try:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Removing some filters</li>
          <li>Searching with different keywords</li>
          <li>Checking your spelling</li>
        </ul>
      </div>
      <Link to="/">
        <Button className="mt-6 bg-orange hover:bg-hoverOrange text-white">
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

