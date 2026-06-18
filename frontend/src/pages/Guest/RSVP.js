import { useState } from "react";
import GuestNavbar from "../../components/GuestNavbar";
import "./RSVP.css";
import axios from "axios";

export default function GuestRSVP() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [eventName, setEventName] = useState("");
  const [status, setStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5000/rsvp", {
      name,
      email,
      status,
      eventName
    })
    .then(() => setSubmitted(true))
    .catch(() => alert("Error sending RSVP"));
  };

  return (
    <>
      <GuestNavbar />

      <div className="response-container">
        <h1 className="response-title">RSVP</h1>

        {!submitted ? (
          <form onSubmit={handleSubmit}>

            {/* NEW INPUTS */}
            <input
              type="text"
              className="rsvp-input"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              className="rsvp-input"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="text"
              className="rsvp-input"
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />

            <div className="options-container">
              <button
                type="button"
                className={`option-btn ${status === "Attending" ? "selected" : ""}`}
                onClick={() => setStatus("Attending")}
              >
                Yes, I will be there
              </button>

              <button
                type="button"
                className={`option-btn ${status === "Not Attending" ? "selected" : ""}`}
                onClick={() => setStatus("Not Attending")}
              >
                No, I can’t make it
              </button>

              <button
                type="button"
                className={`option-btn ${status === "Maybe" ? "selected" : ""}`}
                onClick={() => setStatus("Maybe")}
              >
                I’m not sure yet
              </button>
            </div>

            <button
              className="submit-btn"
              type="submit"
              disabled={!status}
            >
              Submit Response
            </button>
          </form>
        ) : (
          <div>
            <h2>Thank you for your response!</h2>
            <p>We appreciate your time.</p>
          </div>
        )}
      </div>
    </>
  );
}
