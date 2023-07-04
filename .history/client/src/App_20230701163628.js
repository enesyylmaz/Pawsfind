import { useEffect, useState } from "react";
import React, { Component } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import axios from "axios";
const URL = "http://localhost:4000";

const containerStyle = {
  position: "absolute",
  bottom: "10%",
  left: "50%",
  transform: "translateX(-50%)",
  width: "60vw",
  height: "35vh",
};

const center = {
  lat: 37.7749, // Latitude of the desired center of the map
  lng: -122.4194, // Longitude of the desired center of the map
};

function App() {
  const [message, setMessage] = useState("");

  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get(`${URL}/api/maps/apiKey`);
        setApiKey(response.data.apiKey);
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };

    fetchApiKey();
  }, []);

  // Fetching message from backend on mount
  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} />
    </LoadScript>
  );
}

export default App;
