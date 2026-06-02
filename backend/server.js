require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const setupSocket = require("./socket/socketHandler");

const app = express();
const server = http.createServer(app);

// ---------------- SOCKET SETUP ----------------
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

// ---------------- MIDDLEWARE ----------------
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------------- STATIC FILES ----------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------- DATABASE ----------------
connectDB();

// ---------------- ROUTES ----------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/users", require("./routes/users"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/search", require("./routes/search"));

// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow Pro API Running 🚀",
    version: "1.0.0",
    status: "healthy",
    endpoints: {
      auth: "/api/auth",
      projects: "/api/projects",
      tasks: "/api/tasks",
      comments: "/api/comments",
      notifications: "/api/notifications",
      users: "/api/users",
      upload: "/api/upload",
      search: "/api/search",
    },
  });
});

// ---------------- ERROR HANDLER ----------------
app.use(errorHandler);

// ---------------- SOCKET INIT ----------------
setupSocket(io);

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// ---------------- EXPORT ----------------
module.exports = { app, server, io };