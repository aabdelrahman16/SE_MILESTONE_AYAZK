import "./StaffDashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function StaffDashboard() {
  const navigate = useNavigate();


  useEffect(() => {
    const loggedIn = sessionStorage.getItem("staffLoggedIn");
    if (!loggedIn) {
      navigate("/staff/login");
    }
  }, []);


  return (
    <div className="dashboard-container">

      <button 
            className="logout-btn"
            onClick={() => {
              sessionStorage.removeItem("staffLoggedIn");
              navigate("/staff/login");
            }}
          >
            Logout
      </button>

      <h1 className="dashboard-title">Staff Dashboard</h1>

      <div className="dashboard-grid">

        <div className="dashboard-card" onClick={() => navigate("/staff/rsvps")}>
          <h2>View RSVPs</h2>
          <p>See all guest responses</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/staff/feedback")}>
          <h2>View Feedback</h2>
          <p>Read guest feedback</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/staff/checkin")}>
          <h2>Guest Check‑In</h2>
          <p>Mark guests as arrived</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/staff/announcements")}>
          <h2>Send Announcement</h2>
          <p>Notify all guests</p>
        </div>

      </div>
    </div>
  );
}
