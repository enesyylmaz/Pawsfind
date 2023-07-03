import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/tailwind.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId="138088655548-k5nqa71rdrulnbrujpg9be75q1qkp88p.apps.googleusercontent.com"
      redirectUri="https://pawsfind.onrender.com" // Replace with your redirect URI
      scopes={["email", "profile"]}
    >
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
