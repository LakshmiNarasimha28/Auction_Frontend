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
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;