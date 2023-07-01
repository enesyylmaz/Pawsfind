import { useEffect, useState } from "react";
import React, { Component } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
const URL = "http://localhost:4000";

function App() {
  const [message, setMessage] = useState("");

  const [geocodingData, setGeocodingData] = useState([]);

  useEffect(() => {
    const fetchGeocodingData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/geocode");
        setGeocodingData(response.data);
      } catch (error) {
        console.error("Error fetching geocoding data:", error);
      }
    };

    fetchGeocodingData();
  }, []);

  // Fetching message from backend on mount
  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return <div></div>;
}

export default App;
