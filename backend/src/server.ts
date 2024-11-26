import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db';
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

console.log('\n=== 🚀 Server Configuration ===');
console.log('🔹 Node Environment:', process.env.NODE_ENV);
console.log('🔹 Server Port:', process.env.PORT || 5000);
console.log('==============================\n');

const app = express();

// CORS configuration - Allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
console.log('🔄 Initializing MongoDB connection...');
connectDB()
  .then(() => {
    console.log('✅ MongoDB connection initialization complete');
  })
  .catch(err => {
    console.error('❌ Failed to initialize MongoDB connection:', err);
  });

// Monitor MongoDB connection state changes
mongoose.connection.on('connecting', () => {
  console.log('🔄 MongoDB: Connecting...');
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB: Connected');
});

mongoose.connection.on('disconnecting', () => {
  console.log('⚠️ MongoDB: Disconnecting...');
});

mongoose.connection.on('disconnected', () => {
  console.log('❌ MongoDB: Disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Error:', err);
});

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 PhysioAI API is running!',
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Mount auth routes
app.use('/api/auth', authRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  const mongoState = mongoose.connection.readyState;
  const stateMap: { [key: number]: string } = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version
    },
    mongodb: {
      state: stateMap[mongoState],
      host: mongoose.connection.host,
      database: mongoose.connection.name,
      collections: mongoose.connection.collections ? Object.keys(mongoose.connection.collections).length : 0
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Handle 404 routes
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n=== ✨ Server Status ===');
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log('=======================\n');
});
