import { useState } from "react";
import axios from "axios";
import "./StaffLogin.css";
import { useNavigate } from "react-router-dom";


export default function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleLogin = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/staff/login", { email, password })
      .then(res => {
        if (res.data.success) {
          sessionStorage.setItem("staffLoggedIn", "true");
          navigate("/staff/dashboard");
        } else {
          setError("Invalid email or password");
        }
      })
      .catch(() => setError("Server error"));
  };

  return (
    <div className="staff-login-container">
      <h1 className="staff-login-title">Staff Login</h1>

      <form className="staff-login-form" onSubmit={handleLogin}>
        <input
          type="email"
          className="staff-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="staff-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="staff-error">{error}</p>}

        <button className="staff-login-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
