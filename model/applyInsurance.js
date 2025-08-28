const mongoose = require("mongoose");

const applyInsuranceSchema = new mongoose.Schema({
  fullName: String,
  dob: String,
  gender: String,
  phone:String,
  email: String,
  phoneNumber: String,
  aadhaarNumber: String,
  address: String,
  state: String,
  district: String,
  pincode: String,
  insuranceType: String,

  id_proof: String,
  passport_photo: String,
  medical_documents: String,
  income_certificate: String,

  appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  forUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "WITHDRAWN"],
    default: "PENDING"
  }
}, { timestamps: true });

module.exports = mongoose.model("ApplyInsuranceApplication", applyInsuranceSchema);
