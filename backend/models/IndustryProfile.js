const mongoose = require('mongoose');

const IndustryProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: [true, 'Company or hospital name is required'],
    trim: true
  },
  industryType: {
    type: String,
    enum: [
      'Ayush Hospital / Clinic',
      'Pharmaceutical / GMP Unit',
      'Wellness & Panchakarma Resort',
      'Clinical Research Org (CRO)',
      'Government / Research Council'
    ],
    required: true
  },
  ayushBranch: {
    type: String,
    enum: ['Ayurveda', 'Yoga_Naturopathy', 'Unani', 'Siddha', 'Homeopathy', 'Multi-disciplinary'],
    default: 'Multi-disciplinary'
  },
  registrationNumber: {
    type: String,
    required: [true, 'AYUSH Drug License / MCA / Hospital Registration number is required'],
    trim: true
  },
  website: {
    type: String,
    default: ''
  },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true }
  },
  isApprovedByAdmin: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    maxlength: 1000,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('IndustryProfile', IndustryProfileSchema);
