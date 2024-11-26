import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('\n❌ MongoDB URI is missing in environment variables');
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('\n🔄 MongoDB Connection Process Started');
    console.log('----------------------------------');

    // Extract connection details for logging (hiding credentials)
    const uriParts = process.env.MONGODB_URI.split('@');
    const hostPart = uriParts[1] ? uriParts[1].split('?')[0] : 'unknown-host';
    console.log(`📍 Attempting to connect to: ${hostPart}`);

    // Set up mongoose connection events
    mongoose.connection.on('connecting', () => {
      console.log('🔄 Establishing connection to MongoDB Atlas...');
    });

    mongoose.connection.on('connected', () => {
      console.log('✅ Successfully connected to MongoDB Atlas!');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('❌ Disconnected from MongoDB Atlas');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Atlas connection error:', err);
    });

    // Connect with retries
    let retries = 3;
    let connected = false;

    while (retries > 0 && !connected) {
      try {
        console.log(`\n🔄 Connection attempt ${4 - retries}/3');
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000,
          tlsAllowInvalidCertificates: true,
          socketTimeoutMS: 45000,
        } as mongoose.ConnectOptions);

        connected = true;

        console.log('\n=== 🎉 MongoDB Connection Success ===');
        console.log('📊 Connection Details:');
        console.log(`🔹 Host: ${conn.connection.host}`);
        console.log(`🔹 Database: ${conn.connection.name}`);
        console.log(`🔹 Port: ${conn.connection.port}`);
        console.log(`🔹 Connection State: ${mongoose.STATES[conn.connection.readyState]}`);
        
        // Log collections
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('\n📚 Available Collections:');
        collections.forEach(collection => {
          console.log(`   - ${collection.name}`);
        });
        
        console.log('\n✨ MongoDB Atlas Connection Established Successfully!');
        console.log('=====================================\n');

      } catch (error) {
        retries--;
        if (retries === 0) {
          console.error('\n❌ All connection attempts failed!');
          throw error;
        }
        console.log(`❌ Connection failed. ${retries} attempts remaining...`);
        console.log('⏳ Waiting 3 seconds before next attempt...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

  } catch (error) {
    console.error('\n=== ❌ MongoDB Connection Error ===');
    console.error('🔍 Error Details:', error);
    console.error('\n🔧 Troubleshooting Tips:');
    console.error('1. Check if MongoDB Atlas is accessible');
    console.error('2. Verify network connectivity');
    console.error('3. Confirm credentials are correct');
    console.error('4. Check if IP address is whitelisted');
    console.error('=====================================\n');
    process.exit(1);
  }
};

export default connectDB;
