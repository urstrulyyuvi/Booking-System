const express = require('express');
const router = express.Router();
const { bookingValidation, createBooking, updateBookingStatus, getBookingsByEmail } = require('../controllers/bookingController');

router.get('/', getBookingsByEmail);
router.post('/', bookingValidation, createBooking);
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
