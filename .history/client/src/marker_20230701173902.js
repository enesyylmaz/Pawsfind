const Marker = ({
  className,
  lat,
  lng,
  markerId,
  onClick,
  mapRef,
  ...props
}) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapRef && mapRef.current && markerRef.current) {
      const map = mapRef.current.getMap();
      const marker = markerRef.current;

      // Set marker position
      const position = new window.google.maps.LatLng(lat, lng);
      marker.setPosition(position);

      // Attach marker to the map
      marker.setMap(map);
    }
  }, [lat, lng, mapRef]);

  return (
    <img
      ref={markerRef}
      className={className}
      src={markerPin}
      style={{ cursor: "pointer", fontSize: 40, position: "absolute" }}
      alt={markerId}
      onClick={(e) => (onClick ? onClick(e, { markerId, lat, lng }) : null)}
      {...props}
    />
  );
};
