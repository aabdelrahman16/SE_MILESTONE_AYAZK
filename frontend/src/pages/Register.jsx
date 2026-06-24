import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "vendor", companyName: "" });
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    setError("");
    try {
      const user = await register(form);
      if (user.role === "vendor") nav("/vendor/profile");
      else if (user.role === "venue_owner") nav("/venue/listings");
      else nav("/organizer/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Register</h1>
      <label>Account Type</label>
      <select value={form.role} onChange={set("role")}>
        <option value="vendor">Vendor / Supplier</option>
        <option value="venue_owner">Venue Owner</option>
      </select>
      <label>Name</label>
      <input value={form.name} onChange={set("name")} />
      {form.role === "vendor" && (
        <>
          <label>Company Name</label>
          <input value={form.companyName} onChange={set("companyName")} />
        </>
      )}
      <label>Email</label>
      <input value={form.email} onChange={set("email")} />
      <label>Password</label>
      <input type="password" value={form.password} onChange={set("password")} />
      {error && <div className="error">{error}</div>}
      <button className="btn" onClick={submit}>Create Account</button>
      <p style={{ marginTop: 14, fontSize: 13 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
