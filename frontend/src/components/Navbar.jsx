import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div className="nav">
      <div>
        <strong>Event Platform</strong>
        {user?.role === "vendor" && (
          <span style={{ marginLeft: 24 }}>
            <Link to="/vendor/profile">Profile</Link>
            <Link to="/vendor/requests">Sourcing Requests</Link>
            <Link to="/vendor/deliveries">Deliveries</Link>
            <Link to="/vendor/invoices">Invoices</Link>
          </span>
        )}
        {user?.role === "venue_owner" && (
          <span style={{ marginLeft: 24 }}>
            <Link to="/venue/listings">My Venues</Link>
            <Link to="/venue/requests">Booking Requests</Link>
            <Link to="/venue/bookings">Confirmed</Link>
            <Link to="/venue/reports">Reports</Link>
          </span>
        )}
      </div>
      {user && (
        <div>
          <span style={{ marginRight: 16, fontSize: 13 }}>{user.name}</span>
          <button className="btn sm secondary" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
