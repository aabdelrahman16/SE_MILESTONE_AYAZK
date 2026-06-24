import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      if (user.role === "vendor") nav("/vendor/requests");
      else if (user.role === "venue_owner") nav("/venue/listings");
      else nav("/organizer/dashboard");
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      const status = err.response?.status;

      if (status === 401) {
        setError("Invalid email or password. Use the seeded demo password: password123");
      } else if (status === 404) {
        setError("Login API was not found. Make sure the backend is running on http://localhost:5001");
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot reach the backend. Start the backend first, then try again.");
      } else {
        setError(backendMessage || err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Login</h1>

      <form onSubmit={submit}>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="organizer@demo.com"
          autoComplete="email"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password123"
          autoComplete="current-password"
        />

        {error && <div className="error">{error}</div>}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: 14, fontSize: 13 }}>
        New user? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
