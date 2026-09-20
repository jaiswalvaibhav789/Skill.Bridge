const mongoose = require('mongoose');

const LearningProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Learning program title is required'],
    trim: true
  },
  providerType: {
    type: String,
    enum: ['Industry', 'Institute', 'Ministry', 'Autonomous_Body'],
    default: 'Industry'
  },
  providerName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Course', 'Certification', 'Workshop', 'FDP', 'HandsOn_Training'],
    default: 'Course'
  },
  description: {
    type: String,
    required: true
  },
  coveredSkills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  }],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  durationHours: {
    type: Number,
    default: 20
  },
  cost: {
    type: String,
    default: 'Free / Subsidized'
  },
  enrollmentUrl: {
    type: String,
    default: '#'
  },
  rating: {
    type: Number,
    default: 4.8
  },
  enrolledStudentsCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

LearningProgramSchema.index({ coveredSkills: 1, type: 1 });

module.exports = mongoose.model('LearningProgram', LearningProgramSchema);
