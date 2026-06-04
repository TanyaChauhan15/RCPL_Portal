import { useEffect, useState } from "react";
import "../App.css";

export default function Sales({ setPage, handleLogout, currentUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dashboards, setDashboards] = useState([]);

  useEffect(() => {
    fetch("https://rcpl-portal.onrender.com/dashboards")
      .then((res) => res.json())
      .then((data) => {
        const salesDashboards = data.filter(
          (dash) => dash.department?.toLowerCase() === "sales"
        );

        setDashboards(salesDashboards);
      })
      .catch((error) => {
        console.error("Failed to fetch dashboards:", error);
      });
  }, []);

  const groupedCategories = dashboards.reduce((acc, dash) => {
    const category = dash.category || "Others";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(dash);
    return acc;
  }, {});

  const categories = Object.keys(groupedCategories).map((category) => ({
    title: category,
    subtitle: `${category} dashboards`,
    dashboards: groupedCategories[category],
  }));

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      dashboards: category.dashboards.filter((dash) =>
        dash.dashboard_name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(
      (category) =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.dashboards.length > 0
    );

  return (
    <div className="sales-page">
      <div className="sales-nav">
        <img
          src="/assets/reliance-logo.png"
          alt="Reliance Logo"
          className="sales-nav-logo"
        />

        <div className="nav-title">
          <p>
            Home <span>›</span> Sales
          </p>

          <h1>
            <span>Sales</span> Dashboards
          </h1>
        </div>

        <div className="sales-nav-right">
          <span>Welcome, {currentUser?.name || "Admin"}</span>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="sales-tools">
        <input
          type="text"
          placeholder="Search dashboards"
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button className="back-btn" onClick={() => setPage("home")}>
          ← Back to Home
        </button>
      </div>

      <div className="sales-grid">
        {filteredCategories.map((item, index) => (
          <div className="sales-card" key={index}>
            <h2>{item.title}</h2>

            <p className="category-subtitle">{item.subtitle}</p>

            <div className="dashboard-links">
              {item.dashboards.map((dash) => (
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
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <p className="no-results">No dashboards found.</p>
      )}

      <div className="footer">
        © 2026 Reliance Consumer Products Limited.
      </div>
    </div>
  );
}