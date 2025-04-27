const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://lsasidhar42:Lollas%4012@devtinder.wcgoxol.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
