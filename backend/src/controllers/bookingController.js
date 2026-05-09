const { validationResult, body } = require('express-validator');
const Expert = require('../models/Expert');
const Booking = require('../models/Booking');

const bookingValidation = [
  body('expertId').notEmpty().withMessage('Expert ID is required'),
  body('userName').trim().notEmpty().withMessage('Your name is required'),
  body('userEmail').trim().isEmail().withMessage('A valid email is required'),
  body('userPhone').trim().notEmpty().withMessage('Phone number is required').matches(/^[\d\s\-\+\(\)]{7,15}$/).withMessage('Please enter a valid phone number'),
  body('date').notEmpty().withMessage('Date is required'),
  body('timeSlot').notEmpty().withMessage('Time slot is required'),
];

const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation Error', errors: errors.array().map(e => e.msg) });
    }

    const { expertId, userName, userEmail, userPhone, date, timeSlot, notes } = req.body;

    // ATOMIC: prevent double booking via findOneAndUpdate
    const updatedExpert = await Expert.findOneAndUpdate(
      { _id: expertId, availableSlots: { $elemMatch: { date, time: timeSlot, isBooked: false } } },
      { $set: { 'availableSlots.$.isBooked': true } },
      { new: true }
    );

    if (!updatedExpert) {
      return res.status(409).json({ success: false, message: 'This time slot is no longer available. It may have been booked by someone else.' });
    }

    const booking = await Booking.create({ expertId, expertName: updatedExpert.name, userName, userEmail, userPhone, date, timeSlot, notes: notes || '' });

    const io = req.app.get('io');
    if (io) { io.emit('slotBooked', { expertId, date, time: timeSlot }); }

    res.status(201).json({ success: true, message: 'Booking created successfully!', data: booking });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!booking) { return res.status(404).json({ success: false, message: 'Booking not found' }); }
    res.json({ success: true, message: `Booking status updated to ${status}`, data: booking });
  } catch (error) {
    next(error);
  }
};

const getBookingsByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) { return res.status(400).json({ success: false, message: 'Email query parameter is required' }); }
    const bookings = await Booking.find({ userEmail: email.toLowerCase() }).sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

module.exports = { bookingValidation, createBooking, updateBookingStatus, getBookingsByEmail };
