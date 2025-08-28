const janArogyaApply = require("../model/janArogyaApply");
const JanArogyaApply = require("../model/janArogyaApply");

// Internal builder (for self or on behalf)
const buildApplication = async (req, res, forUserId) => {
  try {
    const { 
      name, aadhaar, phone, address, businessType, investmentCapacity,
      proposedLocation, franchiseCategory, category, relevantExperience
    } = req.body;
     const existing=await janArogyaApply.findOne({forUserId})
     if(existing){
      return res.status(400).json({message:"User Already Applied"})
     }
    const application = new JanArogyaApply({
      name,
      email,
      phone,
      address,
      businessType,
      investmentCapacity,
      proposedLocation,
      franchiseCategory,
      category,
      relevantExperience,

      idProof: req.body.idProof || "",
      qualificationCertificate: req.body.qualificationCertificate || "",
      financialStatement: req.body.financialStatement || "",

      appliedBy: req.user._id,    // who submitted (employee or user)
      forUser: forUserId          // who it is for
    });

    await application.save();
    return res.status(201).json({ message: "Application submitted successfully", application });

  } catch (err) {
    return res.status(500).json({ message: "Error applying", error: err.message });
  }
};

// USER applies for themselves
exports.userApply = (req, res) => buildApplication(req, res, req.user._id);

// EMPLOYEE applies on behalf of a user
exports.employeeApply = (req, res) => {
  if (!req.body.forUserId) {
    return res.status(400).json({ message: "forUserId is required when employee applies" });
  }
  return buildApplication(req, res, req.body.forUserId);
};

// USER: Get own applications (applications for them)
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await JanArogyaApply.find({ forUser: req.user._id })
      .populate("appliedBy", "name email role");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user applications", error: err.message });
  }
};

// EMPLOYEE: Get applications they submitted for users
exports.getEmployeeApplications = async (req, res) => {
  try {
    const apps = await JanArogyaApply.find({ appliedBy: req.user._id })
      .populate("forUser", "name email");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee applications", error: err.message });
  }
};

// ADMIN: Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await JanArogyaApply.find()
      .populate("appliedBy forUser", "name email role");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all applications", error: err.message });
  }
};

// ADMIN: Update status
exports.updateJanArogyaStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await JanArogyaApply.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Status updated successfully", app });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};
