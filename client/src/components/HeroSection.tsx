import { useState } from "react";
// import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import HereImage from "@/assets/Hero-img.jpg";
import { useNavigate } from "react-router-dom";

const HereSection = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [searchError, setSearchError] = useState<string>("");
  const navigate = useNavigate();
  
  const handleSearch = () => {
    const trimmedSearch = searchText.trim();
    if (trimmedSearch) {
      setSearchError(""); // Clear any previous error
      // Navigate with the actual search term
      navigate(`/search/${encodeURIComponent(trimmedSearch)}`);
    } else {
      // Show error message when search is empty
      setSearchError("City or country name is required");
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    // Clear error when user starts typing
    if (searchError) {
      setSearchError("");
    }
  };
  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:p-10 rounded-lg items-center justify-center m-4 gap-20 min-h-[70vh]">
      <div className="flex flex-col gap-10 md:w-[40%]">
        <div className="flex flex-col gap-5">
          <h1 className="font-bold md:font-extrabold md:text-5xl text-4xl">
            Order Food anytime & anywhere
          </h1>
          <p className="text-gray-500">
            Hey! Our Delicios food is waiting for you, we are always near to
            you.
          </p>
        </div>
        <div className="relative flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={searchText}
              placeholder="Discover restaurants from different locations"
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={`pl-10 shadow-lg ${searchError ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            <Search className="text-gray-500 absolute inset-y-2 left-2" />
            <Button onClick={handleSearch} className="bg-orange hover:bg-hoverOrange">Search</Button>
          </div>
          {searchError && (
            <p className="text-red-500 text-sm mt-1">{searchError}</p>
          )}
        </div>
      </div>
      <div>
        <img 
        src={HereImage} 
        alt="" 
        className="object-cover w-full max-h-[500px]"
        />
      </div>
    </div>
  );
};

export default HereSection;