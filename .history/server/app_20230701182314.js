const express = require("express");
const mongoose = require("mongoose");
const dbFunctions = require("./dbFunctions");
const { Client } = require("@googlemaps/google-maps-services-js");
const app = express();
const cors = require("cors");
const apiKey = "AIzaSyCpSbd_GTUT5hRGzW-BBK6mXYX_quZ6ZOQ";

require("dotenv").config();

// Middleware
const corsOptions = {
  origin: "http://localhost:3000", // Frontend URI (ReactJS)
};
app.use(express.json());
app.use(cors(corsOptions));

const opts = { useUnifiedTopology: true };

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, opts)
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`App is listening on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.get("/", (req, res) => {
  res.status(201).json({ message: "Connected to Backend!" });
});

app.get("/api/maps/apiKey", (req, res) => {
  res.status(200).json({ apiKey });
});

let server;
let conn;

(async () => {
  try {
    conn = await database();
    await dbFunctions.getDb(conn);
    await canFunctions.getDb(conn);
    await voteFunctions.getDb(conn);
    await electionFunctions.getDb(conn);
    server = app.listen(port, () => {
      console.log("# App server listening on port " + port);
    });
  } catch (err) {
    console.error("# Error:", err);
    console.error("# Exiting the application.");
    await closing();
    process.exit(1);
  }
})();

async function closing() {
  console.log("# Closing resources...");
  if (conn) {
    await conn.close();
    console.log("# Database connection closed.");
  }
  if (server) {
    server.close(() => console.log("# Web server stopped."));
  }
}
