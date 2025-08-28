// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true, required: true },
  password: String,
  aadhar: { type: String, unique: true },
  email: { type: String, unique: true, sparse: true }, // for admins/employees
  employeeId: { type: String, unique: true, sparse: true }, // for employees
  role: {
    type: String,
    enum: ["USER", "ADMIN", "EMPLOYEE"],
    default: "USER"
  },
 appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  forUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isVerified: { type: Boolean, default: true },
  verified:{type:Boolean,default:false},
  joinDate:{type:String},
  department:{type:String},
  address:{type:String},
  position:{type:String},
  // 🔹 Admin profile fields
  full_name: { type: String },
  
  language: { type: String },
  time_zone: { type: String },
  nationality: { type: String },
  merchant_id: { type: String },
  profile_pic: { type: String } // file URL
});

module.exports = mongoose.model("User", userSchema);
