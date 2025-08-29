const mongoose=require('mongoose')
const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference your User schema
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  checkIn: {
    type: Date,
  },
  checkOut: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["present", "late", "absent", "early-departure", "paid-leave", "unpaid-leave"],
    default: "present",
  },
  workingHours: {
    type: Number,
    default: 0,
  },
  leaveReason: {
    type: String,
  }
}, { timestamps: true });

attendanceSchema.index({ user: 1, date: 1 }, { unique: true }); 
// Prevent duplicate records for the same day

module.exports = mongoose.model('Attendance', attendanceSchema);