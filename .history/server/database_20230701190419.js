const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri =
  "mongodb+srv://admin:admin@database.kijahsf.mongodb.net/?retryWrites=true&w=majority";
const opts = { useUnifiedTopology: true };

const connect = async () => {
  try {
    console.log("# Connecting to database server...");
    const client = await MongoClient.connect(uri, opts);
    console.log("# Connected");
    return client;
  } catch (err) {
    console.error("# Database connection error");
    throw err;
  }
};

module.exports = connect;
