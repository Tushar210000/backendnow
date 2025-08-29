const express=require('express')
// import { auth } from 'firebase-admin';
const { applyLeave, checkIn, checkOut, getAttendanceHistory } =require( '../controllers/attendanceController');
const {auth, authorizeRole } =require('../middlewares/auth');





const router = express.Router();

router.post("/check-in", auth,authorizeRole("EMPLOYEE"), checkIn);
router.post("/check-out", auth,authorizeRole("EMPLOYEE"), checkOut);
router.post("/leave", auth,authorizeRole("EMPLOYEE"), applyLeave);
router.get("/history", auth,authorizeRole("EMPLOYEE"), getAttendanceHistory);

module.exports = router;