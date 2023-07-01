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
  const [mapDragged, setMapDragged] = useState(false);

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
    if (!mapDragged) {
      setHighlighted({ markerId, lat, lng });
    }
  };

  const onMapChange = ({ bounds, zoom, isDragging }) => {
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    /**
     * useSupercluster accepts bounds in the form of [westLng, southLat, eastLng, northLat]
     * const { clusters, supercluster } = useSupercluster({
     *	points: points,
     *	bounds: mapBounds.bounds,
     *	zoom: mapBounds.zoom,
     * })
     */
    setMapBounds({
      ...mapBounds,
      bounds: [sw.lng(), sw.lat(), ne.lng(), ne.lat()],
      zoom,
    });
    setMapDragged(isDragging);
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

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Escape") {
        setHighlighted(null);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
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
      </div>
      {highlighted && (
        <div className="popup">
          <div className="popup-content">
            <div className="popup-header">
              <h3>{highlighted.markerId}</h3>
              <button
                type="button"
                onClick={() => setHighlighted(null)}
                className="close-button"
              >
                X
              </button>
            </div>
            <div className="popup-body">
              <p>Latitude: {highlighted.lat}</p>
              <p>Longitude: {highlighted.lng}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
