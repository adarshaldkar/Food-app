import Footer from "@/components/Footer";
import Navbar from "@/components/navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen m-2 md:m-0 bg-white dark:bg-gray-900 transition-colors">
      <header>
        {/* navbar */}
        <Navbar />
      </header>
      {/* mainLayout */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors">
        <Outlet/>
      </div>
      {/* Footer */}
      <footer>
        <Footer/>
      </footer>
    </div>
  );
};

export default MainLayout;
