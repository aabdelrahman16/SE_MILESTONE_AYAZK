import { useEffect, useState } from "react";
import axios from "axios";
import "./Messages.css";
import GuestNavbar from "../../components/GuestNavbar";

export default function Messages() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
  axios.get("http://localhost:5000/messages")
    .then(res => setMessages(res.data))
    .catch(() => console.log("Error fetching messages"));
}, []);

return (
  <>
      <GuestNavbar />

  <div className="messages-container">
    <h1 className="messages-title">Event Announcements</h1>

    <div className="messages-list">
      {messages.map((msg, index) => (
        <div key={index} className="message-card">
          <p className="message-text">{msg.text}</p>
          <span className="message-date">{msg.date}</span>
        </div>
      ))}
    </div>
  </div>
  </>
);

}