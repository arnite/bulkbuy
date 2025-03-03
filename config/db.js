const mongoose = require('mongoose');

const integrateDB = async () => {
  try {
    //change
    await mongoose.connect(process.env.DATABASE);
    console.log('🍏Bulkbuy Database integration successful');
  } catch (err) {
    console.log(`🔴Bulkbuy Database integration failed: (${err})`);
  }
};

module.exports = integrateDB;
