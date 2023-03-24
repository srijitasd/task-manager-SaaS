// Import the mongoose module
const mongoose = require("mongoose");

const mongoDB = "mongodb://127.0.0.1/test";

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 10000,
};

const connect = async (url) => {
  return new Promise(async (resolve, reject) => {
    const connection = await mongoose.createConnection(url, mongoOptions);
    resolve(connection);
  });
};

module.exports = {
  connect,
};
