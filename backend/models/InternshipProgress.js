const mongoose = require('mongoose');

const InternshipProgressSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    unique: true
  },
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
    required: true
  },
  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryProfile',
    required: true
  },
  mentor: {
    name: { type: String, default: 'Industry Mentor' },
    email: { type: String, default: '' },
    designation: { type: String, default: 'Lead Supervisor' }
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  weeklyLogs: [{
    weekNumber: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    tasksCompleted: { type: String, required: true },
    hoursWorked: { type: Number, default: 40 },
    studentReflections: { type: String, default: '' },
    mentorFeedback: { type: String, default: '' },
    mentorRating: { type: Number, min: 1, max: 5, default: 4 },
    status: {
      type: String,
      enum: ['Submitted', 'Reviewed', 'Approved', 'Needs_Revision'],
      default: 'Submitted'
    },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date }
  }],
  finalEvaluation: {
    technicalCompetence: { type: Number, min: 1, max: 5 },
    professionalPunctuality: { type: Number, min: 1, max: 5 },
    teamworkAndCommunication: { type: Number, min: 1, max: 5 },
    overallScorePercentage: { type: Number, min: 0, max: 100 },
    finalRemarks: { type: String, default: '' },
    evaluatedAt: { type: Date }
  },
  completionStatus: {
    type: String,
    enum: ['Active', 'Completed', 'Extended', 'Terminated'],
    default: 'Active'
  },
  certificate: {
    issued: { type: Boolean, default: false },
    certificateId: { type: String, default: '' },
    certificateHash: { type: String, default: '' },
    issueDate: { type: Date },
    downloadUrl: { type: String, default: '' }
  }
}, { timestamps: true });

InternshipProgressSchema.index({ student: 1, completionStatus: 1 });
InternshipProgressSchema.index({ industry: 1, completionStatus: 1 });

module.exports = mongoose.model('InternshipProgress', InternshipProgressSchema);
