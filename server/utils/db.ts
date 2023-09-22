import mongoose from 'mongoose';
import { config } from 'dotenv';
// require('dotenv').config()

config();

const dbUrl: string = process.env.DB_URI || '';

const connectDB = async () => {
  try {
    (await mongoose.connect(dbUrl)).isObjectIdOrHexString((data: any) => {
      console.log(`Database connected with ${data.connection.host}`);
    });
  } catch (err: any) {
    console.log(err.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
