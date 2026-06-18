import { NavLink } from "react-router-dom";
import "./GuestNavbar.css";

export default function GuestNavbar() {
  return (
    <div className="guest-nav">
        <NavLink to="/guest/rsvp" className="nav-item">RSVP</NavLink>
        <NavLink to="/guest/messages" className="nav-item">Messages</NavLink>
        <NavLink to="/guest/feedback" className="nav-item">Feedback</NavLink>
    </div>
  );
}
