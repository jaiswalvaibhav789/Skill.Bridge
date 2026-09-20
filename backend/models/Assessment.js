const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assessment title is required'],
    trim: true
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  category: {
    type: String,
    enum: ['Clinical', 'Pharma_Manufacturing', 'Regulatory_Research', 'Hospital_Admin', 'General_Technical', 'Soft_Skills', 'Aptitude'],
    default: 'Clinical'
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  timeLimitMinutes: {
    type: Number,
    default: 15
  },
  passingScorePercentage: {
    type: Number,
    default: 60
  },
  totalQuestions: {
    type: Number,
    default: 5
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

AssessmentSchema.index({ skill: 1, difficulty: 1 });

module.exports = mongoose.model('Assessment', AssessmentSchema);
