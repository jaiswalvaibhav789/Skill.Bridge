const mongoose = require('mongoose');

const CollaborationProposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Collaboration title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Joint_R&D', 'Consulting_Request', 'Faculty_Sabbatical', 'Grant_Call'],
    required: true
  },
  initiatorType: {
    type: String,
    enum: ['Industry', 'Faculty', 'Institute', 'Ministry'],
    required: true
  },
  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryProfile'
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FacultyProfile'
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InstituteProfile'
  },
  description: {
    type: String,
    required: [true, 'Detailed scope of collaboration is required']
  },
  budget: {
    type: String,
    default: 'Funded / Sponsored'
  },
  durationMonths: {
    type: Number,
    default: 12
  },
  deliverables: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['Open_Call', 'Under_Review', 'Approved', 'Completed', 'Declined'],
    default: 'Open_Call'
  },
  applications: [{
    applicantFaculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FacultyProfile',
      required: true
    },
    proposalAbstract: {
      type: String,
      required: true
    },
    proposedBudget: {
      type: String
    },
    estimatedMonths: {
      type: Number,
      default: 6
    },
    status: {
      type: String,
      enum: ['Submitted', 'Accepted', 'Rejected'],
      default: 'Submitted'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

CollaborationProposalSchema.index({ type: 1, status: 1 });
CollaborationProposalSchema.index({ industry: 1, faculty: 1 });

module.exports = mongoose.model('CollaborationProposal', CollaborationProposalSchema);
