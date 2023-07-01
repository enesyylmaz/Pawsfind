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

app.get("/api/pets", async (req, res) => {
  try {
    const docs = await dbFunctions.getAllDocs();
    res.json(docs);
  } catch (err) {
    console.error("# Get Error", err);
    res.status(500).send({ error: err.name + ", " + err.message });
  }
});
