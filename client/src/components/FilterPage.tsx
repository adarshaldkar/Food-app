import { useState } from "react";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Check, Filter, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";

const FilterPage = () => {
  const { setAppliedFilter, appliedFilter } = useRestaurantStore();
  
  const cuisineOptions = [
    "Burger",
    "Thali", 
    "Biryani",
    "Momos",
    "Pizza",
    "Chinese",
    "Italian",
    "Indian"
  ];

  const handleFilterChange = (cuisine: string) => {
    console.log('Filter clicked:', cuisine); // Debug log
    console.log('Current filters:', appliedFilter); // Debug log
    setAppliedFilter(cuisine);
  };

  const clearAllFilters = () => {
    setAppliedFilter('');
  };

  console.log('FilterPage rendered with filters:', appliedFilter); // Debug log

  return (
    <div className="mb-8 mt-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-3 h-12"
          >
          <Filter className="h-4 w-4" />
          <span className="font-medium">
            Filter
            {appliedFilter.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-xs font-semibold">
                {appliedFilter.length}
              </span>
            )}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg rounded-md p-1"
        align="start"
      >
        <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          Filter by Cuisine
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600 my-1" />
        
        {cuisineOptions.map((cuisine) => {
          const isSelected = appliedFilter.includes(cuisine);
          return (
            <DropdownMenuItem
              key={cuisine}
              onClick={() => handleFilterChange(cuisine)}
              className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                {cuisine}
              </span>
              {isSelected && (
                <Check className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              )}
            </DropdownMenuItem>
          );
        })}
        
        {appliedFilter.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600 my-1" />
            <DropdownMenuItem
              onClick={clearAllFilters}
              className="flex items-center justify-center px-3 py-2 text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 rounded-sm transition-colors text-red-600 dark:text-red-400 font-medium"
            >
              Clear All Filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
};

export default FilterPage;
