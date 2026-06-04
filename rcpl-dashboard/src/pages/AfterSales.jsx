import { useEffect, useState } from "react";
import "../App.css";

export default function AfterSales({ setPage, handleLogout, currentUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dashboards, setDashboards] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/dashboards")
      .then((res) => res.json())
      .then((data) => {
        const afterSalesDashboards = data.filter(
          (dash) => dash.department?.toLowerCase() === "after sales"
        );
        setDashboards(afterSalesDashboards);
      })
      .catch((error) => console.error("Failed to fetch After Sales dashboards:", error));
  }, []);

  const filteredDashboards = dashboards.filter((dash) =>
    dash.dashboard_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sales-page">
      <div className="sales-nav">
        <img src="/assets/reliance-logo.png" alt="Reliance Logo" className="sales-nav-logo" />

        <div className="nav-title">
          <p>Home <span>›</span> After Sales</p>
          <h1><span>After</span> Sales</h1>
          <small>Support, service and after-sales dashboards</small>
        </div>

        <div className="sales-nav-right">
          <span>Welcome, {currentUser?.name || "Admin"}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="sales-tools">
        <input
          type="text"
          placeholder="Search After Sales dashboards"
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
          <h2>After Sales Dashboards</h2>
          <p className="category-subtitle">Support and service reports</p>

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
        <p className="no-results">No After Sales dashboards found.</p>
      )}

      <div className="footer">© 2026 Reliance Consumer Products Limited.</div>
    </div>
  );
}