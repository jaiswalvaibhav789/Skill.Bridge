const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  prompt: {
    type: String,
    required: [true, 'Question prompt is required']
  },
  options: [{
    optionKey: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }],
  correctOptionKey: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: true,
    select: false // Concealed from regular client queries during assessment
  },
  explanation: {
    type: String,
    default: ''
  },
  weightage: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

QuestionSchema.index({ assessment: 1 });

module.exports = mongoose.model('Question', QuestionSchema);
