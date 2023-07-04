const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;
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
