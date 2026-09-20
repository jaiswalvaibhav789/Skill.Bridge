const mongoose = require('mongoose');

const FacultyProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InstituteProfile',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  designation: {
    type: String,
    enum: ['Assistant Professor', 'Associate Professor', 'Professor', 'Head of Department', 'Dean', 'Research Fellow'],
    default: 'Assistant Professor'
  },
  yearsExperience: {
    type: Number,
    default: 0
  },
  expertise: [{
    type: String,
    trim: true
  }],
  researchInterests: [{
    type: String,
    trim: true
  }],
  publications: [{
    title: { type: String, required: true },
    journal: { type: String },
    year: { type: Number },
    doiOrLink: { type: String }
  }],
  industryConsultingHistory: [{
    companyName: { type: String, required: true },
    projectTitle: { type: String, required: true },
    year: { type: Number },
    description: { type: String }
  }],
  bio: {
    type: String,
    maxlength: 1000,
    default: ''
  }
}, { timestamps: true });

FacultyProfileSchema.index({ institute: 1, department: 1 });

module.exports = mongoose.model('FacultyProfile', FacultyProfileSchema);
