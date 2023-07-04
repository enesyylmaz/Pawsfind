const express = require("express");
const mongoose = require("mongoose");
const { Client } = require("@googlemaps/google-maps-services-js");
const app = express();
const cors = require("cors");
const apiKey = "AIzaSyCCiNt9mZi4o-bBw_u02cxCsaEEtb4-1ks";
const gmAPI = new Client({});

require("dotenv").config();

// Middleware
const corsOptions = {
  origin: "http://localhost:3000", // Frontend URI (ReactJS)
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

app.get("/geocode", async (req, res) => {
  try {
    const response = await gmAPI.geocode({
      params: {
        address: "1600 Amphitheatre Parkway, Mountain View, CA",
        key: apiKey,
      },
    });
    console.log(response.data.results);
    res.status(200).json(response.data.results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Geocoding error" });
  }
});
