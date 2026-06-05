const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access token required",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid token",
      });
    }

    req.user = user;
    next();
  });
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get("/", (req, res) => {
  res.send("RCPL Backend is running");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("active", true)
    .single();

  if (error || !user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  delete user.password;

  res.json({
    message: "Login successful",
    token,
    user,
  });
});



app.get("/dashboards", async (req, res) => {
  const { data, error } = await supabase
    .from("dashboards")
    .select("*")
    .eq("active", true);

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.get("/categories", async (req, res) => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("department");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.post("/categories", authenticateToken, async (req, res) => {
  const { department, category_name } = req.body;

  const { data, error } = await supabase
    .from("categories")
    .insert([
      {
        department,
        category_name,
        active: true,
      },
    ])
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.put("/categories/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { department, category_name } = req.body;

  const { data, error } = await supabase
    .from("categories")
    .update({
      department,
      category_name,
    })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.delete("/categories/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("categories")
    .update({
      active: false,
    })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

// GET ALL ACTIVE USERS
app.get("/users", authenticateToken, async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ message: "Failed to fetch users", error });
  }

  res.json(data);
});

// ADD USER
app.post("/users", authenticateToken, async (req, res) => {
  const {
    name,
    email,
    username,
    password,
    departments,
    manager,
    role,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name,
        email,
        username,
        password: hashedPassword,
        departments,
        manager,
        role,
        active: true,
      },
    ])
    .select();

  if (error) {
    return res.status(500).json({ message: "Failed to add user", error });
  }

  delete data[0].password;
  res.json(data[0]);
});

// EDIT USER
app.put("/users/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("users")
    .update(req.body)
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ message: "Failed to update user", error });
  }

  res.json(data[0]);
});

// DELETE / DISABLE USER
app.delete("/users/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("users")
    .update({ active: false })
    .eq("id", id);

  if (error) {
    return res.status(500).json({ message: "Failed to delete user", error });
  }

  res.json({ message: "User disabled successfully" });
});

app.post("/dashboards", authenticateToken, async (req, res) => {
  const {
    dashboard_name,
    department,
    category,
    platform,
    dashboard_url,
    owner_name,
  } = req.body;

  const { data, error } = await supabase
    .from("dashboards")
    .insert([
      {
        dashboard_name,
        department,
        category,
        platform,
        dashboard_url,
        owner_name,
        active: true,
      },
    ])
    .select();

  if (error) {
    return res.status(500).json({ message: "Failed to add dashboard", error });
  }

  res.json(data[0]);
});

app.put("/dashboards/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("dashboards")
    .update(req.body)
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ message: "Failed to update dashboard", error });
  }

  res.json(data[0]);
});

app.delete("/dashboards/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("dashboards")
    .update({ active: false })
    .eq("id", id);

  if (error) {
    return res.status(500).json({ message: "Failed to delete dashboard", error });
  }

  res.json({ message: "Dashboard deleted successfully" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});