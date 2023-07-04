const express = require("express");
const mongoose = require("mongoose");
const googleMaps = require("googlemaps");
const app = express();
const cors = require("cors");
const apiKey = "AIzaSyCCiNt9mZi4o-bBw_u02cxCsaEEtb4-1ks";
const gmAPI = new googleMaps.Client({ apiKey });
require("dotenv").config();

// middleware
const corsOptions = {
  origin: "http://localhost:3000", // frontend URI (ReactJS)
};
app.use(express.json());
app.use(cors(corsOptions));

// connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`App is Listening on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// route
app.get("/", (req, res) => {
  res.status(201).json({ message: "Connected to Backend!" });
});

gmAPI.geocode(
  {
    address: "1600 Amphitheatre Parkway, Mountain View, CA",
  },
  (err, response) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(response.json.results);
  }
);
