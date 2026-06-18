import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api.js";

const fallbackData = {
  events: [
    {
      id: 1,
      name: "Avery & Jordan Wedding",
      date: "2026-06-18",
      time: "16:00",
      venue: "Harbor Glass Hall",
      status: "Today",
      guests: 184,
      arrived: 62,
      budget: 28500,
      actual: 24180,
    },
    {
      id: 2,
      name: "Northstar Product Launch",
      date: "2026-06-24",
      time: "18:30",
      venue: "Union Loft",
      status: "Upcoming",
      guests: 260,
      arrived: 0,
      budget: 42000,
      actual: 17650,
    },
    {
      id: 3,
      name: "Founders Dinner",
      date: "2026-07-02",
      time: "19:00",
      venue: "Cedar Room",
      status: "Upcoming",
      guests: 72,
      arrived: 0,
      budget: 12000,
      actual: 4300,
    },
  ],
  tasks: [
    { id: 101, eventId: 1, title: "Confirm floral delivery", owner: "Nina", due: "10:30", status: "In progress", priority: "High" },
    { id: 102, eventId: 1, title: "Print final seating cards", owner: "Omar", due: "12:00", status: "Not started", priority: "High" },
    { id: 103, eventId: 1, title: "Audio check with band", owner: "Jules", due: "14:15", status: "Done", priority: "Medium" },
    { id: 104, eventId: 2, title: "Approve stage lighting quote", owner: "Maya", due: "Tomorrow", status: "In progress", priority: "Medium" },
    { id: 105, eventId: 3, title: "Send menu notes to chef", owner: "Nina", due: "Jun 26", status: "Not started", priority: "Low" },
  ],
  reminders: [
    { id: 1, text: "Venue deposit for Northstar Launch is due today", time: "09:00" },
    { id: 2, text: "Guest RSVP export scheduled for 15:00", time: "15:00" },
    { id: 3, text: "Review AV invoice before approval", time: "17:30" },
  ],
  budgetLines: [
    { id: 1, category: "Venue", planned: 9000, actual: 9000 },
    { id: 2, category: "Catering", planned: 11200, actual: 9800 },
    { id: 3, category: "Decor", planned: 3600, actual: 2900 },
    { id: 4, category: "Entertainment", planned: 2500, actual: 2100 },
    { id: 5, category: "Staffing", planned: 2200, actual: 380 },
  ],
  floorItems: [
    { id: "stage", label: "Stage", type: "stage", x: 12, y: 10 },
    { id: "dance", label: "Dance Floor", type: "floor", x: 42, y: 30 },
    { id: "bar", label: "Bar", type: "service", x: 76, y: 16 },
    { id: "table-a", label: "Table A", type: "table", x: 20, y: 58 },
    { id: "table-b", label: "Table B", type: "table", x: 49, y: 60 },
    { id: "table-c", label: "Table C", type: "table", x: 76, y: 58 },
  ],
};

