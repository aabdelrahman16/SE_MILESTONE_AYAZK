import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();
  const target = user?.role === "vendor" ? "/vendor/requests" : user?.role === "venue_owner" ? "/venue/listings" : user?.role === "organizer" ? "/organizer/dashboard" : "/login";
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">Full-stack event management platform</p>
        <h1>Plan events, book venues, manage vendors, track guests, and review budgets.</h1>
        <p className="hero-text">A React frontend connected to the Node.js backend APIs, with working forms, tables, status updates, and role-based dashboards.</p>
        <div className="actions"><Link className="btn" to={target}>Open dashboard</Link><Link className="btn ghost" to="/login">Use demo login</Link></div>
        <div className="demo-logins"><b>Demo:</b> organizer@demo.com, vendor1@demo.com, owner@demo.com · password123</div>
      </div>
      <div className="hero-card">
        <h3>Implemented flows</h3>
        <p>Organizer dashboard, venue search and booking, task planning, guest RSVP/check-in, vendor sourcing, invoices, venue owner listing and reports.</p>
      </div>
    </section>
  );
}
