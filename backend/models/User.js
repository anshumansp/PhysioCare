const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Check if model already exists to prevent recompilation
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}));

// Add methods only if they don't exist
if (!User.schema.methods.comparePassword) {
  User.schema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
}

// Add pre-save hook only if it doesn't exist
if (!User.schema._presave) {
  User.schema.pre('save', async function(next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });
}

module.exports = User;
