const { Compressor } = require("mongodb");
const AmbulanceBooking = require("../model/ambulanceBooking");

// Common booking logic
const buildBooking = async (req, res, forUserId) => {
  try {
    const userId = req.user._id;

    const {
      fullName,
      phone,
      email,
      hospitalPreference,
      appointmentDate,
      preferredTime,
      message
    } = req.body;

    const booking = new AmbulanceBooking({
      fullName,
      phone,
      email,
      hospitalPreference,
      appointmentDate,
      preferredTime,
      message,
      appliedBy: userId,
      forUser: forUserId,
    });

    await booking.save();
    res.status(201).json({ message: "Booking submitted", booking });
  } catch (err) {
    res.status(500).json({ message: "Error creating booking", error: err.message });
  }
};

// USER books for self
exports.userBookAmbulance = async (req, res) => {
  return buildBooking(req, res, req.user._id);
};


exports.bookAmbulanceForUser = async (req, res) => {
  const { forUserId } = req.body;
  if (!forUserId) return res.status(400).json({ message: "forUserId is required" });
  return buildBooking(req, res, forUserId);
};

// USER: Get own bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await AmbulanceBooking.find({ forUser: req.user.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
};

// EMPLOYEE: Get bookings they submitted
exports.getEmployeeBookings = async (req, res) => {
  try {
    const bookings = await AmbulanceBooking.find({ appliedBy: req.user.id })
      .populate("forUser", "name email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
};

// ADMIN: Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await AmbulanceBooking.find()
      .populate("appliedBy forUser", "name role email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all bookings", error: err.message });
  }
};

// ADMIN: Update booking status
exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const booking = await AmbulanceBooking.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ message: "Status updated", booking });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};

// USER or EMPLOYEE: Withdraw booking
exports.withdrawBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await AmbulanceBooking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const isOwner = String(booking.appliedBy) === req.user.id;
    const isForUser = String(booking.forUser) === req.user.id;

    if (!isOwner && !isForUser) {
      return res.status(403).json({ message: "Not authorized to withdraw this booking" });
    }

    booking.status = "WITHDRAWN";
    await booking.save();
    res.json({ message: "Booking withdrawn", booking });
  } catch (err) {
    res.status(500).json({ message: "Error withdrawing booking", error: err.message });
  }
};
// ADMIN: Delete a booking
exports.deleteBookingByAdmin = async (req, res) => {
  const { _id } = req.params;
   console.log(_id)
  try {
    const booking = await AmbulanceBooking.findByIdAndDelete(_id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully by Admin", booking });
  } catch (err) {
    res.status(500).json({ message: "Error deleting booking", error: err.message });
  }
};
