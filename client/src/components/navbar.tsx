import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@radix-ui/react-menubar";

// Then use it like this:

import {
  Moon,
  ShoppingCart,
  Sun,
  Loader2,
  Menu,
  X,
  User,
  HandPlatter,
  ShoppingBasket,
  SquareMenu,
  UtensilsCrossed,
  PackageCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sheet,
} from "./ui/sheet";

import { SheetContent } from "./ui/sheet";

import { Separator } from "@radix-ui/react-separator";
import { useUserStore } from "@/store/useUserStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useCartStore } from "@/store/useCartStore";

const Navbar = () => {
  const { user, loading,logout } = useUserStore();
  const { theme, setTheme } = useThemeStore();
  const { cart } = useCartStore();

  return (
    <>
      <div className="fixed top-0 left-0 right-0 w-full bg-white dark:bg-gray-900 z-50 shadow-sm dark:shadow-gray-800">
        <div className="flex items-center h-14 px-4 max-w-7xl mx-auto mt-5">
          <Link to="/" className="flex items-center">
            <h1 className="font-bold md:font-extrabold text-2xl text-black dark:text-white">
              App
            </h1>
          </Link>
          <div className="hidden md:flex items-center gap-10 ml-auto">
            <Link to="/" className=" text-black dark:text-white hover:text-orange-500 dark:hover:text-orange-400">
              Home
            </Link>
            <Link to="/Profile" className="text-black dark:text-white hover:text-orange-500 dark:hover:text-orange-400">
              Profile
            </Link>
            <Link to="/order/status" className="text-black dark:text-white hover:text-orange-500 dark:hover:text-orange-400">
              Order
            </Link>
            {/* Only show "Become an Owner" if user is not an owner and hasn't submitted a request or was rejected */}
            {!user?.admin && (!user?.ownerRequestStatus || user?.ownerRequestStatus === 'none' || user?.ownerRequestStatus === 'rejected') && (
              <Link to="/become-owner" className="text-black dark:text-white hover:text-orange-500 dark:hover:text-orange-400">
                Become an Owner
              </Link>
            )}
            {/* Show verification status for pending/verified requests */}
            {!user?.admin && (user?.ownerRequestStatus === 'pending' || user?.ownerRequestStatus === 'verified') && (
              <Link to="/owner-verification-status" className="text-black dark:text-white hover:text-orange-500 dark:hover:text-orange-400">
                Owner Status
              </Link>
            )}
            {user?.admin && (
              <Menubar className="border-none bg-transparent">
                <MenubarMenu>
                  <MenubarTrigger className="cursor-pointer text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-md border border-gray-200 dark:border-gray-600 transition-colors">
                    Dashboard
                  </MenubarTrigger>
                  <MenubarContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg min-w-[200px]">
                    <MenubarItem className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm">
                      <Link to="/admin/restaurant" className="text-gray-700 dark:text-gray-200 flex items-center w-full px-3 py-2">
                        🏪 Restaurant
                      </Link>
                    </MenubarItem>
                    <MenubarItem className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm">
                      <Link to="/admin/orders" className="text-gray-700 dark:text-gray-200 flex items-center w-full px-3 py-2">
                        📦 Order
                      </Link>
                    </MenubarItem>
                    <MenubarItem className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm">
                      <Link to="/admin/menu" className="text-gray-700 dark:text-gray-200 flex items-center w-full px-3 py-2">
                        🍽️ Menu
                      </Link>
                    </MenubarItem>
                    <MenubarItem className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm">
                      <Link to="/admin/owner-requests" className="text-gray-700 dark:text-gray-200 flex items-center w-full px-3 py-2">
                        👤 Owner Requests
                      </Link>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            )}

            <div className="flex items-center gap-4">
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
                      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                    <DropdownMenuItem 
                      onClick={() => setTheme('light')}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setTheme('dark')}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Hide cart for admin users */}
              {!user?.admin && (
                <Link to="/cart" className="cursor-pointer relative ">
                  <ShoppingCart />
                  {cart.length > 0 && (
                    <Button className=" absolute -top-4 -right-0 text-xs p-0 bg-red-500 text-white rounded-full w-5 h-5 hover:bg-red-600 ">
                      {cart.length}
                    </Button>
                  )}
                </Link>
              )}
              <div>
                <Avatar className="w-8 h-8 relative flex shrink-0 overflow-hidden rounded-full">
                  <AvatarImage src={user?.profilePicture !== "Update your profile picture" ? user?.profilePicture : undefined} />
                  <AvatarFallback>{user?.fullName?.charAt(0)?.toUpperCase() || "CN"}</AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-0">
                {loading ? (
                  <Button
                    disabled
                    className="w-full bg-orange hover:bg-hoverOrange"
                  >
                    <Loader2 className="mr-2 h-2 w-2 animate-spin " />
                    Please wait
                  </Button>
                ) : (
                  <Button onClick={logout} className="w-full  bg-orange hover:bg-hoverOrange  ">
                    {" "}
                    Logout{" "}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* mobile responsive */}
          <div className="md:hidden lg:hidden ml-auto">
            <MobileNavbar />
          </div>
        </div>
      </div>
    </>
  );
};
export default Navbar;

