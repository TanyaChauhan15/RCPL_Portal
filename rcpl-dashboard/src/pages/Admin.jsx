import { useEffect, useState } from "react";
import "../App.css";

export default function Admin({ setPage, handleLogout, currentUser }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [dashboards, setDashboards] = useState([]);
  const [users, setUsers] = useState([]);

  const [categories, setCategories] = useState([]);

  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const [categoryForm, setCategoryForm] = useState({
  department: "",
  category_name: "",
  });

  const [editingDashboardId, setEditingDashboardId] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);

  const [form, setForm] = useState({
    dashboard_name: "",
    department: "",
    category: "",
    platform: "",
    dashboard_url: "",
    owner_name: "",
  });

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    department: "",
    role: "USER",
  });

  const fetchDashboards = async () => {
    const res = await fetch("http://localhost:5000/dashboards");
    const data = await res.json();
    setDashboards(data);
  };

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/users");
    const data = await res.json();
    setUsers(data);
  };

  const fetchCategories = async () => {
  const res = await fetch("http://localhost:5000/categories");
  const data = await res.json();
  setCategories(data);
 };

  useEffect(() => {
    fetchDashboards();
    fetchUsers();
    fetchCategories();
  }, []);

  const resetDashboardForm = () => {
    setForm({
      dashboard_name: "",
      department: "",
      category: "",
      platform: "",
      dashboard_url: "",
      owner_name: "",
    });
    setEditingDashboardId(null);
  };

  const resetUserForm = () => {
    setUserForm({
      name: "",
      email: "",
      username: "",
      password: "",
      department: "",
      role: "USER",
    });
    setEditingUserId(null);
  };

  const saveDashboard = async () => {
    if (!form.dashboard_name || !form.department || !form.category || !form.platform || !form.dashboard_url) {
      alert("Please fill all required dashboard fields");
      return;
    }

    const url = editingDashboardId
      ? `http://localhost:5000/dashboards/${editingDashboardId}`
      : "http://localhost:5000/dashboards";

    const method = editingDashboardId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert(editingDashboardId ? "Dashboard Updated" : "Dashboard Added");
      resetDashboardForm();
      fetchDashboards();
    } else {
      alert("Something went wrong");
    }
  };

  const editDashboard = (dash) => {
    setEditingDashboardId(dash.id);
    setForm({
      dashboard_name: dash.dashboard_name || "",
      department: dash.department || "",
      category: dash.category || "",
      platform: dash.platform || "",
      dashboard_url: dash.dashboard_url || "",
      owner_name: dash.owner_name || "",
    });
  };

  const deleteDashboard = async (id) => {
    if (!window.confirm("Delete this dashboard?")) return;

    await fetch(`http://localhost:5000/dashboards/${id}`, {
      method: "DELETE",
    });

    fetchDashboards();
  };

  const saveUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.username || !userForm.password || !userForm.department || !userForm.role) {
      alert("Please fill all user fields");
      return;
    }

    const url = editingUserId
      ? `http://localhost:5000/users/${editingUserId}`
      : "http://localhost:5000/users";

    const method = editingUserId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...userForm,
        category: "",
        manager: "Admin",
      }),
    });

    if (res.ok) {
      alert(editingUserId ? "User Updated" : "User Added");
      resetUserForm();
      fetchUsers();
    } else {
      alert("Something went wrong");
    }
  };

  const editUser = (user) => {
    setEditingUserId(user.id);
    setUserForm({
      name: user.name || "",
      email: user.email || "",
      username: user.username || "",
      password: user.password || "",
      department: user.department || "",
      role: user.role || "USER",
    });
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Disable this user?")) return;

    await fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE",
    });

    fetchUsers();
  };

  const saveCategory = async () => {
    const url = editingCategoryId
      ? `http://localhost:5000/categories/${editingCategoryId}`
      : "http://localhost:5000/categories";

    const method = editingCategoryId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
      "Content-Type": "application/json",
    },
      body: JSON.stringify(categoryForm),
    });

    setCategoryForm({
      department: "",
      category_name: "",
    });

    setEditingCategoryId(null);

    fetchCategories();
    };

    const editCategory = (cat) => {
      setEditingCategoryId(cat.id);

      setCategoryForm({
      department: cat.department,
      category_name: cat.category_name,
      });
    };

    const deleteCategory = async (id) => {
      await fetch(
        `http://localhost:5000/categories/${id}`,
       {
        method: "DELETE",
       }
      );

      fetchCategories();
   };

  return (
    <div className="sales-page">
      <div className="sales-nav">
        <img
          src="/assets/reliance-logo.png"
          alt="Reliance Logo"
          className="sales-nav-logo"
        />

        <div className="nav-title">
          <p>Home <span>›</span> Admin</p>
          <h1><span>Admin</span> Panel</h1>
        </div>

        <div className="sales-nav-right">
          <span>Welcome, {currentUser?.name || "Admin"}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="sales-tools">
        <button className="back-btn" onClick={() => setPage("home")}>
          ← Back to Home
        </button>
      </div>

      <div className="admin-tabs">
  <button
    className={activeTab === "dashboard" ? "active-tab" : ""}
    onClick={() => setActiveTab("dashboard")}
  >
    Dashboard Management
  </button>

  <button
    className={activeTab === "user" ? "active-tab" : ""}
    onClick={() => setActiveTab("user")}
  >
    User Management
  </button>

  <button
    className={activeTab === "category" ? "active-tab" : ""}
    onClick={() => setActiveTab("category")}
  >
    Category Management
  </button>
</div>

      {activeTab === "dashboard" && (
        <>
          <div className="admin-card">
            <h2>{editingDashboardId ? "Edit Dashboard" : "Add Dashboard"}</h2>

            <input
              placeholder="Dashboard Name"
              value={form.dashboard_name}
              onChange={(e) =>
                setForm({ ...form, dashboard_name: e.target.value })
              }
            />

            <select
              value={form.department}
              onChange={(e) =>
                setForm({
                  ...form,
                  department: e.target.value,
                  category: "",
                })
              }
            >
              <option value="">Select Department</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Supply Chain">Supply Chain</option>
              <option value="Finance">Finance</option>
              <option value="After Sales">After Sales</option>
            </select>

            <select
              value={form.category}
              disabled={!form.department}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="">Select Category</option>

                  {categories
                    .filter(
                     (cat) =>
                        cat.department === form.department
                    )
                    .map((cat) => (
                      <option
                         key={cat.id}
                         value={cat.category_name}
                        >
                         {cat.category_name}
                      </option>
                ))}

            </select>

            <input
              placeholder="Platform"
              value={form.platform}
              onChange={(e) =>
                setForm({ ...form, platform: e.target.value })
              }
            />

            <input
              placeholder="Dashboard URL"
              value={form.dashboard_url}
              onChange={(e) =>
                setForm({ ...form, dashboard_url: e.target.value })
              }
            />

            <input
              placeholder="Owner"
              value={form.owner_name}
              onChange={(e) =>
                setForm({ ...form, owner_name: e.target.value })
              }
            />

            <button className="admin-add-btn" onClick={saveDashboard}>
              {editingDashboardId ? "Update Dashboard" : "Add Dashboard"}
            </button>

            {editingDashboardId && (
              <button className="back-btn" onClick={resetDashboardForm}>
                Cancel Edit
              </button>
            )}
          </div>

          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Category</th>
                  <th>Platform</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {dashboards.map((dash) => (
                  <tr key={dash.id}>
                    <td>{dash.dashboard_name}</td>
                    <td>{dash.department}</td>
                    <td>{dash.category}</td>
                    <td>{dash.platform}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => editDashboard(dash)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteDashboard(dash.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "user" && (
        <>
          <div className="admin-card">
            <h2>{editingUserId ? "Edit User" : "Add User"}</h2>

            <input
              placeholder="Full Name"
              value={userForm.name}
              onChange={(e) =>
                setUserForm({ ...userForm, name: e.target.value })
              }
            />

            <input
              placeholder="Email"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
            />

            <input
              placeholder="Username"
              value={userForm.username}
              onChange={(e) =>
                setUserForm({ ...userForm, username: e.target.value })
              }
            />

            <input
              placeholder="Password"
              value={userForm.password}
              onChange={(e) =>
                setUserForm({ ...userForm, password: e.target.value })
              }
            />

            <select
              value={userForm.department}
              onChange={(e) =>
                setUserForm({ ...userForm, department: e.target.value })
              }
            >
              <option value="">Select Department</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Supply Chain">Supply Chain</option>
              <option value="Finance">Finance</option>
              <option value="After Sales">After Sales</option>
            </select>

            <select
              value={userForm.role}
              onChange={(e) =>
                setUserForm({ ...userForm, role: e.target.value })
              }
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <button className="admin-add-btn" onClick={saveUser}>
              {editingUserId ? "Update User" : "Add User"}
            </button>

            {editingUserId && (
              <button className="back-btn" onClick={resetUserForm}>
                Cancel Edit
              </button>
            )}
          </div>

          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.department}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => editUser(user)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteUser(user.id)}
                      >
                        Disable
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}


      {activeTab === "category" && (
  <>
    <div className="admin-card">

      <h2>
        {editingCategoryId
          ? "Edit Category"
          : "Add Category"}
      </h2>

      <select
        value={categoryForm.department}
        onChange={(e) =>
          setCategoryForm({
            ...categoryForm,
            department: e.target.value,
          })
        }
      >
        <option value="">
          Select Department
        </option>

        <option value="Sales">Sales</option>
        <option value="HR">HR</option>
        <option value="Supply Chain">
          Supply Chain
        </option>
        <option value="Finance">
          Finance
        </option>
        <option value="After Sales">
          After Sales
        </option>
      </select>

      <input
        placeholder="Category Name"
        value={categoryForm.category_name}
        onChange={(e) =>
          setCategoryForm({
            ...categoryForm,
            category_name: e.target.value,
          })
        }
      />

      <button
        className="admin-add-btn"
        onClick={saveCategory}
      >
        {editingCategoryId
          ? "Update Category"
          : "Add Category"}
      </button>

    </div>

    <div className="admin-table">
      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.department}</td>
              <td>{cat.category_name}</td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() =>
                    editCategory(cat)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteCategory(cat.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)}
    </div>
  );
}