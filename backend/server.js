const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');

const app = express();

// Connect to MongoDB
console.log('\n=== 🚀 Starting Server ===');

// Start the server independently
const startServer = (port) => {
  try {
    const server = app.listen(port, () => {
      console.log(`\n✅ Server is running on port ${port}`);
      console.log('=======================\n');
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${port} is busy, trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('Server error:', error);
      }
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      server.close(() => {
        console.log('Server closed. Database instance disconnected');
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;
const server = startServer(PORT);

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
app.use(compression());

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
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
