import { useEffect, useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
const URL = "http://localhost:4000";

const containerStyle = {
  position: "absolute",
  bottom: "2%",
  left: "50%",
  transform: "translateX(-50%)",
  width: "80vw",
  height: "70vh",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const coordinates = [
  [
    {
      lat: 45.4046987,
      lng: 12.2472504,
      name: "Venice",
    },
    {
      lat: 41.9102415,
      lng: 12.3959151,
      name: "Rome",
    },
    {
      lat: 45.4628328,
      lng: 9.1076927,
      name: "Milan",
    },
  ],
  [
    {
      lat: 40.8518,
      lng: 14.2681,
      name: "Naples",
    },
    {
      lat: 43.7696,
      lng: 11.2558,
      name: "Florence",
    },
    {
      lat: 37.5023,
      lng: 15.0873,
      name: "Catania",
    },
  ],
];

const App = () => {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const onGoogleApiLoaded = ({ map, maps }) => {
    mapRef.current = map;
    setMapReady(true);
  };

  const onMarkerClick = (e, { markerId, lat, lng }) => {
    console.log("This is ->", markerId);
    mapRef.current.setCenter({ lat, lng });
  };

  return (
    <>
      {mapReady && <div>Map is ready. See for logs in developer console.</div>}
      <LoadScript
        googleMapsApiKey="AIzaSyCpSbd_GTUT5hRGzW-BBK6mXYX_quZ6ZOQ"
        onLoad={onGoogleApiLoaded}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={5}
          mapContainerClassName="map-container"
          options={{}}
          onLoad={onGoogleApiLoaded}
          onUnmount={onUnmount}
        >
          {coordinates.map((coordinateGroup, index) =>
            coordinateGroup.map(({ lat, lng, name }, markerIndex) => (
              <Marker
                key={`${index}-${markerIndex}`}
                position={{ lat, lng }}
                onClick={(e) => onMarkerClick(e, { markerId: name, lat, lng })}
              />
            ))
          )}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default App;
