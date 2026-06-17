import { useEffect, useState } from "react";
import api from "../../services/api.js";

export default function SourcingRequests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");

  const load = () =>
    api.get("/vendors/requests/incoming").then((r) => setRequests(r.data));

  useEffect(() => { load(); }, []);

  const respond = async (id, status) => {
    await api.patch(`/vendors/requests/${id}/respond`, { status });
    load();
  };

  const sendMessage = async (id) => {
    const text = prompt("Message to organizer:");
    if (text) {
      await api.post(`/vendors/requests/${id}/message`, { text });
      load();
    }
  };

  const shown = requests.filter((r) => filter === "All" || r.status === filter);

  return (
    <div>
      <h1>Incoming Sourcing Requests</h1>
      <div className="card">
        <label>Filter by status</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 200 }}>
          {["All", "Pending", "Accepted", "Declined"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {shown.length === 0 && <p>No requests.</p>}
      {shown.map((r) => (
        <div className="card" key={r._id}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2>{r.eventName} — {r.eventLocation}</h2>
            <span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span>
          </div>
          <p style={{ fontSize: 13, color: "#5a6678" }}>
            Organizer: {r.organizer?.name} · Delivery: {r.deliveryDate ? new Date(r.deliveryDate).toLocaleDateString() : "—"}
          </p>
          <ul style={{ margin: "8px 0 8px 18px", fontSize: 14 }}>
            {r.requestedItems.map((it, i) => <li key={i}>{it.item} × {it.quantity}</li>)}
          </ul>
          {r.messages?.length > 0 && (
            <div style={{ fontSize: 13, background: "#f4f6f8", padding: 8, borderRadius: 6, marginBottom: 8 }}>
              {r.messages.map((m, i) => <div key={i}><strong>{m.from}:</strong> {m.text}</div>)}
            </div>
          )}
          {r.status === "Pending" && (
            <div className="row">
              <button className="btn sm" onClick={() => respond(r._id, "Accepted")}>Accept</button>
              <button className="btn sm danger" onClick={() => respond(r._id, "Declined")}>Decline</button>
              <button className="btn sm secondary" onClick={() => sendMessage(r._id)}>Message</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
