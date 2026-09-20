const mongoose = require('mongoose');

const InstituteProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  instituteName: {
    type: String,
    required: [true, 'Institute name is required'],
    trim: true
  },
  aisheCode: {
    type: String,
    required: [true, 'AISHE / NCISM / NCH accreditation code is required'],
    unique: true,
    trim: true
  },
  affiliatedUniversity: {
    type: String,
    required: true
  },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true }
  },
  recognizedDepartments: [{
    type: String,
    enum: ['Ayurveda', 'Yoga & Naturopathy', 'Unani', 'Siddha', 'Homeopathy']
  }],
  isApproved: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('InstituteProfile', InstituteProfileSchema);
