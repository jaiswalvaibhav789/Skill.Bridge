const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
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
  matchScore: {
    type: Number,
    required: true
  },
  missingSkills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  status: {
    type: String,
    enum: [
      'Applied',
      'Under_Review',
      'Shortlisted',
      'Interview_Scheduled',
      'Offered',
      'Accepted',
      'Rejected',
      'Withdrawn'
    ],
    default: 'Applied'
  },
  feedback: {
    type: String,
    default: ''
  },
  interviewSchedule: {
    scheduledDate: { type: Date },
    roundName: { type: String, default: 'Technical Interview & Samhita Knowledge' },
    meetingLink: { type: String, default: '' },
    locationDetails: { type: String, default: 'Google Meet / Virtual Campus Room' },
    instructions: { type: String, default: '' },
    scheduledAt: { type: Date }
  }
}, { timestamps: true });

// Prevent duplicate applications by same student for the same role
ApplicationSchema.index({ opportunity: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
