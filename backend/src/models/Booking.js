const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: [true, 'Expert ID is required'] },
  expertName: { type: String, required: true },
  userName: { type: String, required: [true, 'Your name is required'], trim: true },
  userEmail: { type: String, required: [true, 'Email is required'], trim: true, lowercase: true },
  userPhone: { type: String, required: [true, 'Phone number is required'], trim: true },
  date: { type: String, required: [true, 'Date is required'] },
  timeSlot: { type: String, required: [true, 'Time slot is required'] },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed'], default: 'Pending' },
}, { timestamps: true });

bookingSchema.index({ userEmail: 1 });
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
