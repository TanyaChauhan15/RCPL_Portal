import { useEffect, useState } from "react";
import "../App.css";

export default function Finance({ setPage, handleLogout, currentUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dashboards, setDashboards] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/dashboards")
      .then((res) => res.json())
      .then((data) => {
        const financeDashboards = data.filter(
          (dash) => dash.department?.toLowerCase() === "finance"
        );
        setDashboards(financeDashboards);
      })
      .catch((error) => console.error("Failed to fetch Finance dashboards:", error));
  }, []);

  const filteredDashboards = dashboards.filter((dash) =>
    dash.dashboard_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sales-page">
      <div className="sales-nav">
        <img src="/assets/reliance-logo.png" alt="Reliance Logo" className="sales-nav-logo" />

        <div className="nav-title">
          <p>Home <span>›</span> Finance</p>
          <h1><span>Finance</span> Dashboards</h1>
          <small>Budgets, P&L and financial reporting dashboards</small>
        </div>

        <div className="sales-nav-right">
          <span>Welcome, {currentUser?.name || "Admin"}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="sales-tools">
        <input
          type="text"
          placeholder="Search Finance dashboards"
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
          <h2>Finance Dashboards</h2>
          <p className="category-subtitle">Budgets, P&L and finance reports</p>

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
        <p className="no-results">No Finance dashboards found.</p>
      )}

      <div className="footer">© 2026 Reliance Consumer Products Limited.</div>
    </div>
  );
}   