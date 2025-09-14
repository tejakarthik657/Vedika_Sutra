import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const username = 'admin';
const password = 'vedika2025'; // Change this if you want a custom password

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const hash = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, password: hash });
  await admin.save();
  console.log('Admin user created');
  mongoose.disconnect();
}

createAdmin();
