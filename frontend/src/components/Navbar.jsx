import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const link = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;
  return (
    <header className="topbar">
      <Link className="brand" to="/">EventFlow</Link>
      <nav>
        {user?.role === "organizer" && <NavLink className={link} to="/organizer/dashboard">Organizer</NavLink>}
        {user?.role === "vendor" && <>
          <NavLink className={link} to="/vendor/profile">Profile</NavLink>
          <NavLink className={link} to="/vendor/requests">Requests</NavLink>
          <NavLink className={link} to="/vendor/deliveries">Deliveries</NavLink>
          <NavLink className={link} to="/vendor/invoices">Invoices</NavLink>
        </>}
        {user?.role === "venue_owner" && <>
          <NavLink className={link} to="/venue/listings">Listings</NavLink>
          <NavLink className={link} to="/venue/requests">Requests</NavLink>
          <NavLink className={link} to="/venue/bookings">Bookings</NavLink>
          <NavLink className={link} to="/venue/reports">Reports</NavLink>
        </>}
      </nav>
      <div className="account">
        {user ? <><span>{user.name} · {user.role.replace("_", " ")}</span><button onClick={logout}>Logout</button></> : <><Link to="/login">Login</Link><Link className="btn small" to="/register">Register</Link></>}
      </div>
    </header>
  );
}
