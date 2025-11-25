const bcrypt = require('bcrypt');
const User = require('../models/User');

async function ensureAdminUser() {
  const { ADMIN_USER_ID, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

  if (!ADMIN_USER_ID || !ADMIN_PASSWORD) {
    console.warn('⚠️  ADMIN_USER_ID or ADMIN_PASSWORD is missing; default admin will not be created automatically.');
    return;
  }

  const displayName = ADMIN_NAME || 'System Admin';

  const existing = await User.findOne({ userId: ADMIN_USER_ID });
  if (existing) {
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    name: displayName,
    userId: ADMIN_USER_ID,
    password: hashed,
    role: 'admin',
  });

  console.log(`✅ Default admin created: ${ADMIN_USER_ID}`);
}

module.exports = ensureAdminUser;