export default function OrganizerDashboard() {
  const location = useLocation();
  const [data, setData] = useState(fallbackData);
  const [activeView, setActiveView] = useState(viewFromPath(location.pathname));
  const [filter, setFilter] = useState("All");
  const [syncStatus, setSyncStatus] = useState("Demo data");
  const selectedEvent = data.events[0];

  useEffect(() => {
    syncData();
  }, []);

  useEffect(() => {
    setActiveView(viewFromPath(location.pathname));
  }, [location.pathname]);

  const filteredTasks =
    filter === "All" ? data.tasks : data.tasks.filter((task) => task.status === filter);

  const budgetTotals = useMemo(
    () =>
      data.budgetLines.reduce(
        (totals, item) => ({
          planned: totals.planned + item.planned,
          actual: totals.actual + item.actual,
        }),
        { planned: 0, actual: 0 }
      ),
    [data.budgetLines]
  );

  async function syncData() {
    setSyncStatus("Syncing");
    try {
      const [eventsRes, tasksRes] = await Promise.all([
        api.get("/events"),
        api.get("/tasks"),
      ]);

      setData((current) => ({
        ...current,
        events: Array.isArray(eventsRes.data) && eventsRes.data.length ? eventsRes.data : current.events,
        tasks: Array.isArray(tasksRes.data) && tasksRes.data.length ? tasksRes.data : current.tasks,
      }));
      setSyncStatus("Connected");
    } catch {
      setSyncStatus("Demo data");
    }
  }

  function updateTaskStatus(id, status) {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === id ? { ...task, status } : task)),
    }));
  }

  function updateActualCost(id, actual) {
    setData((current) => ({
      ...current,
      budgetLines: current.budgetLines.map((line) =>
        line.id === id ? { ...line, actual: Number(actual) || 0 } : line
      ),
    }));
  }

  return (
    <div className="organizer-page">
      <div className="organizer-header">
        <div>
          <p className="muted">Organizer workspace</p>
          <h1>Event command center</h1>
        </div>
        <div className="organizer-actions">
          <span className="badge active">{syncStatus}</span>
          <button className="btn secondary" onClick={syncData}>Sync APIs</button>
        </div>
      </div>

      <div className="organizer-tabs">
        <button className={activeView === "dashboard" ? "active" : ""} onClick={() => setActiveView("dashboard")}>Dashboard</button>
        <button className={activeView === "planning" ? "active" : ""} onClick={() => setActiveView("planning")}>Planning</button>
        <button className={activeView === "budget" ? "active" : ""} onClick={() => setActiveView("budget")}>Budget</button>
        <button className={activeView === "layout" ? "active" : ""} onClick={() => setActiveView("layout")}>Floor Plan</button>
      </div>

      {activeView === "dashboard" && (
        <>
          <div className="organizer-metrics">
            <Metric label="Today events" value={data.events.filter((event) => event.status === "Today").length} />
            <Metric label="Guests arrived" value={`${selectedEvent.arrived}/${selectedEvent.guests}`} />
            <Metric label="Open tasks" value={data.tasks.filter((task) => task.status !== "Done").length} />
            <Metric label="Budget used" value={`${Math.round((selectedEvent.actual / selectedEvent.budget) * 100)}%`} />
          </div>

          <div className="organizer-grid">
            <section className="card">
              <h2>Today's Events</h2>
              {data.events.map((event) => (
                <div className="organizer-list-row" key={event.id}>
                  <div>
                    <strong>{event.name}</strong>
                    <p>{event.venue} - {event.date} - {event.time}</p>
                  </div>
                  <span className={`badge ${event.status === "Today" ? "active" : "pending"}`}>{event.status}</span>
                </div>
              ))}
            </section>

            <section className="card">
              <h2>Reminders</h2>
              {data.reminders.map((reminder) => (
                <div className="reminder-row" key={reminder.id}>
                  <strong>{reminder.time}</strong>
                  <span>{reminder.text}</span>
                </div>
              ))}
            </section>
          </div>

          <TaskBoard tasks={data.tasks} updateTaskStatus={updateTaskStatus} />
        </>
      )}

      {activeView === "planning" && (
        <>
          <div className="organizer-grid">
            <section className="card">
              <h2>Upcoming Events</h2>
              <table>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Venue</th>
                    <th>Guests</th>
                  </tr>
                </thead>
                <tbody>
                  {data.events.map((event) => (
                    <tr key={event.id}>
                      <td>{event.name}</td>
                      <td>{event.date}</td>
                      <td>{event.venue}</td>
                      <td>{event.guests}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="card">
              <h2>Task Filters</h2>
              <label>Status</label>
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option>All</option>
                <option>Not started</option>
                <option>In progress</option>
                <option>Done</option>
              </select>
              <label>Search</label>
              <input placeholder="Search by event, owner, or task" />
            </section>
          </div>

          <section className="card">
            <h2>Task List</h2>
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Owner</th>
                  <th>Due</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.owner}</td>
                    <td>{task.due}</td>
                    <td>{task.priority}</td>
                    <td>
                      <StatusSelect task={task} updateTaskStatus={updateTaskStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}

      {activeView === "budget" && (
        <>
          <div className="organizer-metrics">
            <Metric label="Planned budget" value={currency(budgetTotals.planned)} />
            <Metric label="Actual expenses" value={currency(budgetTotals.actual)} />
            <Metric label="Remaining" value={currency(budgetTotals.planned - budgetTotals.actual)} />
          </div>

          <section className="card">
            <h2>Planned vs Actual</h2>
            {data.budgetLines.map((line) => {
              const percent = Math.min(100, Math.round((line.actual / line.planned) * 100));
              return (
                <div className="budget-line" key={line.id}>
                  <div>
                    <strong>{line.category}</strong>
                    <span>{currency(line.actual)} of {currency(line.planned)}</span>
                  </div>
                  <div className="progress"><span style={{ width: `${percent}%` }} /></div>
                  <input
                    type="number"
                    value={line.actual}
                    onChange={(event) => updateActualCost(line.id, event.target.value)}
                  />
                </div>
              );
            })}
          </section>
        </>
      )}

      {activeView === "layout" && (
        <LayoutDesigner
          selectedEvent={selectedEvent}
          floorItems={data.floorItems}
          setData={setData}
        />
      )}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="card metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TaskBoard({ tasks, updateTaskStatus }) {
  return (
    <div className="task-board">
      {["Not started", "In progress", "Done"].map((status) => (
        <section className="card" key={status}>
          <h2>{status}</h2>
          {tasks.filter((task) => task.status === status).map((task) => (
            <div className="task-card" key={task.id}>
              <strong>{task.title}</strong>
              <p>{task.owner} - Due {task.due}</p>
              <StatusSelect task={task} updateTaskStatus={updateTaskStatus} />
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function StatusSelect({ task, updateTaskStatus }) {
  return (
    <select value={task.status} onChange={(event) => updateTaskStatus(task.id, event.target.value)}>
      <option>Not started</option>
      <option>In progress</option>
      <option>Done</option>
    </select>
  );
}

function LayoutDesigner({ selectedEvent, floorItems, setData }) {
  const [dragging, setDragging] = useState(null);

  function moveItem(event) {
    if (!dragging) return;
    const board = event.currentTarget.getBoundingClientRect();
    const x = Math.max(4, Math.min(92, ((event.clientX - board.left) / board.width) * 100));
    const y = Math.max(5, Math.min(88, ((event.clientY - board.top) / board.height) * 100));

    setData((current) => ({
      ...current,
      floorItems: current.floorItems.map((item) => (item.id === dragging ? { ...item, x, y } : item)),
    }));
  }

  function exportLayout() {
    const payload = JSON.stringify({ event: selectedEvent.name, items: floorItems }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedEvent.name.toLowerCase().replaceAll(" ", "-")}-layout.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="card">
      <div className="layout-header">
        <div>
          <h2>{selectedEvent.venue} Floor Plan</h2>
          <p className="muted">Drag tables, service points, and stage areas into place.</p>
        </div>
        <button className="btn secondary" onClick={exportLayout}>Export Layout</button>
      </div>

      <div
        className="floor-plan"
        onDragOver={(event) => {
          event.preventDefault();
          moveItem(event);
        }}
        onDrop={() => setDragging(null)}
      >
        <div className="floor-entrance">Main entrance</div>
        {floorItems.map((item) => (
          <button
            draggable
            className={`floor-item ${item.type}`}
            key={item.id}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            onDragStart={() => setDragging(item.id)}
            onDragEnd={() => setDragging(null)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function viewFromPath(pathname) {
  if (pathname.includes("/planning")) return "planning";
  if (pathname.includes("/budget")) return "budget";
  if (pathname.includes("/layout")) return "layout";
  return "dashboard";
}
