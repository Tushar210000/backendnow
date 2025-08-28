const mongoose = require("mongoose");

const janArogyaApplySchema = new mongoose.Schema({
  name: { type: String, required: true },
  aadhaar: { type: String, required: true,unique:true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  businessType: { type: String, required: true },
  investmentCapacity: { type: String, required: true },
  proposedLocation: { type: String, required: true },
  franchiseCategory: { type: String, enum: ["S1", "S2", "S3"], required: true },
  category: { type: String, required: true },
  relevantExperience: { type: String },

  // File uploads as string paths
  idProof: { type: String },
  qualificationCertificate: { type: String },
  financialStatement: { type: String },

  // Status for admin
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

  appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    forUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("JanArogyaApply", janArogyaApplySchema);
