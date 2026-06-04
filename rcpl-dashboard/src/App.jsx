import { useState } from "react";
import "./App.css";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Sales from "./pages/Sales";
import HR from "./pages/HR";
import Supply from "./pages/Supply";
import Admin from "./pages/Admin";
import Finance from "./pages/Finance";
import AfterSales from "./pages/AfterSales";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid Credentials");
        return;
      }

      setCurrentUser(data.user);
      setLoggedIn(true);
      setPage("home");
    } catch (error) {
      alert("Backend server is not running");
      console.error(error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setPage("home");
    setCurrentUser(null);
    setEmail("");
    setPassword("");
  };

  if (!loggedIn) {
    return (
      <Login
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    );
  }

  if (page === "home") {
    return <Home setPage={setPage} currentUser={currentUser} />;
  }

  if (page === "sales") {
    return (
      <Sales
        setPage={setPage}
        handleLogout={handleLogout}
        currentUser={currentUser}
      />
    );
  }

  if (page === "hr") {
    return (
      <HR
        setPage={setPage}
        handleLogout={handleLogout}
        currentUser={currentUser}
      />
    );
  }

  if (page === "supply") {
    return (
      <Supply
        setPage={setPage}
        handleLogout={handleLogout}
        currentUser={currentUser}
      />
    );
  }

  if (page === "admin") {

    if (currentUser?.role !== "ADMIN") {
    return <Home setPage={setPage} currentUser={currentUser} />;
    }

   return (
    <Admin
      setPage={setPage}
      handleLogout={handleLogout}
      currentUser={currentUser}
    />
   );
  }

  if (page === "finance") {
  return (
    <Finance
      setPage={setPage}
      handleLogout={handleLogout}
      currentUser={currentUser}
    />
  );
  }

 if (page === "after-sales") {
  return (
    <AfterSales
      setPage={setPage}
      handleLogout={handleLogout}
      currentUser={currentUser}
    />
  );
 }

  return null;
}