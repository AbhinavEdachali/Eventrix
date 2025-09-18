import { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./components/common_components/AuthContext";
import PrivateRoutes from "./components/auth_components/PrivateRoutes";
import Homepage from "./pages/common_pages/Homepage";
// import Header from "./components/header_components/Header";
// import Footer from "./components/footer_components/Footer";
import PageNotFound from "./pages/common_pages/PageNotFound";
import ContactUs from "./pages/contact_pages/ContactUs";
import TopHeader from "./components/header_components/TopHeader";
import AboutUs from "./pages/common_pages/AboutUs";


// user pages.
import Login from "./pages/user_pages/Login";
import Register from "./pages/user_pages/Register";
import UserDashboard from "./pages/user_pages/UserDashboard";
import ForgotPassword from "./pages/user_pages/ForgotPassword";
import ResetPassword from "./pages/user_pages/ResetPassword";
import Profile from "./pages/user_pages/Profile";
import UpdateProfile from "./pages/user_pages/UpdateProfile";

// blog pages.
import AllBlogs from "./pages/blog_pages/AllBlogs";
import SingleBlog from "./pages/blog_pages/SingleBlog";
import Review from "./pages/user_pages/Review";
import Services from "./pages/service_pages/ServicePage";
import CategoryProducts from "./pages/service_pages/CategoryProducts";
import SingleProduct from "./pages/service_pages/SingleProduct";

import ShortlistPage from "./pages/user_pages/ShortlistPage"
import Faq from "./pages/common_pages/Faq"



// newsletter
import NewsLetter from "./components/common_components/NewsLetter";

//Booking Page.
import BookProductPage from "./pages/service_pages/BookProductPage";


// ✅ Function to dynamically update the page title based on the current route
const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const getPageTitle = (pathname) => {
      if (pathname === "/" || pathname === "/home" || pathname === "/homepage")
        return "Homepage";
      if (pathname === "/contact-us") return "Contact Us";
      if (pathname === "/about-us") return "About Us";
      if (pathname === "/register") return "Register";
      if (pathname === "/login") return "Login";
      if (pathname.startsWith("/user-dashboard/")) return "User Dashboard";
      if (pathname.startsWith("/forgot-password/")) return "Forgot Password";
      if (pathname.startsWith("/reset-password/")) return "Reset Password";
      if (pathname.startsWith("/profile/")) return "Profile";
      if (pathname.startsWith("/all-blogs")) return "All Blogs";
      if (pathname.startsWith("/review")) return "Review";
      if (pathname.startsWith("/services")) return "services";
      
      if (pathname.startsWith("/single-blog/")) return "Single Blog";
      return "Page Not Found";
    };

    document.title = `${getPageTitle(location.pathname)} - Eventrix`;
  }, [location.pathname]); // ✅ Runs only when pathname changes

  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <TitleUpdater /> {/* ✅ Ensures the title updates dynamically */}
        <ToastContainer />
        {/* <Header /> */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/reviews" element={<Review />} />
          <Route path="/all-blogs" element={<AllBlogs />} />
          <Route path="/single-blog/:id" element={<SingleBlog />} />
          <Route path="/page-not-found" element={<PageNotFound />} />
          <Route path="/*" element={<PageNotFound />} />
          <Route path="/services" element={<Services />} />
          <Route path="/category/:categoryId" element={<CategoryProducts />} />
          <Route path="/product/:productId" element={<SingleProduct />} />
          
          
          <Route path="/shortlistpage" element={<ShortlistPage />} />
          <Route path="/faq" element={<Faq />} />
       
          

          

          {/* Private Routes with Role-Based Access */}
          <Route
            path="/dashboard/:id"
            element={
              <PrivateRoutes>
                <UserDashboard />
              </PrivateRoutes>
            }
          />

          <Route
            path="/book-page"
            element={
              // <PrivateRoutes>
                <BookProductPage />
              // </PrivateRoutes>
            }
          />
          <Route
            path="/user-dashboard/:id"
            element={
              <UserDashboard /> // Temporarily remove PrivateRoutes for testing
            }
          />


          {/* user pages */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/profile/:id"
            element={
              <PrivateRoutes>
                <Profile />
              </PrivateRoutes>
            }
          />

          <Route
            path="/update-profile/:id"
            element={
              <PrivateRoutes>
                <UpdateProfile />
              </PrivateRoutes>
            }
          />
        </Routes>
        {/* <NewsLetter /> Ensure NewsLetter is defined and imported */}
        {/* <Footer /> */}
      </Router>
    </AuthProvider>
  );
}

export default App;
