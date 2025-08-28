const ApplyInsurance = require("../model/applyInsurance");

// Common apply logic
const buildInsuranceApplication = async (req, res, forUserId) => {
  try {
    const userId = req.user._id;
    const {
      fullName, dob, gender, email, phoneNumber,
      aadhaarNumber, address, state, district,
      pincode, insuranceType
    } = req.body;
     const existing=await ApplyInsurance.findOne({aadhaarNumber})
     if(existing){
      return res.status(400).json({message:"Already Applied For Insurance Please Wait For Admin"})
     }
    const app = new ApplyInsurance({
      fullName,
      dob,
      gender,
      email,
      phoneNumber,
      aadhaarNumber,
      address,
      state,
      district,
      pincode,
      insuranceType,
      appliedBy: userId,
      forUser: forUserId,
      id_proof: req.files?.id_proof?.[0]?.buffer,
      passport_photo: req.files?.passport_photo?.[0]?.buffer,
      medical_documents: req.files?.medical_documents?.[0]?.buffer,
      income_certificate: req.files?.income_certificate?.[0]?.buffer,
    });

    await app.save();
    res.status(201).json({ message: "Insurance application submitted", app });
  } catch (err) {
    res.status(500).json({ message: "Error applying for insurance", error: err.message });
  }
};

// USER applies for self
exports.userApplyInsurance = async (req, res) => {
  return buildInsuranceApplication(req, res, req.user.id);
};

// EMPLOYEE applies for others
exports.applyInsurance = async (req, res) => {
  const { forUserId } = req.body;
  if (!forUserId) return res.status(400).json({ message: "forUserId is required" });
  return buildInsuranceApplication(req, res, forUserId);
};

// USER: Get own applications
exports.getUserInsuranceApplications = async (req, res) => {
  try {
    const apps = await ApplyInsurance.find({ forUser: req.user.id });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user insurance applications", error: err.message });
  }
};

// EMPLOYEE: Get applications submitted by them
exports.getEmployeeInsuranceApplications = async (req, res) => {
  try {
    const apps = await ApplyInsurance.find({ appliedBy: req.user.id })
      .populate("forUser", "name email");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching insurance applications", error: err.message });
  }
};

// ADMIN: Get all
exports.getAllInsuranceApplications = async (req, res) => {
  try {
    const apps = await ApplyInsurance.find()
      .populate("appliedBy forUser", "name role email");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all insurance applications", error: err.message });
  }
};

// ADMIN: Update status
exports.updateInsuranceApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const app = await ApplyInsurance.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ message: "Insurance status updated", app });
  } catch (err) {
    res.status(500).json({ message: "Error updating insurance status", error: err.message });
  }
};

// EMPLOYEE/USER: Withdraw application
exports.withdrawInsuranceApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const app = await ApplyInsurance.findById(id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    const isOwner = String(app.appliedBy) === req.user.id;
    const isForUser = String(app.forUser) === req.user.id;

    if (!isOwner && !isForUser) {
      return res.status(403).json({ message: "Not authorized to withdraw this insurance application" });
    }

    app.status = "WITHDRAWN";
    await app.save();
    res.json({ message: "Insurance application withdrawn", app });
  } catch (err) {
    res.status(500).json({ message: "Error withdrawing insurance application", error: err.message });
  }
};
