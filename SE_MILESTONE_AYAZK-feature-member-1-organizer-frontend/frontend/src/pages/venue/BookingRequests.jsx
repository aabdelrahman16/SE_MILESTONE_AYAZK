import { useEffect, useState } from "react";
import api from "../../services/api.js";

export default function BookingRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");

  const load = () => {
    const q = filter === "All" ? "" : `?status=${filter}`;
    api.get(`/venues/bookings/requests${q}`).then((r) => setRequests(r.data));
  };
  useEffect(() => { load(); }, [filter]);

  const respond = async (id, status) => {
    await api.patch(`/venues/bookings/requests/${id}/respond`, { status });
    load();
  };

  const counter = async (id) => {
    const counterProposal = prompt("Counter-proposal (e.g. adjusted price / alternative date):");
    if (counterProposal) {
      await api.patch(`/venues/bookings/requests/${id}/respond`, { counterProposal });
      load();
    }
  };

  return (
    <div>
      <h1>Booking Requests</h1>
      <div className="card">
        <label>Filter by status</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 200 }}>
          {["All", "Pending", "Approved", "Declined"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {requests.length === 0 && <p>No requests.</p>}
      {requests.map((r) => (
        <div className="card" key={r._id}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2>{r.venue?.name} — {r.eventType}</h2>
            <span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span>
          </div>
          <p style={{ fontSize: 13, color: "#5a6678" }}>
            Organizer: {r.organizer?.name} · Date: {new Date(r.date).toLocaleDateString()} · {r.expectedAttendees} attendees
          </p>
          {r.specialRequirements && <p style={{ fontSize: 13 }}>Requirements: {r.specialRequirements}</p>}
          {r.counterProposal && <p style={{ fontSize: 13, color: "#92400e" }}>Counter: {r.counterProposal}</p>}
          {r.status === "Pending" && (
            <div className="row" style={{ marginTop: 8 }}>
              <button className="btn sm" onClick={() => respond(r._id, "Approved")}>Approve</button>
              <button className="btn sm danger" onClick={() => respond(r._id, "Declined")}>Decline</button>
              <button className="btn sm secondary" onClick={() => counter(r._id)}>Counter-propose</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
