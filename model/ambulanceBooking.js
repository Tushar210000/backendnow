const mongoose = require('mongoose');

const ambulanceBookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  hospitalPreference: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  preferredTime: { type: String, required: true },
  message: { type: String }, 
//   area: { type: String, required: true }, // fixed
  appliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  forUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN'],
    default: 'PENDING',
  },
}, { timestamps: true });

module.exports = mongoose.model('AmbulanceBooking', ambulanceBookingSchema);
