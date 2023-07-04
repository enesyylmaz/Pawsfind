import { useEffect, useState } from "react";
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
    <div className="App">
      <Map />
    </div>
  );
}

export default App;
