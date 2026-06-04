import "../App.css";

export default function Home({ setPage, currentUser }) {
  const isAdmin = currentUser?.role === "ADMIN";

  const hasAccess = (departmentName) => {
  if (isAdmin) return true;

  return currentUser?.departments?.includes(departmentName);
};

const handleDepartmentClick = (dept) => {
  if (!dept.page) {
    alert(`${dept.name} module will be available soon.`);
    return;
  }

  if (!hasAccess(dept.accessName)) {
    alert("You don't have access to this department.");
    return;
  }

  setPage(dept.page);
};

  const departments = [
  {
    name: "Finance",
    subtitle: "Budgets & P&L",
    icon: "💰",
    className: "dept-finance",
    page: "finance",
    accessName: "Finance",
  },
  {
    name: "Sales*",
    subtitle: "Revenue & pipeline",
    icon: "📈",
    className: "dept-sales",
    page: "sales",
    accessName: "Sales",
  },
  {
    name: "Supply Chain*",
    subtitle: "Logistics & inventory",
    icon: "🚚",
    className: "dept-supply",
    page: "supply",
    accessName: "Supply Chain",
  },
  {
    name: "HR*",
    subtitle: "People & workforce",
    icon: "👥",
    className: "dept-hr",
    page: "hr",
    accessName: "HR",
  },
  {
    name: "After Sales",
    subtitle: "Support & service",
    icon: "🛠",
    className: "dept-after",
    page: "after-sales",
    accessName: "After Sales",
  },
];

  return (
    <div className="home-page">
      <div className="home-header">
       <div className="home-header-logo-box">
          <img
            src="/assets/reliance-logo.png"
            alt="Reliance Logo"
            className="home-header-logo"
          />
        </div>

        <div className="home-header-right">
          <span>Welcome, {currentUser?.name || "Admin"}</span>

         {isAdmin && (
           <button
             className="admin-header-btn"
             onClick={() => setPage("admin")}>
             ⚙ Admin Panel
           </button>
          )}

          
        </div>
      </div>

      <div className="hub-container">
        <div className="hub-center">
          <img
            src="/assets/reliance-logo.png"
            alt="Reliance Logo"
            className="hub-center-logo"
          />
        </div>

        {departments.map((dept, index) => (
          <button
            key={index}
            className={`hub-card ${dept.className}`}
            onClick={() => handleDepartmentClick(dept)}
          >
            <span className="hub-icon">{dept.icon}</span>
            <h3>{dept.name}</h3>
            <p>{dept.subtitle}</p>
          </button>
        ))}

        <div className="hub-line line-to-finance"></div>
        <div className="hub-line line-to-sales"></div>
        <div className="hub-line line-to-supply"></div>
        <div className="hub-line line-to-hr"></div>
        <div className="hub-line line-to-after"></div>
      </div>
    </div>
  );
}