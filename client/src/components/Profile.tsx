import {
  Loader2,
  LocateIcon,
  Mail,
  MapPin,
  MapPinHouse,
  Plus,
} from "lucide-react";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";
import { ProfileSkeleton } from "./skeletons";

const Profile = () => {
  const { user, loading, updateProfile, isCheckingAuth } = useUserStore();
  const [profileData, setProfileData] = useState({
    fullName: "",
    address: "",
    city: "",
    country: "",
    profilePicture: "",
    email: "",
  });
  
  // Initialize profile data from user store
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "",
        profilePicture: user.profilePicture || "",
        email: user.email || "",
      });
      if (user.profilePicture && user.profilePicture !== "Update your profile picture") {
        setSelectedProfilePicture(user.profilePicture);
      }
    }
  }, [user]);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [selectedProfilePicture, setSelectedProfilePicture] =
    useState<string>("");
  const fileChangehandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setSelectedProfilePicture(result);
        setProfileData((prevData) => ({
          ...prevData,
          profilePicture: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };
  const updateProfileHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile(profileData);
  };

  // Show skeleton while checking auth or if no user data
  if (isCheckingAuth || !user) {
    return <ProfileSkeleton />;
  }

  return (
    <form onSubmit={updateProfileHandler} className="max-w-8xl mx-auto my-5 ">
      <div className="flex items-center justify-between max-w-8xl ">
        <div className="flex items-center gap-2 mt-24">
          <Avatar className="md:h-16 md:w-16 w-14 h-14 relative ">
            <AvatarImage src={selectedProfilePicture} />
            <AvatarFallback>{user?.fullName?.charAt(0)?.toUpperCase() || "CN"}</AvatarFallback>
            <input
              ref={imageRef}
              accept="image/*"
              className="hidden"
              type="file"
              onChange={fileChangehandler}
              title="Change profile picture"
            />
            <div
              onClick={() => imageRef.current?.click()}
              className="flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity rounded-full duration-300 bg-black bg-opacity-50 cursor-pointer"
            >
              <Plus className=" absolute text-white w-4 h-4 left-6 top-6" />
            </div>
          </Avatar>
          <Input
            type="text"
            onChange={changeHandler}
            className="border-none outline-none text-2xl font-bold focus:ring-transparent "
            name="fullName"
            value={profileData.fullName}
          />
        </div>
      </div>
      <div className="grid md:grid-cols-4 md:gap-2 gap-3 my-10 ">
        <div className=" flex items-center gap-4 rounded-sm p-2 ">
          <Mail className="text-grey-500 " />
          <div className="w-full">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={profileData.email}
              onChange={changeHandler}
              className="w-full text-grey-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-sm p-2 bg-grey-200">
          <LocateIcon className="text-grey-500 " />
          <div className="w-full">
            <Label>Address</Label>
            <Input
              type="text"
              name="address"
              value={profileData.address}
              onChange={changeHandler}
              className="w-full text-grey-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-sm p-2 bg-grey-200">
          <MapPin className="text-grey-500 " />
          <div className="w-full">
            <Label>City</Label>
            <Input
              type="text"
              name="city"
              value={profileData.city}
              onChange={changeHandler}
              className="w-full text-grey-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-sm p-2 bg-grey-200">
          <MapPinHouse className="text-grey-500 " />
          <div className="w-full">
            <Label>Country</Label>
            <Input
              type="text"
              name="country"
              value={profileData.country}
              onChange={changeHandler}
              className="w-full text-grey-600 bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>
      </div>
      <div className="text-center">
        {loading ? (
          <Button disabled className="bg-orange hover:bg-hoverOrange">
            <Loader2 className="mr-2 animate-spin w-4 h-4 " />
            Please Wait
          </Button>
        ) : (
          <Button className="bg-orange hover:bg-hoverOrange">Update</Button>
        )}
      </div>
    </form>
  );
};

export default Profile;
