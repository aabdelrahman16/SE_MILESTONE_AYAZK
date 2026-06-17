import { useEffect, useState } from "react";
import api from "../../services/api.js";

const EMPTY = {
  name: "", description: "", location: "", capacity: 0,
  sizeSqm: 0, amenities: "", pricePerDay: 0,
};

export default function VenueListings() {
  const [venues, setVenues] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);

  const load = () => api.get("/venues/mine").then((r) => setVenues(r.data));
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const payload = () => ({
    ...form,
    capacity: Number(form.capacity),
    sizeSqm: Number(form.sizeSqm),
    pricePerDay: Number(form.pricePerDay),
    amenities: form.amenities ? form.amenities.split(",").map((s) => s.trim()) : [],
  });

  const save = async () => {
    if (editId) await api.put(`/venues/${editId}`, payload());
    else await api.post("/venues", payload());
    setForm(EMPTY); setEditId(null); load();
  };

  const edit = (v) => {
    setEditId(v._id);
    setForm({ ...v, amenities: (v.amenities || []).join(", ") });
  };

  const setStatus = async (id, status) => {
    await api.patch(`/venues/${id}/status`, { status });
    load();
  };

  return (
    <div>
      <h1>My Venues</h1>

      <div className="card">
        <h2>{editId ? "Edit Listing" : "Create New Listing"}</h2>
        <label>Name</label>
        <input value={form.name} onChange={set("name")} />
        <label>Description</label>
        <textarea value={form.description} onChange={set("description")} />
        <div className="row">
          <div style={{ flex: 1 }}><label>Location</label><input value={form.location} onChange={set("location")} /></div>
          <div style={{ flex: 1 }}><label>Capacity</label><input type="number" value={form.capacity} onChange={set("capacity")} /></div>
        </div>
        <div className="row">
          <div style={{ flex: 1 }}><label>Size (m²)</label><input type="number" value={form.sizeSqm} onChange={set("sizeSqm")} /></div>
          <div style={{ flex: 1 }}><label>Price / day</label><input type="number" value={form.pricePerDay} onChange={set("pricePerDay")} /></div>
        </div>
        <label>Amenities (comma separated)</label>
        <input value={form.amenities} onChange={set("amenities")} />
        <button className="btn" onClick={save}>{editId ? "Update" : "Create"} Listing</button>
        {editId && <button className="btn secondary" style={{ marginLeft: 8 }} onClick={() => { setForm(EMPTY); setEditId(null); }}>Cancel</button>}
      </div>

      {venues.map((v) => (
        <div className="card" key={v._id}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2>{v.name}</h2>
            <span className={`badge ${v.status}`}>{v.status}</span>
          </div>
          <p style={{ fontSize: 14, color: "#5a6678" }}>
            {v.location} · {v.capacity} guests · {v.sizeSqm} m² · {v.pricePerDay} EGP/day
          </p>
          <p style={{ fontSize: 13 }}>{v.description}</p>
          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn sm secondary" onClick={() => edit(v)}>Edit</button>
            {v.status === "active"
              ? <button className="btn sm secondary" onClick={() => setStatus(v._id, "inactive")}>Deactivate</button>
              : <button className="btn sm" onClick={() => setStatus(v._id, "active")}>Activate</button>}
            <button className="btn sm danger" onClick={() => setStatus(v._id, "removed")}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}
