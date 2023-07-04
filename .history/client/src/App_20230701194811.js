import GoogleMap from "google-maps-react-markers";
import { useEffect, useRef, useState } from "react";
import Info from "./info";
import Marker from "./marker";
import "./style.css";
const URL = "http://localhost:4000";

const App = () => {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapBounds, setMapBounds] = useState({});
  const [highlighted, setHighlighted] = useState(null);

  // ...

  useEffect(() => {
    fetchDataView();
  }, []);

  const handleHighlightClose = () => {
    setHighlighted(null);
  };

  return (
    <main>
      <div className={`map-container ${highlighted ? "blurred" : ""}`}>
        <GoogleMap
          apiKey="YOUR_API_KEY"
          defaultCenter={{ lat: 40.377, lng: 28.8832 }}
          defaultZoom={4}
          onGoogleApiLoaded={onGoogleApiLoaded}
          onChange={onMapChange}
        >
          {coordinateData.map(({ lat, lng, name }, index) => (
            <Marker
              key={index}
              lat={lat}
              lng={lng}
              markerId={name}
              onClick={onMarkerClick}
              className="marker"
            />
          ))}
        </GoogleMap>
        {highlighted && (
          <div className="highlighted">
            {highlighted}{" "}
            <button type="button" onClick={handleHighlightClose}>
              X
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default App;
