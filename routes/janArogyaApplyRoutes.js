const express = require("express");
const router = express.Router();
const { 
  userApply, 
  employeeApply, 
  getMyApplications, 
  getEmployeeApplications, 
  getAllApplications, 
  updateJanArogyaStatus 
} = require("../controllers/janArogyaApplyController");

const { auth, authorizeRole } = require("../middlewares/auth");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// USER applies for themselves
router.post(
  "/apply",
  auth,
  authorizeRole("USER"),
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "qualificationCertificate", maxCount: 1 },
    { name: "financialStatement", maxCount: 1 }
  ]),
  userApply
);

// EMPLOYEE applies on behalf of user
router.post(
  "/employee/apply",
  auth,
  authorizeRole("EMPLOYEE"),
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "qualificationCertificate", maxCount: 1 },
    { name: "financialStatement", maxCount: 1 }
  ]),
  employeeApply
);

// USER: Get their own apps
router.get("/my-applications", auth, authorizeRole("USER"), getMyApplications);

// EMPLOYEE: Get apps they submitted
router.get("/employee/applications", auth, authorizeRole("EMPLOYEE"), getEmployeeApplications);

// ADMIN: Get all
router.get("/admin/all", auth, authorizeRole("ADMIN"), getAllApplications);

// ADMIN: Update status
router.put("/:id/status", auth, authorizeRole("ADMIN"), updateJanArogyaStatus);

module.exports = router;
