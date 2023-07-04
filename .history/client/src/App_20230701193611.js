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

  /**
   * @description This function is called when the map is ready
   * @param {Object} map - reference to the map instance
   * @param {Object} maps - reference to the maps library
   */
  // eslint-disable-next-line no-unused-vars
  const onGoogleApiLoaded = ({ map, maps }) => {
    mapRef.current = map;
    setMapReady(true);
  };

  // eslint-disable-next-line no-unused-vars
  const onMarkerClick = (e, { markerId, lat, lng }) => {
    setHighlighted(markerId);
  };

  const onMapChange = ({ bounds, zoom }) => {
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    // Swap latitude values to invert the map view
    const invertedBounds = [
      sw.lng(), // westLng
      ne.lat(), // southLat
      ne.lng(), // eastLng
      sw.lat(), // northLat
    ];

    setMapBounds({
      ...mapBounds,
      bounds: invertedBounds,
      zoom,
    });
    setHighlighted(null);
  };

  const [coordinateData, setCoordinateData] = useState([]);

  const fetchDataView = () => {
    fetch(`${URL}/api/pets`)
      .then((response) => response.json())
      .then((data) => {
        setCoordinateData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchDataView();
  }, []);

  return (
    <main>
      <div className="map-container">
        <GoogleMap
          apiKey="AIzaSyCpSbd_GTUT5hRGzW-BBK6mXYX_quZ6ZOQ"
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
            <button type="button" onClick={() => setHighlighted(null)}>
              X
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default App;
