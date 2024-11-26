const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  notifications: {
    email: {
      appointments: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
      type: Object
    },
    push: {
      appointments: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
      type: Object
    }
  },
  privacy: {
    profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' },
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false }
  },
  appearance: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
    colorScheme: { type: String, enum: ['blue', 'green', 'purple'], default: 'blue' }
  },
  accessibility: {
    reduceMotion: { type: Boolean, default: false },
    highContrast: { type: Boolean, default: false },
    screenReader: { type: Boolean, default: false }
  },
  language: {
    preferred: { type: String, default: 'en' },
    dateFormat: { type: String, enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'], default: 'MM/DD/YYYY' },
    timeFormat: { type: String, enum: ['12h', '24h'], default: '12h' }
  },
  security: {
    twoFactorEnabled: { type: Boolean, default: false },
    loginNotifications: { type: Boolean, default: true },
    sessionTimeout: { type: Number, default: 30 } // minutes
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
