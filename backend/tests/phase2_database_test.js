/**
 * Phase 2 Automated Database Verification Test
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('../models/User');
const Skill = require('../models/Skill');
const CareerRole = require('../models/CareerRole');
const Assessment = require('../models/Assessment');
const Question = require('../models/Question');
const LearningProgram = require('../models/LearningProgram');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const InternshipProgress = require('../models/InternshipProgress');
const FacultyProfile = require('../models/FacultyProfile');
const StudentProfile = require('../models/StudentProfile');
const InstituteProfile = require('../models/InstituteProfile');
const IndustryProfile = require('../models/IndustryProfile');

dotenv.config();

async function runDatabaseTests() {
  console.log('=== Phase 2: Database Layer & Mongoose Schema Tests ===\n');
  let passed = 0;
  let total = 0;

  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillbridge_ayush';
    await mongoose.connect(mongoUri);
    console.log('✔ Connected to MongoDB for testing\n');

    // Test 1: Record Count Verification across all newly formalized models
    total++;
    const [
      userCount,
      skillCount,
      roleCount,
      assessmentCount,
      questionCount,
      learningCount,
      oppCount,
      appCount,
      progressCount,
      facultyCount
    ] = await Promise.all([
      User.countDocuments(),
      Skill.countDocuments(),
      CareerRole.countDocuments(),
      Assessment.countDocuments(),
      Question.countDocuments(),
      LearningProgram.countDocuments(),
      Opportunity.countDocuments(),
      Application.countDocuments(),
      InternshipProgress.countDocuments(),
      FacultyProfile.countDocuments()
    ]);

    if (
      userCount >= 5 &&
      skillCount >= 10 &&
      roleCount >= 2 &&
      assessmentCount >= 1 &&
      questionCount >= 4 &&
      learningCount >= 2 &&
      oppCount >= 2 &&
      appCount >= 1 &&
      progressCount >= 1 &&
      facultyCount >= 1
    ) {
      console.log(`✔ Test 1 Passed: All 10 entity models successfully seeded & queried:
    Users: ${userCount}, Skills: ${skillCount}, CareerRoles: ${roleCount},
    Assessments: ${assessmentCount}, Questions: ${questionCount},
    LearningPrograms: ${learningCount}, Opportunities: ${oppCount},
    Applications: ${appCount}, InternshipProgress: ${progressCount}, Faculty: ${facultyCount}`);
      passed++;
    } else {
      console.error('✖ Test 1 Failed: Collection counts below expectations');
    }

    // Test 2: Relational Population Integrity
    total++;
    const sampleApplication = await Application.findOne()
      .populate('opportunity')
      .populate('student')
      .populate('missingSkills');

    if (
      sampleApplication &&
      sampleApplication.opportunity.title &&
      sampleApplication.student.fullName &&
      sampleApplication.missingSkills.length > 0
    ) {
      console.log(`✔ Test 2 Passed: Relational Population intact:
    Application for [${sampleApplication.opportunity.title}] by [${sampleApplication.student.fullName}]
    with ${sampleApplication.missingSkills.length} missing skill(s) evaluated.`);
      passed++;
    } else {
      console.error('✖ Test 2 Failed: Populated application document missing linked fields');
    }

    // Test 3: Schema Validation Rejection on Invalid Data
    total++;
    try {
      const invalidSkill = new Skill({ category: 'InvalidCategory' });
      await invalidSkill.validate();
      console.error('✖ Test 3 Failed: Invalid skill model unexpectedly passed validation');
    } catch (validationErr) {
      if (validationErr.name === 'ValidationError') {
        console.log('✔ Test 3 Passed: Mongoose schema strictly rejected invalid enum category and missing name');
        passed++;
      } else {
        console.error('✖ Test 3 Failed: Unexpected error type', validationErr);
      }
    }

    // Test 4: Duplicate Key Index Constraint
    total++;
    try {
      await User.create({
        email: 'student.ayush@gmail.com', // Duplicate
        password: 'Password@123',
        role: 'student'
      });
      console.error('✖ Test 4 Failed: Duplicate email user unexpectedly created');
    } catch (dupErr) {
      if (dupErr.code === 11000) {
        console.log('✔ Test 4 Passed: Unique compound/single index enforcement rejected duplicate user email (Error 11000)');
        passed++;
      } else {
        console.error('✖ Test 4 Failed: Unexpected error on duplicate insert', dupErr);
      }
    }

    console.log(`\nResults: ${passed}/${total} database tests passed.`);
    await mongoose.connection.close();

    if (passed === total) {
      console.log('🎉 Phase 2 Database Design & Data Layer VERIFIED successfully!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('[Fatal Test Error]:', err);
    process.exit(1);
  }
}

runDatabaseTests();
