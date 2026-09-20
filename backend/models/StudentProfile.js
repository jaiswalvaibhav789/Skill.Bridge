const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InstituteProfile',
    required: true
  },
  degree: {
    type: String,
    enum: ['BAMS', 'BHMS', 'BUMS', 'BNYS', 'BSMS', 'MD/MS Ayush', 'B.Pharma Ayush', 'B.Tech', 'B.Sc Healthcare'],
    required: [true, 'Degree is required']
  },
  department: {
    type: String,
    default: 'Ayush Medicine & Surgery'
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required']
  },
  passingYear: {
    type: Number,
    required: [true, 'Passing year is required']
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
    default: 7.5
  },
  targetCareerRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CareerRole'
  },
  skills: [{
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true
    },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Expert'],
      default: 'Beginner'
    },
    proficiencyScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    isEndorsed: {
      type: Boolean,
      default: false
    },
    endorsedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InstituteProfile'
    },
    verifiedByAssessment: {
      type: Boolean,
      default: false
    },
    lastAssessedAt: {
      type: Date
    },
    credentialHash: {
      type: String,
      trim: true
    },
    issuedAt: {
      type: Date,
      default: Date.now
    }
  }],
  resumeUrl: {
    type: String,
    default: ''
  },
  portfolioSlug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  projects: [{
    title: { type: String, required: true },
    description: { type: String },
    link: { type: String },
    skillsUsed: [{ type: String }]
  }],
  certifications: [{
    title: { type: String, required: true },
    issuingOrganization: { type: String },
    issueDate: { type: Date },
    credentialUrl: { type: String },
    isVerified: { type: Boolean, default: false },
    credentialHash: { type: String, trim: true }
  }],
  bio: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  enrolledPrograms: [{
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningProgram',
      required: true
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Enrolled', 'In_Progress', 'Completed'],
      default: 'Enrolled'
    },
    progressPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    completedAt: {
      type: Date
    }
  }]
}, { timestamps: true });

StudentProfileSchema.index({ institute: 1, degree: 1 });
StudentProfileSchema.index({ 'skills.skill': 1 });
StudentProfileSchema.index({ 'skills.credentialHash': 1 });
StudentProfileSchema.index({ 'certifications.credentialHash': 1 });

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
