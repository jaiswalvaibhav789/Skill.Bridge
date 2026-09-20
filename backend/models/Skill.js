const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: [
      'Clinical',
      'Pharma_Manufacturing',
      'Regulatory_Research',
      'Hospital_Admin',
      'General_Technical',
      'Soft_Skills',
      'Aptitude'
    ],
    required: true
  },
  ayushBranch: {
    type: String,
    enum: ['Ayurveda', 'Yoga_Naturopathy', 'Unani', 'Siddha', 'Homeopathy', 'Common'],
    default: 'Common'
  },
  industryDemandScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 70
  },
  benchmarkScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 75
  },
  description: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }]
}, { timestamps: true });

SkillSchema.index({ category: 1, ayushBranch: 1 });
SkillSchema.index({ industryDemandScore: -1 });

module.exports = mongoose.model('Skill', SkillSchema);
