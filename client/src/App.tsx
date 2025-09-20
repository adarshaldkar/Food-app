import Login from "./auth/login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./auth/SignUp";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import VerifyEmail from "./auth/VerifyEmail";
import HereSection from "./components/HeroSection";
import MainLayout from "./layout/MainLayout";
import Profile from "./components/Profile";
import SearchPage from "./components/SearchPage";
import RestaurantDetail from "./components/ResturantDetail";
import Cart from "./components/Cart";
import Restaurant from "./admin/Resturant";
import AddMenu from "./admin/AddMenu";
import Orders from "./admin/Orders";
import Success from "./components/Success";
import OrderStatus from "./components/OrderStatus";
import AdminOrders from "./components/admin/AdminOrders";
import { useUserStore } from "./store/useUserStore";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "./components/Loading";
import { useThemeStore } from "./store/useThemeStore";
import BecomeOwner from "./components/BecomeOwner";
import VerifyOwnerRequest from "./components/VerifyOwnerRequest";
import VerifyOwnerOTP from "./components/VerifyOwnerOTP";
import OwnerRequests from "./admin/OwnerRequests";
import OwnerVerificationStatus from "./components/OwnerVerificationStatus";
import { Toaster } from "./components/ui/sonner";
// Import debug utility to make it globally available
import "./utils/debug";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};

const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if(isAuthenticated && user?.isVerified){
    return <Navigate to="/" replace/>
  }
  return children;
};

const AdminRoute = ({children}:{children:React.ReactNode}) => {
  const {user, isAuthenticated} = useUserStore();
  if(!isAuthenticated){
    return <Navigate to="/login" replace/>
  }
  if(!user?.admin){
    return <Navigate to="/" replace/>
  }

  return children;
}

const NonAdminRoute = ({children}:{children:React.ReactNode}) => {
  const {user, isAuthenticated} = useUserStore();
  if(!isAuthenticated){
    return <Navigate to="/login" replace/>
  }
  if(user?.admin){
    return <Navigate to="/" replace/>
  }

  return children;
}

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: <HereSection />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/search/:text",
        element: <SearchPage />,
      },
      {
        path: "/restaurant/:id",
        element: <RestaurantDetail />,
      },
      {
        path: "/cart",
        element: <NonAdminRoute><Cart /></NonAdminRoute>,
      },
      {
        path: "/order/status",
        element: <OrderStatus />,
      },
      // admin services start from here
      {
        path: "/admin/restaurant",
        element:<AdminRoute><Restaurant /></AdminRoute>,
      },
      {
        path: "/admin/menu",
        element:<AdminRoute><AddMenu /></AdminRoute>,
      },
      {
        path: "/admin/orders",
        element:<AdminRoute><AdminOrders /></AdminRoute>,
      },
      {
        path: "/admin/owner-requests",
        element:<AdminRoute><OwnerRequests /></AdminRoute>,
      },
      {
        path: "/become-owner",
        element: <BecomeOwner />,
      },
      {
        path: "/verify-owner-otp",
        element: <VerifyOwnerOTP />,
      },
      {
        path: "/owner-verification-status",
        element: <OwnerVerificationStatus />,
      },
    ],
  },
  {
    path: "/verify-owner-request/:token",
    element: <VerifyOwnerRequest />,
  },
  {
    path: "/login",
    element:<AuthenticatedUser><Login /></AuthenticatedUser>,
  },
  {
    path: "/signup",
    element:<AuthenticatedUser><Signup /></AuthenticatedUser> ,
  },
  {
    path: "/forgot-password",
    element: <AuthenticatedUser><ForgotPassword /></AuthenticatedUser>,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
]);

function App() {
  const initializeTheme = useThemeStore((state:any) => state.initializeTheme);
  const {checkAuthentication, isCheckingAuth} = useUserStore();
  // checking auth every time when page is loaded
  useEffect(()=>{
    checkAuthentication();
    initializeTheme();
  },[checkAuthentication])

  if(isCheckingAuth) return <Loading/>
  return (
    <main>
      <RouterProvider router={appRouter}></RouterProvider>
      <Toaster />
    </main>
  );
}

export default App;
