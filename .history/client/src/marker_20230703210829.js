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
  markerVariant,
  markerEmail,
  petImage,
  markerDate,
  tags,
  onClick,
  ...props
}) => {
  const markerImage = markerVariant === "Lost" ? markerPin1 : markerPin2;

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
              markerVariant,
              markerEmail,
              petImage,
              markerDate,
              tags,
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
  variant: "Lost",
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

  description: PropTypes.string,

  tags: PropTypes.arrayOf(PropTypes.string),
};

export default Marker;
