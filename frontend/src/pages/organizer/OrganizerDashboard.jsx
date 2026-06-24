import { useEffect, useMemo, useState } from "react";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const emptyEvent = { title: "", description: "", date: "", time: "", budgetPlanned: 0, budgetActual: 0, status: "planned" };
const fmtDate = (d) => d ? new Date(d).toLocaleDateString() : "—";
const getId = (x) => typeof x === "string" ? x : x?._id || x?.id || "";

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [guests, setGuests] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [eventForm, setEventForm] = useState(emptyEvent);
  const [filters, setFilters] = useState({ location: "", minSize: "", date: "" });
  const [taskForm, setTaskForm] = useState({ event: "", title: "", description: "", dueDate: "", status: "pending" });
  const [guestForm, setGuestForm] = useState({ event: "", name: "", email: "", rsvpStatus: "pending", dietaryPreference: "" });
  const [bookingForm, setBookingForm] = useState({ venue: "", eventType: "Conference", date: "", expectedAttendees: 100, specialRequirements: "" });

  const loadAll = async () => {
    setLoading(true); setError("");
    try {
      const [ev, ve, vv, bo, ta, gu, inv, fb] = await Promise.allSettled([
        api.get("/events"), api.get("/venues"), api.get("/vendors"), api.get("/bookings"), api.get("/tasks"), api.get("/guests"), api.get("/invoices"), api.get("/feedback")
      ]);
      if (ev.status === "fulfilled") setEvents(ev.value.data);
      if (ve.status === "fulfilled") setVenues(ve.value.data);
      if (vv.status === "fulfilled") setVendors(vv.value.data);
      if (bo.status === "fulfilled") setBookings(bo.value.data);
      if (ta.status === "fulfilled") setTasks(ta.value.data);
      if (gu.status === "fulfilled") setGuests(gu.value.data);
      if (inv.status === "fulfilled") setInvoices(inv.value.data);
      if (fb.status === "fulfilled") setFeedback(fb.value.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const stats = useMemo(() => {
    const planned = events.reduce((s, e) => s + Number(e.budget?.planned || 0), 0);
    const actual = events.reduce((s, e) => s + Number(e.budget?.actual || 0), 0);
    const arrived = guests.filter((g) => g.checkedIn).length;
    const avgRating = feedback.length ? (feedback.reduce((s, f) => s + Number(f.rating || 0), 0) / feedback.length).toFixed(1) : "—";
    return { planned, actual, arrived, avgRating };
  }, [events, guests, feedback]);

  async function saveEvent(e) {
    e.preventDefault();
    try {
      const payload = { title: eventForm.title, description: eventForm.description, date: eventForm.date, time: eventForm.time, status: eventForm.status, organizer: user.id, budget: { planned: Number(eventForm.budgetPlanned), actual: Number(eventForm.budgetActual) } };
      await api.post("/events", payload);
      setEventForm(emptyEvent); setNotice("Event created"); loadAll();
    } catch (err) { setError(err.response?.data?.message || err.message); }
  }

  async function updateEvent(id, patch) {
    await api.put(`/events/${id}`, patch); setNotice("Event updated"); loadAll();
  }

  async function searchVenues(e) {
    e?.preventDefault();
    const { data } = await api.get("/venues", { params: filters });
    setVenues(data);
  }

  async function sendBooking(e) {
    e.preventDefault();
    const venue = venues.find((v) => v._id === bookingForm.venue);
    if (!venue) return setError("Choose a venue first");
    try {
      await api.post("/bookings", { ...bookingForm, owner: getId(venue.owner), organizer: user.id, expectedAttendees: Number(bookingForm.expectedAttendees) });
      setBookingForm({ venue: "", eventType: "Conference", date: "", expectedAttendees: 100, specialRequirements: "" });
      setNotice("Booking request sent"); loadAll();
    } catch (err) { setError(err.response?.data?.message || err.message); }
  }

  async function createTask(e) {
    e.preventDefault();
    try { await api.post("/tasks", taskForm); setTaskForm({ event: "", title: "", description: "", dueDate: "", status: "pending" }); setNotice("Task created"); loadAll(); }
    catch (err) { setError(err.response?.data?.message || err.message); }
  }

  async function createGuest(e) {
    e.preventDefault();
    try { await api.post("/guests", guestForm); setGuestForm({ event: "", name: "", email: "", rsvpStatus: "pending", dietaryPreference: "" }); setNotice("Guest added"); loadAll(); }
    catch (err) { setError(err.response?.data?.message || err.message); }
  }

  async function checkIn(id) { await api.put(`/guests/${id}/checkin`); setNotice("Guest checked in"); loadAll(); }
  async function taskStatus(id, status) { await api.put(`/tasks/${id}`, { status }); loadAll(); }

  return <div className="dash">
    <div className="page-head"><div><p className="eyebrow">Organizer workspace</p><h1>Event Management Dashboard</h1><p>Manage the main user journeys from one connected React interface.</p></div><button onClick={loadAll}>Refresh</button></div>
    {notice && <div className="notice" onClick={() => setNotice("")}>{notice}</div>}
    {error && <div className="error" onClick={() => setError("")}>{error}</div>}
    <div className="tabs">{["overview", "events", "venues", "tasks", "guests", "vendors", "budget", "feedback"].map(t => <button key={t} onClick={() => setTab(t)} className={tab === t ? "active" : ""}>{t}</button>)}</div>
    {loading && <p>Loading data...</p>}

    {tab === "overview" && <section>
      <div className="stat-grid">
        <Stat label="Events" value={events.length} /><Stat label="Open tasks" value={tasks.filter(t => t.status !== "done").length} /><Stat label="Guests checked in" value={`${stats.arrived}/${guests.length}`} /><Stat label="Avg. rating" value={stats.avgRating} />
      </div>
      <div className="grid two"><Card title="Upcoming events"><EventTable events={events.slice(0,5)} onUpdate={updateEvent} /></Card><Card title="Recent bookings"><BookingTable bookings={bookings.slice(0,5)} /></Card></div>
    </section>}

    {tab === "events" && <section className="grid two"><Card title="Create event"><form onSubmit={saveEvent} className="form"><Input label="Title" value={eventForm.title} onChange={v=>setEventForm({...eventForm,title:v})} required/><Input label="Description" value={eventForm.description} onChange={v=>setEventForm({...eventForm,description:v})}/><Input label="Date" type="date" value={eventForm.date} onChange={v=>setEventForm({...eventForm,date:v})} required/><Input label="Time" type="time" value={eventForm.time} onChange={v=>setEventForm({...eventForm,time:v})}/><Input label="Planned budget" type="number" value={eventForm.budgetPlanned} onChange={v=>setEventForm({...eventForm,budgetPlanned:v})}/><Input label="Actual expense" type="number" value={eventForm.budgetActual} onChange={v=>setEventForm({...eventForm,budgetActual:v})}/><button className="btn">Create event</button></form></Card><Card title="Events"><EventTable events={events} onUpdate={updateEvent} /></Card></section>}

    {tab === "venues" && <section className="grid two"><Card title="Search venues"><form onSubmit={searchVenues} className="form"><Input label="Location" value={filters.location} onChange={v=>setFilters({...filters,location:v})}/><Input label="Minimum size sqm" type="number" value={filters.minSize} onChange={v=>setFilters({...filters,minSize:v})}/><Input label="Date" type="date" value={filters.date} onChange={v=>setFilters({...filters,date:v})}/><button className="btn">Search</button></form><VenueCards venues={venues} choose={id => setBookingForm({...bookingForm, venue:id})}/></Card><Card title="Send booking request"><form onSubmit={sendBooking} className="form"><Select label="Venue" value={bookingForm.venue} onChange={v=>setBookingForm({...bookingForm,venue:v})} options={venues.map(v=>[v._id, `${v.name} - ${v.location}`])}/><Input label="Event type" value={bookingForm.eventType} onChange={v=>setBookingForm({...bookingForm,eventType:v})}/><Input label="Date" type="date" value={bookingForm.date} onChange={v=>setBookingForm({...bookingForm,date:v})} required/><Input label="Expected attendees" type="number" value={bookingForm.expectedAttendees} onChange={v=>setBookingForm({...bookingForm,expectedAttendees:v})}/><Input label="Special requirements" value={bookingForm.specialRequirements} onChange={v=>setBookingForm({...bookingForm,specialRequirements:v})}/><button className="btn">Send request</button></form><BookingTable bookings={bookings}/></Card></section>}

    {tab === "tasks" && <section className="grid two"><Card title="Create task"><form onSubmit={createTask} className="form"><Select label="Event" value={taskForm.event} onChange={v=>setTaskForm({...taskForm,event:v})} options={events.map(e=>[e._id,e.title])}/><Input label="Task title" value={taskForm.title} onChange={v=>setTaskForm({...taskForm,title:v})} required/><Input label="Description" value={taskForm.description} onChange={v=>setTaskForm({...taskForm,description:v})}/><Input label="Due date" type="date" value={taskForm.dueDate} onChange={v=>setTaskForm({...taskForm,dueDate:v})}/><button className="btn">Create task</button></form></Card><Card title="Task board"><TaskTable tasks={tasks} onStatus={taskStatus}/></Card></section>}

    {tab === "guests" && <section className="grid two"><Card title="Add guest"><form onSubmit={createGuest} className="form"><Select label="Event" value={guestForm.event} onChange={v=>setGuestForm({...guestForm,event:v})} options={events.map(e=>[e._id,e.title])}/><Input label="Name" value={guestForm.name} onChange={v=>setGuestForm({...guestForm,name:v})} required/><Input label="Email" type="email" value={guestForm.email} onChange={v=>setGuestForm({...guestForm,email:v})} required/><Select label="RSVP" value={guestForm.rsvpStatus} onChange={v=>setGuestForm({...guestForm,rsvpStatus:v})} options={["pending","attending","not attending","maybe"].map(x=>[x,x])}/><Input label="Dietary preference" value={guestForm.dietaryPreference} onChange={v=>setGuestForm({...guestForm,dietaryPreference:v})}/><button className="btn">Add guest</button></form></Card><Card title="Guest list and check-in"><GuestTable guests={guests} onCheckIn={checkIn}/></Card></section>}

    {tab === "vendors" && <section><Card title="Vendor directory"><div className="cards">{vendors.map(v=><div className="mini-card" key={v._id}><h3>{v.companyName}</h3><p>{v.suppliesOffered?.join(", ") || "Services"}</p><p>{v.mainLocation || "No location"}</p><small>{v.contactInfo?.email || v.user?.email}</small></div>)}</div></Card></section>}

    {tab === "budget" && <section className="grid two"><Card title="Budget summary"><div className="stat-grid"><Stat label="Planned" value={`${stats.planned} EGP`} /><Stat label="Actual" value={`${stats.actual} EGP`} /><Stat label="Difference" value={`${stats.planned - stats.actual} EGP`} /></div><EventTable events={events} onUpdate={updateEvent}/></Card><Card title="Invoices"><InvoiceTable invoices={invoices}/></Card></section>}

    {tab === "feedback" && <section className="grid two"><Card title="Feedback analytics"><div className="stat-grid"><Stat label="Responses" value={feedback.length}/><Stat label="Average rating" value={stats.avgRating}/></div><FeedbackTable feedback={feedback}/></Card><Card title="Report notes"><p>This page supports the required event reporting flow by showing attendance, ratings, and comments collected from the database.</p></Card></section>}
  </div>;
}

function Stat({ label, value }) { return <div className="stat"><span>{label}</span><b>{value}</b></div>; }
function Card({ title, children }) { return <div className="card"><h2>{title}</h2>{children}</div>; }
function Input({ label, value, onChange, type="text", required=false }) { return <label><span>{label}</span><input type={type} value={value} required={required} onChange={e=>onChange(e.target.value)} /></label>; }
function Select({ label, value, onChange, options }) { return <label><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)} required><option value="">Choose...</option>{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>; }

function EventTable({ events, onUpdate }) { return <div className="table-wrap"><table><thead><tr><th>Event</th><th>Date</th><th>Status</th><th>Budget</th><th>Action</th></tr></thead><tbody>{events.map(e=><tr key={e._id}><td><b>{e.title}</b><br/><small>{e.description}</small></td><td>{fmtDate(e.date)} {e.time}</td><td><span className="pill">{e.status}</span></td><td>{e.budget?.planned || 0} / {e.budget?.actual || 0}</td><td><select value={e.status} onChange={x=>onUpdate(e._id,{status:x.target.value})}><option>planned</option><option>ongoing</option><option>completed</option><option>cancelled</option></select></td></tr>)}</tbody></table></div>; }
function BookingTable({ bookings }) { return <div className="table-wrap"><table><thead><tr><th>Venue</th><th>Type/date</th><th>Guests</th><th>Status</th></tr></thead><tbody>{bookings.map(b=><tr key={b._id}><td>{b.venue?.name || "Venue"}</td><td>{b.eventType}<br/><small>{fmtDate(b.date)}</small></td><td>{b.expectedAttendees}</td><td><span className="pill">{b.status}</span></td></tr>)}</tbody></table></div>; }
function TaskTable({ tasks, onStatus }) { return <div className="table-wrap"><table><thead><tr><th>Task</th><th>Event</th><th>Due</th><th>Status</th></tr></thead><tbody>{tasks.map(t=><tr key={t._id}><td>{t.title}<br/><small>{t.description}</small></td><td>{t.event?.title || "—"}</td><td>{fmtDate(t.dueDate)}</td><td><select value={t.status} onChange={e=>onStatus(t._id,e.target.value)}><option>not assigned</option><option>pending</option><option>in progress</option><option>done</option></select></td></tr>)}</tbody></table></div>; }
function GuestTable({ guests, onCheckIn }) { return <div className="table-wrap"><table><thead><tr><th>Guest</th><th>Event</th><th>RSVP</th><th>Check-in</th></tr></thead><tbody>{guests.map(g=><tr key={g._id}><td>{g.name}<br/><small>{g.email}</small></td><td>{g.event?.title || "—"}</td><td>{g.rsvpStatus}</td><td>{g.checkedIn ? "Checked in" : <button onClick={()=>onCheckIn(g._id)}>Check in</button>}</td></tr>)}</tbody></table></div>; }
function InvoiceTable({ invoices }) { return <div className="table-wrap"><table><thead><tr><th>Event</th><th>Total</th><th>Status</th></tr></thead><tbody>{invoices.map(i=><tr key={i._id}><td>{i.eventName || i.event?.title || "—"}</td><td>{i.total}</td><td><span className="pill">{i.status}</span></td></tr>)}</tbody></table></div>; }
function FeedbackTable({ feedback }) { return <div className="table-wrap"><table><thead><tr><th>Event</th><th>Rating</th><th>Comment</th></tr></thead><tbody>{feedback.map(f=><tr key={f._id}><td>{f.event?.title || "—"}</td><td>{f.rating}/5</td><td>{f.comment}</td></tr>)}</tbody></table></div>; }
function VenueCards({ venues, choose }) { return <div className="cards">{venues.map(v=><div key={v._id} className="mini-card"><h3>{v.name}</h3><p>{v.location} · {v.capacity} guests · {v.sizeSqm} sqm</p><p>{v.amenities?.join(", ")}</p><b>{v.pricePerDay} EGP/day</b><button onClick={()=>choose(v._id)}>Use for request</button></div>)}</div>; }
