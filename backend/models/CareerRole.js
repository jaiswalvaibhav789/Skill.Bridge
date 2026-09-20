const mongoose = require('mongoose');

const CareerRoleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Career role title is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  industrySector: {
    type: String,
    enum: ['Pharmaceuticals', 'Clinical Healthcare', 'Wellness & Spa', 'Regulatory & Research', 'Hospital Administration', 'General Healthcare'],
    default: 'Clinical Healthcare'
  },
  requiredSkills: [{
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true
    },
    minProficiencyScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 75
    },
    weight: {
      type: Number,
      default: 1.0
    }
  }],
  preferredSkills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  averageSalaryRange: {
    type: String,
    default: '₹4.5 LPA - ₹8.0 LPA'
  },
  demandIndex: {
    type: Number,
    min: 0,
    max: 100,
    default: 70
  }
}, { timestamps: true });

CareerRoleSchema.index({ industrySector: 1 });

module.exports = mongoose.model('CareerRole', CareerRoleSchema);
