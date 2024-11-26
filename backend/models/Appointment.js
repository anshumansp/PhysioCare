const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

// Add virtual for user's email
appointmentSchema.virtual('email', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  get: function(user) {
    return user ? user.email : null;
  }
});

// Add index for faster queries
appointmentSchema.index({ userId: 1, date: 1 });

// Add validation for date to ensure it's not in the past
appointmentSchema.pre('save', function(next) {
  if (this.date < new Date()) {
    next(new Error('Appointment date cannot be in the past'));
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
