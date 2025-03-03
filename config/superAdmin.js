const User = require('./../models/userModel');

const createSpAdmin = async () => {
  const SAuser = await User.findOne({ role: 'superAdmin' });

  if (SAuser) return;

  //Creating SuperAdmin
  try {
    await User.create({
      name: process.env.SUPER_ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD,
      passwordConfirm: process.env.SUPER_ADMIN_PASSWORD,
      role: 'superAdmin',
    });

    console.log('🐱‍👤 Bulkbuy Super Admin successfully created');
  } catch (err) {
    console.log(`Error in Bulkbuy SuperAdmin creation: ${err} `);
  }
};

module.exports = createSpAdmin;
