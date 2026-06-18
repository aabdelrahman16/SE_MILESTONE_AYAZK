import { BrowserRouter, Routes, Route } from "react-router-dom";
import RSVP from "./pages/Guest/RSVP";
import Messages from "./pages/Guest/Messages";
import Feedback from "./pages/Guest/Feedback";
import StaffLogin from "./pages/Staff/StaffLogin";
import StaffDashboard from "./pages/Staff/StaffDashboard";
import StaffRSVPs from "./pages/Staff/StaffRSVPs";
import StaffFeedback from "./pages/Staff/StaffFeedback";
import StaffCheckIn from "./pages/Staff/StaffCheckIn";
import StaffAnnouncements from "./pages/Staff/StaffAnnouncements";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/guest/rsvp" element={<RSVP />} />
        <Route path="/guest/messages" element={<Messages />} />
        <Route path="/guest/feedback" element={<Feedback />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/rsvps" element={<StaffRSVPs />} />
        <Route path="/staff/feedback" element={<StaffFeedback />} />
        <Route path="/staff/checkin" element={<StaffCheckIn />} />
        <Route path="/staff/announcements" element={<StaffAnnouncements />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
