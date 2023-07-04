import React from "react";
import PropTypes from "prop-types";
import markerPin1 from "./marker-pin.png";
import markerPin2 from "./marker-pin2.png";

const Marker = ({
  className,
  lat,
  lng,
  variant,
  markerId,
  markerDescription,
  markerEmail,
  markerVariant,
  petImage,
  markerDate,
  markerTags,
  dbID,
  onClick,
  ...props
}) => {
  const markerImage = variant === "Lost" ? markerPin1 : markerPin2;

  return (
    <img
      className={className}
      src={markerImage}
      lat={lat}
      lng={lng}
      onClick={(e) =>
        onClick
          ? onClick(e, {
              markerId,
              lat,
              lng,
              markerDescription,
              markerEmail,
              markerVariant,
              petImage,
              markerDate,
              markerTags,
            })
          : null
      }
      style={{ cursor: "pointer", fontSize: 40 }}
      alt={markerId}
      {...props}
    />
  );
};

Marker.defaultProps = {
  variant: "Found",
};

Marker.propTypes = {
  className: PropTypes.string,
  /**
   * The id of the marker.
   */
  markerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * The latitude of the marker.
   */
  lat: PropTypes.number.isRequired,
  /**
   * The longitude of the marker.
   */
  lng: PropTypes.number.isRequired,
  /**
   * The function to call when the marker is clicked.
   */
  onClick: PropTypes.func,
  /**
   * The variant of the marker image.
   */
  variant: PropTypes.oneOf(["Lost", "Found"]),
};

export default Marker;
