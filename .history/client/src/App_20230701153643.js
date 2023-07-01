import { useEffect, useState } from "react";
import React, { Component } from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";
const URL = "http://localhost:4000";

function App() {
  const [message, setMessage] = useState("");

  // Fetching message from backend on mount
  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return <div className="App"></div>;
}

export default App;
