const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');
const seedData = require('./seed/seed');

// Load environment variables
dotenv.config();

const app = express();

// Body parsers & CORS
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

let isSeeding = false;
let isDbInitialized = false;

const ensureDbAndSeed = async () => {
  if (isDbInitialized) return;
  if (isSeeding) return;
  isSeeding = true;
  try {
    await connectDB();
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('[Campus IQ] Database is empty. Auto-seeding initial data...');
      await seedData(true);
    }
    isDbInitialized = true;
    console.log('[Campus IQ] Database & Seed initialization ready.');
  } catch (err) {
    console.error('[Campus IQ] Database initialization error:', err);
  } finally {
    isSeeding = false;
  }
};

// Middleware to ensure DB is connected before processing requests
app.use(async (req, res, next) => {
  if (req.path === '/api/health') return next();
  if (!isDbInitialized) {
    await ensureDbAndSeed();
  }
  next();
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Campus IQ Backend API',
    status: 'ONLINE',
    dbInitialized: isDbInitialized,
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/grievances', require('./routes/grievanceRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server immediately and initialize DB
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Campus IQ Server] Listening on http://localhost:${PORT}`);
    ensureDbAndSeed();
  });
}

module.exports = app;
