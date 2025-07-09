import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from './src/models/admin.model.js';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Admin.findOne({ username: 'admin' });
    if (existing) {
      console.log('Admin already exists');
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash('Admin2000', 10);

    await Admin.create({
      username: 'admin',
      email: 'abhikc2811@gmail.com', 
      password: hashedPassword
    });

    console.log('✅ Admin user created successfully!');
    process.exit();
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
