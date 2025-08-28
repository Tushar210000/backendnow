const bcrypt = require("bcryptjs");
const User = require("../model/user");

// Get Profile

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "EMPLOYEE" });

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { full_name, email, phone, address, language, time_zone, nationality, merchant_id } = req.body;

    const updateFields = { full_name, email, phone, address, language, time_zone, nationality, merchant_id };

    if (req.file) {
      updateFields.profile_pic = `/uploads/${req.file.filename}`;
    }

    const updatedAdmin = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully", user: updatedAdmin });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};
exports.createEmployee = async (req, res) => {
  try {
    // Ensure only Admin can create employees
   

    const { name, phone, password, employeeId, email ,joinDate,department,position,address} = req.body;

    if (!name || !phone || !password || !employeeId || !email|| !joinDate || !department || !position || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if employeeId already exists
    const existingEmployeeId = await User.findOne({ employeeId });
    if (existingEmployeeId) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee with role EMPLOYEE
    const newEmployee = new User({
      name,
      phone,
      password: hashedPassword,
      role: "EMPLOYEE",
      employeeId,
      email,
      verified: true,
      joinDate,
      department,
      address,
      position
    });

    await newEmployee.save();

    res.status(201).json({
      message: "Employee created successfully. Pending admin approval.",
      employee: newEmployee
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};