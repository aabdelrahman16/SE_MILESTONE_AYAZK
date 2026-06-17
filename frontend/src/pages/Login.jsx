import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    try {
      const user = await login(email, password);
      nav(user.role === "vendor" ? "/vendor/requests" : "/venue/listings");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Login</h1>
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vendor1@demo.com" />
      <label>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password123" />
      {error && <div className="error">{error}</div>}
      <button className="btn" onClick={submit}>Login</button>
      <p style={{ marginTop: 14, fontSize: 13 }}>
        New vendor or venue owner? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
