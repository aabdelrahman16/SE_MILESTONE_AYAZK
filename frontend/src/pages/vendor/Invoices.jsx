import { useEffect, useState } from "react";
import api from "../../services/api.js";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({ eventName: "", description: "", quantity: 1, unitPrice: 0, notes: "" });

  const load = () => api.get("/vendors/invoices").then((r) => setInvoices(r.data));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    // organizer id is needed; in a full integration this comes from the related request.
    // For the demo we let the backend use the seeded organizer if omitted.
    await api.post("/vendors/invoices", {
      eventName: form.eventName,
      lineItems: [{ description: form.description, quantity: Number(form.quantity), unitPrice: Number(form.unitPrice) }],
      notes: form.notes,
    });
    setForm({ eventName: "", description: "", quantity: 1, unitPrice: 0, notes: "" });
    load();
  };

  return (
    <div>
      <h1>Invoices</h1>

      <div className="card">
        <h2>Submit New Invoice</h2>
        <label>Event Name</label>
        <input value={form.eventName} onChange={set("eventName")} />
        <div className="row">
          <div style={{ flex: 2 }}>
            <label>Description</label>
            <input value={form.description} onChange={set("description")} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Qty</label>
            <input type="number" value={form.quantity} onChange={set("quantity")} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Unit Price</label>
            <input type="number" value={form.unitPrice} onChange={set("unitPrice")} />
          </div>
        </div>
        <label>Notes / itemized breakdown</label>
        <textarea value={form.notes} onChange={set("notes")} />
        <button className="btn" onClick={submit}>Submit Invoice</button>
      </div>

      <div className="card">
        <h2>Submitted Invoices</h2>
        <table>
          <thead><tr><th>Event</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td>{inv.eventName || "—"}</td>
                <td>{inv.total} EGP</td>
                <td><span className={`badge ${inv.status === "Pending Review" ? "pending" : "approved"}`}>{inv.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
