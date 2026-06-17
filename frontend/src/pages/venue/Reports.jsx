import { useEffect, useState } from "react";
import api from "../../services/api.js";

export default function Reports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get("/venues/reports/summary").then((r) => setReport(r.data));
  }, []);

  if (!report) return <p>Loading...</p>;

  const exportCSV = () => {
    const rows = [
      ["Venue", "Total Requests", "Approved", "Booking Rate", "Revenue"],
      ...report.perVenue.map((p) => [
        p.venue, p.totalRequests, p.approved, (p.bookingRate * 100).toFixed(0) + "%", p.revenue,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "venue-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1>Performance & Reporting</h1>
      <div className="row" style={{ marginBottom: 16 }}>
        <div className="card" style={{ flex: 1 }}>
          <p style={{ fontSize: 13, color: "#5a6678" }}>Total Bookings</p>
          <h2>{report.totalBookings}</h2>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <p style={{ fontSize: 13, color: "#5a6678" }}>Total Revenue</p>
          <h2>{report.totalRevenue} EGP</h2>
        </div>
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>Per Venue</h2>
          <button className="btn sm secondary" onClick={exportCSV}>Export CSV</button>
        </div>
        <table>
          <thead>
            <tr><th>Venue</th><th>Requests</th><th>Approved</th><th>Booking Rate</th><th>Revenue</th></tr>
          </thead>
          <tbody>
            {report.perVenue.map((p, i) => (
              <tr key={i}>
                <td>{p.venue}</td>
                <td>{p.totalRequests}</td>
                <td>{p.approved}</td>
                <td>{(p.bookingRate * 100).toFixed(0)}%</td>
                <td>{p.revenue} EGP</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
