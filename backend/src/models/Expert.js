const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
}, { _id: true });

const expertSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Expert name is required'], trim: true },
  category: { type: String, required: [true, 'Category is required'], enum: ['Technology', 'Business', 'Health', 'Education', 'Finance', 'Design'] },
  experience: { type: Number, required: true, min: 0 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },
  availableSlots: [slotSchema],
}, { timestamps: true });

expertSchema.index({ name: 'text' });
expertSchema.index({ category: 1 });

module.exports = mongoose.model('Expert', expertSchema);
