import mongoose from 'mongoose';

const dbUrl = `mongodb://localhost:27017/`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log('Database connected...');
  } catch (error) {
    console.log((error as Error).message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
