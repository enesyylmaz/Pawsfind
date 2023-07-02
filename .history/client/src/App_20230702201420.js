import GoogleMap from "google-maps-react-markers";
import { useEffect, useRef, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import Info from "./info";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import Marker from "./marker";
import "./style.css";
import axios from "axios";
import logo from "./pawfind_vert.png";
const URL = "http://localhost:4000";

const App = () => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapBounds, setMapBounds] = useState({});
  const [highlighted, setHighlighted] = useState(null);
  const [mapDragged, setMapDragged] = useState(false);

  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);

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

  const storeUserInLocalStorage = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("user");
  };

  const onMapChange = ({ bounds, zoom }) => {
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    setMapBounds({
      ...mapBounds,
      bounds: [sw.lng(), sw.lat(), ne.lng(), ne.lat()],
      zoom,
    });
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
        setShowPopup(false);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const handleMapDragStart = () => {
      setMapDragged(true);
    };

    const handleMapDragEnd = () => {
      setMapDragged(false);
    };

    const mapContainer = mapContainerRef.current;

    if (mapContainer) {
      mapContainer.addEventListener("mousedown", handleMapDragStart);
      mapContainer.addEventListener("mouseup", handleMapDragEnd);
    }

    return () => {
      if (mapContainer) {
        mapContainer.removeEventListener("mousedown", handleMapDragStart);
        mapContainer.removeEventListener("mouseup", handleMapDragEnd);
      }
    };
  }, [mapContainerRef]);

  const onMarkerClick = (e, { markerId, lat, lng }) => {
    setHighlighted({ markerId, lat, lng });

    const fullscreenElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;

    if (fullscreenElement) {
      // Exit fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleLogin = (codeResponse) => {
      setUser(codeResponse);
      storeUserInLocalStorage(codeResponse);
    };

    const handleLogout = () => {
      setUser(null);
      setProfile(null);
      setLoading(true);
      removeUserFromLocalStorage();
      googleLogout();
    };

    if (user && user.access_token) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
          setLoading(false);
          storeUserInLocalStorage(user);
        })
        .catch((err) => console.log(err));
    } else {
      setProfile(null);
      setLoading(false);
      removeUserFromLocalStorage();
    }
  }, [user]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      storeUserInLocalStorage(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const logOut = () => {
    setUser(null);
    setProfile(null);
    setLoading(true);
    removeUserFromLocalStorage();
    googleLogout();
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleMapClick = ({ x, y, lat, lng }) => {
    setLatitude(lat);
    setLongitude(lng);

    const newInfoWindow = (
      <div style={{ position: "absolute", left: x, top: y }}>
        Latitude: {lat}
        <br />
        Longitude: {lng}
      </div>
    );

    setInfoWindow(newInfoWindow);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    if (!location || !latitude || !longitude) {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      alert("Application added successfully.");
      const response = await fetch(`${URL}/api/addpet`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: location,
          lat: latitude,
          lng: longitude,
        }),
      });
      const data = await response.json();
      console.log("Application added successfully:", data);
    } catch (error) {
      console.error("Error adding application:", error);
    }
  };

  return (
    <main>
      <div>
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : profile ? (
          <div className="profile-container">
            <div className="profile">
              <img src={profile.picture} alt="user image" />
              <div>
                <h3>Logged in as:</h3>
                <p>Full name: {profile.name}</p>
                <p>Username: {profile.email}</p>
              </div>
              <button onClick={logOut} className="log_out_button">
                Log out
              </button>
              <button className="add_button" onClick={openPopup}>
                Add Entry
              </button>
            </div>
          </div>
        ) : (
          <button className="sign_button" onClick={() => login()}>
            Sign in with Google 🚀{" "}
          </button>
        )}
      </div>
      <div className="map-container" ref={mapContainerRef}>
        <GoogleMap
          apiKey="AIzaSyCpSbd_GTUT5hRGzW-BBK6mXYX_quZ6ZOQ"
          defaultCenter={{ lat: 38.315463, lng: 26.638829 }}
          defaultZoom={15}
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

            <p>Latitude: {highlighted.lat}</p>
            <p>Longitude: {highlighted.lng}</p>
          </div>
        </div>
      )}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <div className="popup-header">
              <h3>Add Entry</h3>
              <button
                type="button"
                onClick={closePopup}
                className="close-button"
              >
                X
              </button>
            </div>
            <div className="form-container">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  className="input-field"
                  value={location}
                  onChange={handleLocationChange}
                />
                <div className="map2-container" ref={mapContainerRef}>
                  <GoogleMap
                    apiKey="YOUR_GOOGLE_MAPS_API_KEY"
                    defaultCenter={{ lat: 38.315463, lng: 26.638829 }}
                    defaultZoom={15}
                    onGoogleApiLoaded={onGoogleApiLoaded}
                    onClick={handleMapClick}
                  >
                    {latitude && longitude && (
                      <InfoWindow
                        position={{ lat: latitude, lng: longitude }}
                        onCloseClick={() => {
                          setLatitude(null);
                          setLongitude(null);
                        }}
                      >
                        <div>
                          Latitude: {latitude}
                          <br />
                          Longitude: {longitude}
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </div>
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
