const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: [
      'student', 'industry', 'institute', 'faculty', 'admin',
      'STUDENT', 'INDUSTRY', 'INSTITUTE', 'FACULTY', 'ADMIN'
    ],
    default: 'student',
    lowercase: true
  },
  status: {
    type: String,
    enum: ['active', 'pending_approval', 'suspended'],
    default: 'active'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date
}, { timestamps: true });

// Pre-save hook: Normalize role and hash password
UserSchema.pre('save', async function (next) {
  if (this.role) {
    this.role = this.role.toLowerCase();
  }
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method: Verify password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method: Sign JWT Token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role.toLowerCase(), email: this.email },
    process.env.JWT_SECRET || 'skillbridge_secret_fallback_key',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

module.exports = mongoose.model('User', UserSchema);
