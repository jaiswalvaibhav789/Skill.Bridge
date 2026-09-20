const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const requestId = require('./middleware/requestId');
const { standardApiLimiter } = require('./middleware/rateLimiter');
const { mongoSanitize } = require('./middleware/mongoSanitize');
const ApiResponse = require('./utils/apiResponse');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Request ID attachment
app.use(requestId);

// Enhanced Security Headers via Helmet
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  xContentTypeOptions: true,
  xFrameOptions: { action: 'sameorigin' }
}));

// CORS policy
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
}));

// Body parsing with limits
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// NoSQL Injection Sanitizer
app.use(mongoSanitize);

// Request logging in dev
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(':date[iso] :method :url :status :res[content-length] - :response-time ms [ReqID: :req[x-request-id]]'));
}

// Global API rate limiting
app.use('/api', standardApiLimiter);

// Comprehensive Health Check & Diagnostics
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState;
  const dbStateMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  return ApiResponse.success(res, {
    service: 'Academia-Industry Collaboration Portal (SkillBridge Enterprise)',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStateMap[dbState] || 'Unknown',
      connected: dbState === 1
    },
    memoryUsageMB: {
      rss: (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
      heapUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
      heapTotal: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)
    },
    timestamp: new Date().toISOString()
  }, 'Service health diagnostics operational');
});

// System Version & Specification
app.get('/api/version', (req, res) => {
  return ApiResponse.success(res, {
    application: 'SkillBridge Ayush Collaboration Platform',
    version: '1.0.0-PROD',
    sihStatementId: 'SIH26044',
    specification: 'Master Blueprint v1.0.0',
    activeModules: [
      'MOD-01: Authentication & RBAC',
      'MOD-02: Profiles',
      'MOD-03: Assessment Engine',
      'MOD-04: Skill Gap Analyzer',
      'MOD-05: Learning Programs',
      'MOD-06: Internship Portal',
      'MOD-07: Placement Portal',
      'MOD-08: Recommendation Engine',
      'MOD-09: Digital Portfolio',
      'MOD-10: Academia-Industry Collaboration',
      'MOD-11: Internship Tracking',
      'MOD-12: Role Dashboards & Analytics'
    ]
  }, 'Version & specification metadata retrieved');
});

// Mount modular routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/industry', require('./routes/industryRoutes'));
app.use('/api/institute', require('./routes/instituteRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/skills', require('./routes/skillsRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/skill-gap', require('./routes/skillGapRoutes'));
app.use('/api/learning', require('./routes/learningRoutes'));
app.use('/api/tracking', require('./routes/trackingRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/collaborations', require('./routes/collaborationRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/audit-logs', require('./routes/auditLogRoutes'));

// 404 Route Handler
app.use('*', (req, res) => {
  return ApiResponse.error(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, 404, 'ROUTE_NOT_FOUND');
});

// Centralized Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[SkillBridge Enterprise API] Active on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Graceful shutdown handling
const shutdown = (signal) => {
  console.log(`[Signal: ${signal}] Gracefully closing HTTP server and connections...`);
  server.close(() => {
    console.log('[SkillBridge API] Closed out remaining connections.');
    const mongoose = require('mongoose');
    mongoose.connection.close(false).then(() => {
      console.log('[MongoDB] Connection closed.');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
