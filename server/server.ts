import { app } from './app';
import { config } from 'dotenv';
import connectDB from './utils/db';
// require('dotenv').config();

config();

// Create Server
app.listen(process.env.PORT, () => {
  console.log('Server is connected with port ', process.env.PORT);
  connectDB();
});
