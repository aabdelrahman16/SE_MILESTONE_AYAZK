import { useState, useEffect } from "react";
import axios from "axios";
import "./StaffAnnouncements.css";

export default function StaffAnnouncements() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/messages")
      .then(res => setMessages(res.data));
  }, []);

  const sendAnnouncement = () => {
    if (!text.trim()) return;

    axios.post("http://localhost:5000/messages", { text })
      .then(() => {
        setMessages(prev => [
          { text, date: new Date().toLocaleString() },
          ...prev
        ]);
        setText("");
      });
  };

  return (
    <div className="announce-container">
      <h1 className="announce-title">Send Announcement</h1>

      <div className="announce-box">
        <textarea
          className="announce-input"
          placeholder="Write your announcement..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button className="announce-btn" onClick={sendAnnouncement}>
          Send
        </button>
      </div>

      <h2 className="announce-subtitle">Previous Announcements</h2>

      <div className="announce-list">
        {messages.map((m, i) => (
          <div key={i} className="announce-item">
            <p className="announce-text">{m.text}</p>
            <span className="announce-date">{m.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
