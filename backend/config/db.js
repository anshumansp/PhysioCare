const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('Attempting to connect to MongoDB...');
  console.log(`Using connection string: ${process.env.MONGODB_URI}`);

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('\nMongoDB Connection Details:');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    console.log(`Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    console.log('\nMongoDB Connected Successfully! \n');

    // Listen for connection events
    mongoose.connection.on('disconnected', () => {
      console.log('Lost MongoDB Connection! ');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('Reconnected to MongoDB! ');
    });

  } catch (error) {
    console.error('\nMongoDB Connection Error! ');
    console.error('Error Details:');
    console.error(`Error Name: ${error.name}`);
    console.error(`Error Message: ${error.message}`);
    if (error.code) {
      console.error(`Error Code: ${error.code}`);
    }
    if (error.syscall) {
      console.error(`System Call: ${error.syscall}`);
    }
    console.error('\nFull Error Stack:');
    console.error(error);
    
    process.exit(1);
  }
};

module.exports = connectDB;
