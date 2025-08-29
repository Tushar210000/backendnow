const attendance=require("../model/attendance")

// ✅ Check In
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const today = new Date().setHours(0,0,0,0);

    let record = await attendance.findOne({ user: userId, date: today });

    if (record) {
      return res.status(400).json({ message: "Already checked in today." });
    }

    const now = new Date();
    const status = now.getHours() > 9 ? "late" : "present";

    record = await attendance.create({
      user: userId,
      date: today,
      checkIn: now,
      status
    });

    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Check Out
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().setHours(0,0,0,0);

    let record = await attendance.findOne({ user: userId, date: today });

    if (!record || !record.checkIn) {
      return res.status(400).json({ message: "No check-in found for today." });
    }
    if (record.checkOut) {
      return res.status(400).json({ message: "Already checked out." });
    }

    const now = new Date();
    const diffMs = now - record.checkIn;
    const diffHrs = diffMs / (1000 * 60 * 60);

    let status = record.status;
    if (diffHrs < 8) status = "early-departure";

    record.checkOut = now;
    record.workingHours = diffHrs.toFixed(2);
    record.status = status;

    await record.save();

    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Apply Leave
exports.applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, type, reason } = req.body;

    const leaveDate = new Date(date).setHours(0,0,0,0);

    let record = await attendance.findOne({ user: userId, date: leaveDate });

    if (record) {
      return res.status(400).json({ message: "Attendance/leave already exists for this date." });
    }

    record = await attendance.create({
      user: userId,
      date: leaveDate,
      status: type === "paid" ? "paid-leave" : "unpaid-leave",
      leaveReason: reason
    });

    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Attendance History
exports.getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await attendance.find({ user: userId })
      .sort({ date: -1 });

    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
