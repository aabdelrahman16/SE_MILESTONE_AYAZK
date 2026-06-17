import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import VendorProfile from "./pages/vendor/VendorProfile.jsx";
import SourcingRequests from "./pages/vendor/SourcingRequests.jsx";
import Deliveries from "./pages/vendor/Deliveries.jsx";
import Invoices from "./pages/vendor/Invoices.jsx";

import VenueListings from "./pages/venue/VenueListings.jsx";
import BookingRequests from "./pages/venue/BookingRequests.jsx";
import ConfirmedBookings from "./pages/venue/ConfirmedBookings.jsx";
import Reports from "./pages/venue/Reports.jsx";

function Protected({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Vendor */}
          <Route path="/vendor/profile" element={<Protected role="vendor"><VendorProfile /></Protected>} />
          <Route path="/vendor/requests" element={<Protected role="vendor"><SourcingRequests /></Protected>} />
          <Route path="/vendor/deliveries" element={<Protected role="vendor"><Deliveries /></Protected>} />
          <Route path="/vendor/invoices" element={<Protected role="vendor"><Invoices /></Protected>} />

          {/* Venue owner */}
          <Route path="/venue/listings" element={<Protected role="venue_owner"><VenueListings /></Protected>} />
          <Route path="/venue/requests" element={<Protected role="venue_owner"><BookingRequests /></Protected>} />
          <Route path="/venue/bookings" element={<Protected role="venue_owner"><ConfirmedBookings /></Protected>} />
          <Route path="/venue/reports" element={<Protected role="venue_owner"><Reports /></Protected>} />

          <Route path="*" element={<Navigate to={defaultRoute(user)} />} />
        </Routes>
      </div>
    </>
  );
}

function defaultRoute(user) {
  if (!user) return "/login";
  if (user.role === "vendor") return "/vendor/requests";
  if (user.role === "venue_owner") return "/venue/listings";
  return "/login";
}
