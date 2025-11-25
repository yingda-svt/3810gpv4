const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const accounts = [
  { userId: 'Admin', password: 'Admin', name: 'System Admin', role: 'admin' },
  { userId: 'S1306615', password: '13066153', name: 'Student S1306615', role: 'student' },
  { userId: 'S1564998', password: '15649987', name: 'Student S1564998', role: 'student' },
  { userId: 'S1452036', password: '14520369', name: 'Student S1452036', role: 'student' },
  { userId: 'S1589756', password: '15897561', name: 'Student S1589756', role: 'student' },
  { userId: 'ctm', password: 'ctm', name: 'Teacher CTM', role: 'teacher' },
  { userId: 'hym', password: 'hym', name: 'Teacher HYM', role: 'teacher' },
  { userId: 'lyw', password: 'lyw', name: 'Teacher LYW', role: 'teacher' },
  { userId: 'whb', password: 'whb', name: 'Teacher WHB', role: 'teacher' },
  { userId: 'ckh', password: 'ckh', name: 'Teacher CKH', role: 'teacher' },
];

async function seedUsers() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not set');
  }

  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB, starting user account creation');

  await User.deleteMany({});
  console.log('🧹 Cleared users collection');

  const docs = [];
  for (const account of accounts) {
    const hashed = await bcrypt.hash(account.password, 10);
    docs.push({
      userId: account.userId,
      name: account.name,
      email: `${account.userId.toLowerCase()}@ole.com`,
      password: hashed,
      role: account.role,
    });
  }

  await User.insertMany(docs);
  console.log(`👥 Created ${docs.length} user accounts`);

  await mongoose.disconnect();
  console.log('✨ User account creation completed');
}

seedUsers().catch((err) => {
  console.error('❌ Failed to create users:', err);
  process.exit(1);
});

