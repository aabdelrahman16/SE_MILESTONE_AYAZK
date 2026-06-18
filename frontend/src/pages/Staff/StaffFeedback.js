import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StaffFeedback.css";

export default function StaffFeedback() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("staffLoggedIn");
    if (!loggedIn) {
      navigate("/staff/login");
      return;
    }

    axios.get("http://localhost:5000/staff/feedback")
      .then(res => {
        setFeedback(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="feedback-container">
      <h1 className="feedback-title">Guest Feedback</h1>

      {loading && <p>Loading...</p>}

      {!loading && (
        <ul className="feedback-list">
          {feedback.map((f, index) => (
            <li key={index} className="feedback-item">
              <p>{f.feedback}</p>
              <span className="feedback-date">
                {new Date(f.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
