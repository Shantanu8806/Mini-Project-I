const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Error while connecting to the database");
    console.error(error);
    process.exit(1);
  }
};

// Export the dbConnect function
module.exports = { dbConnect };
