const express = require("express");
const mongoose = require("mongoose");
const { Client } = require("@googlemaps/google-maps-services-js");
const app = express();
const cors = require("cors");
const apiKey = "AIzaSyCpSbd_GTUT5hRGzW-BBK6mXYX_quZ6ZOQ";
const gmAPI = new Client({});

require("dotenv").config();

// Middleware
const corsOptions = {
  origin: "https://pawsfind.onrender.com", // Frontend URI (ReactJS)
};
app.use(express.json());
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
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