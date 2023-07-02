import { func, number, oneOfType, string, object } from "prop-types";
import markerPin from "./marker-pin.png";

const marker = ({ className, lat, lng, markerId, onClick, ...props }) => {
  return (
    <img
      className={className}
      src={markerPin}
      // eslint-disable-next-line react/no-unknown-property
      lat={lat}
      // eslint-disable-next-line react/no-unknown-property
      lng={lng}
      onClick={(e) => (onClick ? onClick(e, { markerId, lat, lng }) : null)}
      style={{ cursor: "pointer", fontSize: 40 }}
      alt={markerId}
      {...props}
    />
  );
};

marker.defaultProps = {};

öarker.propTypes = {
  className: string,
  /**
   * The id of the marker.
   */
  markerId: oneOfType([number, string]).isRequired,
  /**
   * The latitude of the marker.
   */
  lat: number.isRequired,
  /**
   * The longitude of the marker.
   */
  lng: number.isRequired,
  /**
   * The function to call when the marker is clicked.
   */
  onClick: func,

  clusterer: object,
};

export default marker;
