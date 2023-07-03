import GoogleMap from "google-maps-react-markers";
import { useEffect, useRef, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import Info from "./info";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import Marker from "./marker";
import "./style.css";
import axios from "axios";
import logo from "./pawsfind_logo.png";
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

  const isMobile = window.innerWidth <= 768;

  /**
   * @description This function is called when the map is ready
   * @param {Object} map - reference to the map instance
   * @param {Object} maps - reference to the maps library
   */
  // eslint-disable-next-line no-unused-vars
  const onGoogleApiLoaded = ({ map, maps }) => {
    mapRef.current = map;
    setMapReady(true);
    map.addListener("click", handleMapClick);
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    const maxSize = 500 * 1024; // 500KB

    if (!file || !allowedExtensions.exec(file.name)) {
      alert("Invalid file type. Only JPEG, JPG, and PNG files are allowed.");
      return;
    }

    if (file.size > maxSize) {
      alert("File size should be less than 500KB.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage((prevImage) => ({
        ...prevImage,
        file,
        base64: reader.result,
      }));
    };
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

  const onMarkerClick = (e, { markerId, lat, lng, markerDescription }) => {
    setHighlighted({ markerId, lat, lng, markerDescription });

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
    setLatitude(null);
    setLongitude(null);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isFound, setIsFound] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [image, setImage] = useState(null);

  const [display, setDisplay] = useState("all");

  const handleDisplay = (event) => {
    setDisplay(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleIsFound = (event) => {
    setIsFound(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setLatitude(lat);
    setLongitude(lng);

    console.log("Clicked coordinates:", lat, lng);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    if (!name || !latitude || !longitude || !image || !description) {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      const response = await fetch(`${URL}/api/addpet`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: profile.email,
          name: name,
          lat: latitude,
          lng: longitude,
          description: description,
          variant: isFound,
          image: image ? image.base64 : null,
        }),
      });
      const data = await response.json();
      console.log("Entry added successfully:", data);
      alert("Entry added successfully.");
      refreshPage();
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  const filteredMarkers =
    display === "all"
      ? coordinateData
      : coordinateData.filter((data) => data.variant === display);

  const [showMyEntries, setShowMyEntries] = useState(false);

  const handleShowMyEntries = () => {
    setShowMyEntries((prevState) => !prevState);
  };

  return (
    <main>
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <div className="profile-container">
          {loading ? (
            <p>Loading...</p>
          ) : profile ? (
            <div>
              <p style={{ color: "black", fontSize: "20px" }}>
                welcome, {profile.email.split("@")[0]}
              </p>
              <button onClick={logOut} className="log_out_button">
                Log out
              </button>

              <button className="add_button" onClick={openPopup}>
                Create Report
              </button>
              <select
                name="value"
                className="select-box"
                value={display}
                onChange={handleDisplay}
              >
                <option value="all">All</option>
                <option value="variant2">Found</option>
                <option value="variant1">Lost</option>
              </select>
              <div className="toggle-button-container">
                <button
                  onClick={handleShowMyEntries}
                  className={`toggle-button ${showMyEntries ? "active" : ""}`}
                >
                  <span className="toggle-text">
                    {showMyEntries ? "Hide My Entries" : "Show My Entries"}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <button className="sign_button" onClick={() => login()}>
              Sign in with Google 🚀
            </button>
          )}
        </div>
      </div>

      <div className="map-container" ref={mapContainerRef}>
        <GoogleMap
          apiKey="AIzaSyCpSbd_GTUT5hRGzW-BBK6mXYX_quZ6ZOQ"
          defaultCenter={{ lat: 38.315463, lng: 26.638829 }}
          defaultZoom={9}
          onGoogleApiLoaded={onGoogleApiLoaded}
          onChange={onMapChange}
        >
          {filteredMarkers.map(
            ({ lat, lng, name, variant, email, description }, index) => {
              if (showMyEntries && email !== profile.email) {
                return null; // Skip rendering this marker if it doesn't match the user's email
              }
              return (
                <Marker
                  key={index}
                  lat={lat}
                  lng={lng}
                  markerId={name}
                  markerDescription={description}
                  onClick={onMarkerClick}
                  className="marker"
                  variant={variant}
                />
              );
            }
          )}
        </GoogleMap>
      </div>
      {highlighted && (
        <div className="popup">
          <div className="popup-content">
            <div className="popup-header">
              <h3>
                {"Lost pet " +
                  highlighted.markerId +
                  ", uploaded by " + highlighted.email.split()"}
              </h3>
              <button
                type="button"
                onClick={() => setHighlighted(null)}
                className="close-button"
              >
                X
              </button>
            </div>

            <p>Name: {highlighted.markerId}</p>
            <p>Description: {highlighted.description}</p>
          </div>
        </div>
      )}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <div className="popup-header">
              <h3>Create Report</h3>
              <button
                type="button"
                onClick={closePopup}
                className="close-button"
              >
                X
              </button>
            </div>
            <div className="form-container flex items-center justify-center">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col w-1/2 h-5/8"
              >
                <div className="grid place-items-center">
                  <div
                    className="map2-container relative"
                    ref={mapContainerRef}
                  >
                    <GoogleMap
                      apiKey="AIzaSyCpSbd_GTUT5hRGzW-BBK6mXYX_quZ6ZOQ"
                      defaultCenter={{ lat: 38.315463, lng: 26.638829 }}
                      defaultZoom={9}
                      onGoogleApiLoaded={onGoogleApiLoaded}
                      onClick={handleMapClick}
                    >
                      {latitude && longitude && (
                        <Marker
                          lat={latitude}
                          lng={longitude}
                          markerId="selected"
                          className="marker"
                          variant={isFound}
                        />
                      )}
                    </GoogleMap>
                  </div>
                  <input
                    type="text"
                    name="Name"
                    placeholder="Name"
                    className="input-field mt-4"
                    value={name}
                    onChange={handleNameChange}
                  />
                  <div className="input-field w-3/4 h-16 p-2 m-2 border-2 border-gray-300 rounded-lg flex items-center justify-between">
                    <label className="browse-label overflow-hidden truncate">
                      {image ? (
                        <span className="overflow-hidden truncate">
                          Image Uploaded: {image.file.name}
                        </span>
                      ) : (
                        <span>Upload an Image</span>
                      )}
                      <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>

                  <div className="description-container mt-4">
                    <textarea
                      placeholder="Description"
                      className="input-field h-40 resize-y overflow-auto"
                      value={description}
                      onChange={handleDescriptionChange}
                    />
                  </div>
                  <select
                    name="value"
                    value={isFound}
                    onChange={handleIsFound}
                    className="input-field"
                  >
                    <option value="variant2">Found</option>
                    <option value="variant1">Lost</option>
                  </select>
                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;