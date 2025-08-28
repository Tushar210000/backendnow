const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getProfile, updateProfile,createEmployee,getAllEmployees } = require("../controllers/adminController");
const { auth, authorizeRole } = require("../middlewares/auth");




// Route -> GET /api/users/employees
router.get("/employees",auth,authorizeRole("ADMIN") ,getAllEmployees);
// Admin creates employee
router.post("/create", auth,authorizeRole("ADMIN"), createEmployee);
// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Get Profile
router.get("/profile", auth, authorizeRole('ADMIN'), getProfile);

// Update Profile with image upload
router.put("/update-profile", auth, authorizeRole('ADMIN'), upload.single("profile_pic"), updateProfile);

module.exports = router;
