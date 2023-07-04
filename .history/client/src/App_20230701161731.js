import { useEffect, useState } from "react";
import React, { Component } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import axios from "axios";

import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
const URL = "http://localhost:4000";

const containerStyle = {
  width: "800px",
  height: "600px",
};

const center = {
  lat: 37.7749, // Latitude of the desired center of the map
  lng: -122.4194, // Longitude of the desired center of the map
};

function App() {
  useEffect(() => {
    const initMap = () => {
      const myLatLng = { lat: -25.363, lng: 131.044 };
      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: myLatLng,
      });

      new window.google.maps.Marker({
        position: myLatLng,
        map,
        title: "Hello World!",
      });
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Load the Google Maps script if not already loaded
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return <div id="map" style={{ width: "800px", height: "600px" }}></div>;
}

export default App;
