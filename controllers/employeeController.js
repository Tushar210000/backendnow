// controllers/employeeController.js
const User = require("../model/user");
// const mongoose=require("mongoose")
const AmbulanceBooking = require("../model/ambulanceBooking");
const ApplyInsuranceApplication = require("../model/applyInsurance");
const JanArogyaApplication = require("../model/janArogyaApplication");
const JanArogyaApply = require("../model/janArogyaApply");
exports.getEmployeeProfile = async (req, res) => {
  try {
    // req.user.id comes from auth middleware after verifying JWT
    const employeeId = req.user.id;

    const employee = await User.findById(employeeId).select("-password");
    if (!employee || employee.role !== "EMPLOYEE") {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee profile fetched successfully",
      profile: employee,
    });
  } catch (error) {
    console.error("Error fetching employee profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};








exports.getEmployeeAppliedUsers = async (req, res) => {
  try {
    const employeeId = req.user._id;

    // Fetch all applications with populated forUser
    const ambulance = await AmbulanceBooking.find({ appliedBy: employeeId }).populate("forUser", "name phone email");
    const insurance = await ApplyInsuranceApplication.find({ appliedBy: employeeId }).populate("forUser", "name phone email");
    const janArogya = await JanArogyaApplication.find({ appliedBy: employeeId }).populate("forUser", "name phone email");
    const janArogyaApply = await JanArogyaApply.find({ appliedBy: employeeId }).populate("forUser", "name phone email");

    // Flatten into desired format
    const appliedUsers = [
      ...ambulance.map(a => ({
        name: a.fullName,
        email: a.email,
        phone: a.phone,
        service: "AmbulanceBooking"
      })),
      ...insurance.map(i => ({
        name: i.fullName,
        email: i.email,
        phone: i.phone,
        service: "ApplyInsurance"
      })),
      ...janArogya.map(j => ({
        name: j.name,
        email: j.email,
        phone: j.phone,
        service: "JanArogyaApplication"
      })),
      ...janArogyaApply.map(j => ({
        name: j.name,
        email: j.email,
        phone: j.phone,
        service: "JanArogyaApply"
      }))
    ];

    res.json({ success: true, appliedUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



