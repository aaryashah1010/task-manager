require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const authRoutes = require("../backend/routes/authRoutes");
const userRoutes = require("../backend/routes/userRoutes");
const taskRoutes = require("../backend/routes/taskRoutes");
const reportRoutes = require("../backend/routes/reportRoutes");
const app = express();

// Security HTTP headers
app.use(helmet());
// Compression
app.use(compression());
// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Middleware to handle CORS
app.use(
  cors({
    // In production, set CLIENT_URL in your .env for security
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Connect to DB
connectDB();

// Parse JSON bodies
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
