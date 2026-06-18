import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StaffCheckIn.css";

export default function StaffCheckIn() {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("staffLoggedIn");
    if (!loggedIn) {
      navigate("/staff/login");
      return;
    }

    axios.get("http://localhost:5000/staff/checkin")
      .then(res => {
        setGuests(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCheckIn = (id) => {
    axios.post(`http://localhost:5000/staff/checkin/${id}`)
      .then(() => {
        setGuests(prev =>
          prev.map(g =>
            g._id === id ? { ...g, checkedIn: true, checkInTime: new Date() } : g
          )
        );
      });
  };

  return (
    <div className="checkin-container">
      <h1 className="checkin-title">Guest Check-In</h1>

      {loading && <p>Loading...</p>}

      {!loading && (
        <table className="checkin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Check-In Time</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {guests.map((g, index) => (
              <tr key={g._id}>
                <td>{index + 1}</td>
                <td>{g.name}</td>
                <td>{g.email}</td>

                <td>
                  {g.checkedIn ? (
                    <span className="badge checked">Checked In</span>
                  ) : (
                    <span className="badge not">Not Checked In</span>
                  )}
                </td>

                <td>
                  {g.checkedIn
                    ? new Date(g.checkInTime).toLocaleString()
                    : "--"}
                </td>

                <td>
                  {!g.checkedIn ? (
                    <button
                      className="checkin-btn"
                      onClick={() => handleCheckIn(g._id)}
                    >
                      Check In
                    </button>
                  ) : (
                    <button className="disabled-btn" disabled>
                      Done
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
