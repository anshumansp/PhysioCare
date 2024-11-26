const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Import routes
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const appointmentRoutes = require('./routes/appointments');
const settingsRoutes = require('./routes/settings');

const app = express();

// Connect to MongoDB
console.log('\n=== 🚀 Starting Server ===');

// Trust proxy if behind a proxy (like on Render)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());

// Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok brother' });
});

// Database connection with retry mechanism and error handling
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds
let retryCount = 0;
let isConnected = false;

const connectWithRetry = async () => {
  try {
    if (retryCount >= MAX_RETRIES) {
      console.log('❌ Maximum retry attempts reached. Server will continue running without MongoDB connection.');
      console.log('⚠️ Some features requiring database access may not work.');
      return;
    }

    if (!process.env.MONGODB_URI) {
      console.error('❌ MongoDB URI is not defined in environment variables');
      return;
    }

    console.log(`Attempting to connect to MongoDB... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
    
    // Configure Mongoose
    mongoose.set('strictQuery', true);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      heartbeatFrequencyMS: 2000,     // Heartbeat every 2s
      maxPoolSize: 10,                // Maintain up to 10 socket connections
    });

    isConnected = true;
    retryCount = 0; // Reset retry count on successful connection
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    isConnected = false;
    retryCount++;
    
    console.error('❌ MongoDB Connection Error:', err.message);
    
    // Log specific error details for debugging
    if (err.name === 'MongooseServerSelectionError') {
      console.error('⚠️ Server Selection Error - Possible causes:');
      console.error('  1. IP Address not whitelisted in MongoDB Atlas');
      console.error('  2. Invalid connection string');
      console.error('  3. Network connectivity issues');
      console.error('  4. MongoDB Atlas cluster is not running');
    }
    
    if (retryCount < MAX_RETRIES) {
      console.log(`⏳ Retrying connection in ${RETRY_INTERVAL/1000} seconds... (Attempt ${retryCount}/${MAX_RETRIES})`);
      setTimeout(connectWithRetry, RETRY_INTERVAL);
    } else {
      console.log('❌ Maximum retry attempts reached. Server will continue running without MongoDB connection.');
      console.log('⚠️ Some features requiring database access may not work.');
    }
  }
};

// Middleware to check database connection
const checkDbConnection = (req, res, next) => {
  if (!isConnected && req.path !== '/health') {
    return res.status(503).json({
      status: 'error',
      message: 'Database connection is not available'
    });
  }
  next();
};

// Add DB connection check middleware
app.use(checkDbConnection);

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('🟢 MongoDB connection established');
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('🔴 MongoDB connection disconnected');
  if (retryCount < MAX_RETRIES) {
    console.log('⏳ Attempting to reconnect...');
    setTimeout(connectWithRetry, RETRY_INTERVAL);
  }
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('❌ MongoDB connection error:', err.message);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'up',
    database: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Initial database connection attempt
connectWithRetry();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/settings', settingsRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
