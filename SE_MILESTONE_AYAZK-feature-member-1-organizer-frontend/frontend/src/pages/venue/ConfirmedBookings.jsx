import { useEffect, useState } from "react";
import api from "../../services/api.js";

export default function ConfirmedBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/venues/bookings/confirmed").then((r) => setBookings(r.data));
  }, []);

  return (
    <div>
      <h1>Confirmed Bookings</h1>
      <div className="card">
        {bookings.length === 0 ? <p>No confirmed bookings.</p> : (
          <table>
            <thead>
              <tr><th>Venue</th><th>Event</th><th>Date</th><th>Organizer</th><th>Contact</th></tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.venue?.name}</td>
                  <td>{b.eventType}</td>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>{b.organizer?.name}</td>
                  <td style={{ fontSize: 13 }}>{b.organizer?.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
