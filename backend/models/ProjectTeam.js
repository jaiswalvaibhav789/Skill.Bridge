const mongoose = require('mongoose');

const ProjectTeamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryProfile',
    required: true
  },
  problemDescription: {
    type: String,
    required: [true, 'Problem description is required']
  },
  category: {
    type: String,
    default: 'Herbal Inventory & Smart Systems'
  },
  teamSize: {
    type: Number,
    default: 4
  },
  durationWeeks: {
    type: Number,
    default: 6
  },
  deliverables: [{
    type: String
  }],
  requiredSkills: [{
    type: String
  }],
  roleBreakdown: [{
    roleTitle: { type: String, required: true },
    requiredSkills: [{ type: String }],
    description: { type: String }
  }],
  teamMembers: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true
    },
    assignedRole: {
      type: String,
      required: true
    },
    matchedSkills: [{
      type: String
    }],
    individualMatchScore: {
      type: Number,
      default: 85
    },
    status: {
      type: String,
      enum: ['Proposed', 'Invited', 'Accepted', 'Declined'],
      default: 'Proposed'
    }
  }],
  teamCoverageScore: {
    type: Number,
    default: 90
  },
  missingSkills: [{
    type: String
  }],
  bridgeRecommendations: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Draft', 'Team Proposed', 'Active', 'Completed'],
    default: 'Team Proposed'
  }
}, { timestamps: true });

module.exports = mongoose.model('ProjectTeam', ProjectTeamSchema);