const MobileNavbar = () => {
  const { user,loading,logout } = useUserStore();
  const { theme, setTheme } = useThemeStore();
  const { cart } = useCartStore();
  return (
    <Sheet>
      <SheetTrigger
        asChild
        className="text-gray-700 dark:text-gray-200 rounded-3xl p-2 m-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 scale-110 transition-colors border border-gray-300 dark:border-gray-600"
      >
        <Menu size={"34"} />
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
        <SheetHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-200 dark:border-gray-700">
          <SheetTitle className="text-xl font-bold text-gray-900 dark:text-white">App</SheetTitle>
          <SheetClose className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>
        
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Sun className={`h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-400 transition-all ${theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
                <Moon className={`absolute h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-400 transition-all ${theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
              <DropdownMenuItem 
                onClick={() => setTheme('light')}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setTheme('dark')}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Separator className="my-2 bg-gray-200 dark:bg-gray-700" />
        <SheetDescription className="flex-1 px-2">
          <Link
            to="/profile"
            className="flex items-center gap-4 px-4 py-3 mx-2 cursor-pointer rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>

          <Link
            to="/order/status"
            className="flex items-center gap-4 px-4 py-3 mx-2 cursor-pointer rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
          >
            <HandPlatter className="h-5 w-5" />
            <span>Orders</span>
          </Link>
          {/* Only show "Become an Owner" if user is not an owner and hasn't submitted a request or was rejected */}
          {!user?.admin && (!user?.ownerRequestStatus || user?.ownerRequestStatus === 'none' || user?.ownerRequestStatus === 'rejected') && (
            <Link
              to="/become-owner"
              className="flex items-center gap-4 px-4 py-3 mx-2 cursor-pointer rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              <User className="h-5 w-5" />
              <span>Become an Owner</span>
            </Link>
          )}
          {/* Show verification status for pending/verified requests */}
          {!user?.admin && (user?.ownerRequestStatus === 'pending' || user?.ownerRequestStatus === 'verified') && (
            <Link
              to="/owner-verification-status"
              className="flex items-center gap-4 px-4 py-3 mx-2 cursor-pointer rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              <User className="h-5 w-5" />
              <span>Owner Status</span>
            </Link>
          )}
          {/* Hide cart for admin users */}
          {!user?.admin && (
            <Link
              to="/cart"
              className="flex items-center gap-4 px-4 py-3 mx-2 cursor-pointer rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              <ShoppingBasket className="h-5 w-5" />
              <span>Cart ({cart.length})</span>
            </Link>
          )}
          {user?.admin && (
            <>
              <Link
                to="/admin/menu"
                className="flex items-center gap-4 px-4 py-3 mx-2 cursor-pointer rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                <SquareMenu className="h-5 w-5" />
                <span>Menu</span>
              </Link>

              <Link
                to="/admin/restaurant"
                className="flex items-center gap-4 px-4 py-3 mx-2 cursor-pointer rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                <UtensilsCrossed className="h-5 w-5" />
                <span>Restaurant</span>
              </Link>

              <Link
                to="/admin/orders"
                className="flex items-center gap-4 px-4 py-3 mx-2 cursor-pointer rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                <PackageCheck className="h-5 w-5" />
                <span>Restaurant Orders</span>
              </Link>
              <Link
                to="/admin/owner-requests"
                className="flex items-center gap-4 px-4 py-3 mx-2 cursor-pointer rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Owner Requests</span>
              </Link>
            </>
          )}
        </SheetDescription>
        <SheetFooter className="flex flex-col gap-4 p-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="flex flex-row items-center gap-3">
            <Avatar className="w-12 h-12 relative flex shrink-0 overflow-hidden rounded-full">
              <AvatarImage src={user?.profilePicture !== "Update your profile picture" ? user?.profilePicture : undefined} />
              <AvatarFallback className="bg-orange text-white font-semibold">{user?.fullName?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white truncate">{user?.fullName || "User"}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email || "user@example.com"}</p>
            </div>
          </div>

          <SheetClose asChild>
            {loading ? (
              <Button
                disabled
                className="w-full bg-orange hover:bg-hoverOrange disabled:opacity-50"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button onClick={logout} className="w-full bg-orange hover:bg-hoverOrange text-white font-medium">
                Logout
              </Button>
            )}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
