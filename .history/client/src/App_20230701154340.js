import { useEffect, useState } from "react";
import React, { Component } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
const URL = "http://localhost:4000";

function App() {
  const [message, setMessage] = useState("");

  // Fetching message from backend on mount
  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div>
      <LoginPage />
    </div>
  );
}

export default App;
