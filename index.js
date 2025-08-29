const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { connectDB } = require('./connection');

const authRoutes = require("./routes/authRoutes");
const popupRoutes = require("./routes/PopupRouter");
const contactRoutes = require("./routes/contactRoutes");
const janArogyaRoutes = require("./routes/janArogyaRoutes");
const ambulanceRoutes = require("./routes/ambulanceBookingRoutes");
const applyInsurance = require('./routes/applyInsuranceRoutes');
const applyKendra = require('./routes/janArogyaApplyRoutes');
const statesRouter = require("./routes/statesRouter");
const userRoutes = require("./routes/userProfile");
const employeeRoutes = require("./routes/employeeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashBoardRoutes=require("./routes/dashBoardRoutes")
const profileRoutes=require("./routes/profileRoutes")
const attendanceRoutes=require("./routes/attendanceRoutes")

const app = express();
const PORT = process.env.PORT || 8000;



const allowedOrigins = ["http://localhost:3000", "http://localhost:3001","https://frontend-five-iota-49.vercel.app"];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// DB Connection
connectDB();

// Routes
app.use("/api/popup", popupRoutes);
app.use("/api/states/", statesRouter);
// app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services/janarogya", janArogyaRoutes);
app.use("/api/services/ambulance-booking", ambulanceRoutes);
app.use("/api/services/apply-insurance", applyInsurance);
app.use("/api/services/apply-kendra", applyKendra);
app.use("/api/employee", employeeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin",dashBoardRoutes)
app.use("/api/u",profileRoutes)
app.use("/api/attendance",attendanceRoutes)
// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
