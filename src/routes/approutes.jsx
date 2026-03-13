import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Home from "./Home";
import Dashboard from "../pages/auction/Dashboard";
import AuctionDetails from "../pages/auction/AuctionDetails";
import CreateAuction from "../pages/auction/createAuction";
import ProtectedRoute from "../components/protectedroute.jsx";
import PaymentPage from "../pages/payments.jsx";
import ChatPage from "../pages/chat.jsx";
import Categories from "../pages/category/Categories.jsx";
import Wishlist from "../pages/wishlist/Wishlist.jsx";
import ActivityHistory from "../pages/activity/ActivityHistory.jsx";
import Reviews from "../pages/review/Reviews.jsx";
import Search from "../pages/search/Search.jsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes - No Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Main Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auction/:id" element={<AuctionDetails />} />
          <Route path="/create-auction" element={<ProtectedRoute><CreateAuction /></ProtectedRoute>} />
          <Route path="/payment/:id" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/search" element={<Search />} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/activity" element={<ProtectedRoute><ActivityHistory /></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;