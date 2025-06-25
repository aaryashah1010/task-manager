    require("dotenv").config();
    const express = require("express");

    const cors = require("cors");  // ✅ Fix: use parentheses, not square brackets
    const path = require("path");  // ✅ Fix: use parentheses
    const { connect } = require("http2");
    const connectDB = require("./config/db");
    const authRoutes=require("../backend/routes/authRoutes")
    const userRoutes=require("../backend/routes/userRoutes")
    const taskRoutes=require("../backend/routes/taskRoutes")
    const reportRoutes=require("../backend/routes/reportRoutes")
    const app = express();

    // Middleware to handle CORS
    app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"], // ✅ Capitalization fix
    })
    );

    //connect to db

    connectDB();

    // Middleware
    app.use(express.json());

    // Routes would go here...
    app.use("/api/auth",authRoutes);
    app.use("/api/users",userRoutes)
    app.use("/api/tasks",taskRoutes)
    app.use("/api/reports",reportRoutes)

    //server upload folder
    app.use("/uploads",express.static(path.join(__dirname,"uploads")))
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
