import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StaffRSVPs.css";

export default function StaffRSVPs() {
  const navigate = useNavigate();
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("staffLoggedIn");
    if (!loggedIn) {
      navigate("/staff/login");
      return;
    }

    axios
      .get("http://localhost:5000/staff/rsvps")
      .then((res) => {
        setRsvps(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load RSVPs");
        setLoading(false);
      });
  }, []);

  return (
    <div className="rsvp-container">
      <h1 className="rsvp-title">Guest RSVPs</h1>

      {loading && <p className="rsvp-loading">Loading...</p>}
      {error && <p className="rsvp-error">{error}</p>}

      {!loading && !error && (
        <table className="rsvp-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Event</th>
            </tr>
          </thead>

          <tbody>
            {rsvps.map((r, index) => (
              <tr key={index}>
                <td>{r.name}</td>
                <td>{r.email}</td>

                <td className={`status ${r.status.toLowerCase().replace(" ", "-")}`}>
                  {r.status}
                </td>

                <td>{r.eventName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
