import { useState } from "react";
import axios from "axios";
import "./Feedback.css";
import GuestNavbar from "../../components/GuestNavbar";


export default function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/feedback", { feedback })
      .then(() => setSubmitted(true))
      .catch(() => alert("Error sending feedback"));
  };

 return (
  <>
    <GuestNavbar />

    <div className="feedback-container">
      <h1 className="feedback-title">Share Your Thoughts</h1>

      {!submitted ? (
        <form className="feedback-form" onSubmit={handleSubmit}>
          <textarea
            className="feedback-input"
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />

          <button className="feedback-btn" type="submit">
            Submit Feedback
          </button>
        </form>
      ) : (
        <div className="feedback-thanks">
          <h2>Thank you for your feedback!</h2>
          <p>Your thoughts help us improve the event experience.</p>
        </div>
      )}
    </div>
  </>
);
}
