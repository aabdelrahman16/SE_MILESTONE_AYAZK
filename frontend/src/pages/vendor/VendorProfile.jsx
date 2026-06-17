import { useEffect, useState } from "react";
import api from "../../services/api.js";

export default function VendorProfile() {
  const [vendor, setVendor] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/vendors/me").then((r) => setVendor(r.data)).catch(() => {});
  }, []);

  if (!vendor) return <p>Loading...</p>;

  const set = (k) => (e) => setVendor({ ...vendor, [k]: e.target.value });
  const setSupplies = (e) =>
    setVendor({ ...vendor, suppliesOffered: e.target.value.split(",").map((s) => s.trim()) });

  const addPrice = () =>
    setVendor({ ...vendor, pricingList: [...vendor.pricingList, { item: "", price: 0, unit: "each" }] });

  const setPrice = (i, k) => (e) => {
    const list = [...vendor.pricingList];
    list[i] = { ...list[i], [k]: k === "price" ? Number(e.target.value) : e.target.value };
    setVendor({ ...vendor, pricingList: list });
  };

  const save = async () => {
    const { data } = await api.put("/vendors/me", vendor);
    setVendor(data);
    setMsg("Profile saved.");
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div>
      <h1>Vendor Profile</h1>
      <div className="card">
        <label>Company Name</label>
        <input value={vendor.companyName || ""} onChange={set("companyName")} />
        <label>Supplies Offered (comma separated)</label>
        <input value={(vendor.suppliesOffered || []).join(", ")} onChange={setSupplies} />
        <label>Main Location</label>
        <input value={vendor.mainLocation || ""} onChange={set("mainLocation")} />
        <label>Contact Phone</label>
        <input
          value={vendor.contactInfo?.phone || ""}
          onChange={(e) => setVendor({ ...vendor, contactInfo: { ...vendor.contactInfo, phone: e.target.value } })}
        />
      </div>

      <div className="card">
        <h2>Pricing List</h2>
        {vendor.pricingList.map((p, i) => (
          <div className="row" key={i}>
            <input style={{ flex: 2 }} placeholder="Item" value={p.item} onChange={setPrice(i, "item")} />
            <input style={{ flex: 1 }} type="number" placeholder="Price" value={p.price} onChange={setPrice(i, "price")} />
            <input style={{ flex: 1 }} placeholder="Unit" value={p.unit} onChange={setPrice(i, "unit")} />
          </div>
        ))}
        <button className="btn secondary sm" onClick={addPrice}>+ Add item</button>
      </div>

      {msg && <p className="error" style={{ color: "#065f46" }}>{msg}</p>}
      <button className="btn" onClick={save}>Save Profile</button>
    </div>
  );
}
