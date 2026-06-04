import { useEffect, useState } from "react";
import "../App.css";

export default function HR({ setPage, handleLogout, currentUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dashboards, setDashboards] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/dashboards")
      .then((res) => res.json())
      .then((data) => {
        const hrDashboards = data.filter(
          (dash) => dash.department?.toLowerCase() === "hr"
        );
        setDashboards(hrDashboards);
      })
      .catch((error) => console.error("Failed to fetch HR dashboards:", error));
  }, []);

  const filteredDashboards = dashboards.filter((dash) =>
    dash.dashboard_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sales-page">
      <div className="sales-nav">
        <img src="/assets/reliance-logo.png" alt="Reliance Logo" className="sales-nav-logo" />

        <div className="nav-title">
          <p>Home <span>›</span> HR</p>
          <h1><span>HR</span> Dashboards</h1>
          <small>Workforce management & operational dashboards</small>
        </div>

        <div className="sales-nav-right">
          <span>Welcome, {currentUser?.name || "Admin"}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="sales-tools">
        <input
          type="text"
          placeholder="Search HR dashboards"
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button className="back-btn" onClick={() => setPage("home")}>
          ← Back to Home
        </button>
      </div>

      <div className="sales-grid">
        <div className="sales-card hr-card">
          <h2>HR & Operations</h2>
          <p className="category-subtitle">User onboarding, workforce & operational dashboards</p>

          <div className="dashboard-links">
            {filteredDashboards.map((dash) => (
              <a
                key={dash.id}
                href={dash.dashboard_url}
                target="_blank"
                rel="noreferrer"
                className="dashboard-link"
              >
                <div className="dashboard-info">
                  <span>{dash.dashboard_name}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {filteredDashboards.length === 0 && (
        <p className="no-results">No HR dashboards found.</p>
      )}

      <div className="footer">© 2026 Reliance Consumer Products Limited.</div>
    </div>
  );
}