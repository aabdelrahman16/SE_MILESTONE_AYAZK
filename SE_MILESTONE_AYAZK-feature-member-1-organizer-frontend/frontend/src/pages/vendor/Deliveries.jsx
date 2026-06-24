import { useEffect, useState } from "react";
import api from "../../services/api.js";

const STATUSES = ["Preparing", "Out for Delivery", "Delivered"];

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);

  const load = () => api.get("/vendors/deliveries").then((r) => setDeliveries(r.data));
  useEffect(() => { load(); }, []);

  const update = async (id, status) => {
    await api.patch(`/vendors/deliveries/${id}`, { status });
    load();
  };

  const reportDelay = async (id) => {
    const delayNote = prompt("Describe the delay / change:");
    if (delayNote) {
      await api.patch(`/vendors/deliveries/${id}`, { delayNote });
      load();
    }
  };

  return (
    <div>
      <h1>Deliveries</h1>
      {deliveries.length === 0 && <p>No accepted orders yet.</p>}
      <div className="card">
        <table>
          <thead>
            <tr><th>Event</th><th>Status</th><th>Delay Note</th><th>Update</th></tr>
          </thead>
          <tbody>
            {deliveries.map((d) => (
              <tr key={d._id}>
                <td>{d.eventName || "—"}</td>
                <td><span className="badge accepted">{d.status}</span></td>
                <td style={{ fontSize: 13, color: "#92400e" }}>{d.delayNote || "—"}</td>
                <td>
                  <select value={d.status} onChange={(e) => update(d._id, e.target.value)} style={{ margin: 0, marginBottom: 6 }}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <button className="btn sm secondary" onClick={() => reportDelay(d._id)}>Report delay</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
