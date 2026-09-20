const mongoose = require('mongoose');

const AssessmentAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
    required: true
  },
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  scorePercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  passed: {
    type: Boolean,
    required: true
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    selectedOptionKey: {
      type: String,
      enum: ['A', 'B', 'C', 'D']
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  timeTakenSeconds: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

AssessmentAttemptSchema.index({ student: 1, assessment: 1, completedAt: -1 });

module.exports = mongoose.model('AssessmentAttempt', AssessmentAttemptSchema);
