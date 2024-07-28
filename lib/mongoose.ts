import mongoose from 'mongoose';

let isConnected = false; // Variable to track the connection status

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
    return;
  }

  // Check if already connected
  if (isConnected) {
    console.log('=> Using existing database connection');
    return;
  }

  try {
    // Check Mongoose's connection state
    const dbConnection = mongoose.connection;
    if (dbConnection.readyState === 1) { // 1 means connected
      isConnected = true;
      console.log('=> Using existing database connection');
      return;
    }

    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI);

    // Set the connection status flag
    isConnected = true;
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    // Handle the error (e.g., re-throw or exit the process if critical)
    // throw error; // Uncomment if you want to propagate the error
  }
};

