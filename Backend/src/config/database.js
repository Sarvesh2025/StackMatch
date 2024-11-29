const mongoose = require("mongoose");
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://utsavsarveshpandey:u2bHnPREdFiPTGSm@cluster0.udnzy.mongodb.net/");
};

module.exports = connectDB;