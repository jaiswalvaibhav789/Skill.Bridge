const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryProfile',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Opportunity title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Internship', 'Full-time', 'Clinical Observership', 'Research Fellowship'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  location: {
    type: String,
    required: true
  },
  stipendOrSalary: {
    type: String,
    default: 'Unpaid / Certificate & Travel'
  },
  durationMonths: {
    type: Number,
    default: 6
  },
  requiredSkills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  }],
  preferredSkills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  status: {
    type: String,
    enum: ['Active', 'Closed'],
    default: 'Active'
  },
  openingsCount: {
    type: Number,
    default: 2
  },
  workplaceType: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid'],
    default: 'On-site'
  },
  minCgpa: {
    type: Number,
    default: 6.0
  },
  eligibleDegrees: [{
    type: String
  }],
  deadline: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', OpportunitySchema);
