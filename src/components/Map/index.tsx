import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useCities } from "../../hooks/useCities";
import FlagEmoji from "../FlagEmoji";
import { useGeolocation } from "../../hooks/useGeolocation";
import Button from "../Buttons/Button";
import { useUrlPosition } from "../../hooks/useUrlPosition";

type ChangeCenterProps = {
  position: [number, number];
};

const ChangeCenter = ({ position }: ChangeCenterProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [map, position]);

  return null;
};

const DetectClick = () => {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });

  return null;
};

const Map = () => {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState<[number, number]>([39, 32]);

  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  const [lat, lng] = useUrlPosition();

  useEffect(() => {
    if (lat && lng) {
      setMapPosition([lat, lng]);
    }
  }, [lat, lng]);

  useEffect(() => {
    if (geolocationPosition) {
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    }
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {mapPosition[0] !== geolocationPosition?.lat &&
        mapPosition[1] !== geolocationPosition?.lng && (
          <Button type="position" onClick={getPosition}>
            {isLoadingPosition ? "Loading..." : "Use Your Position"}
          </Button>
        )}

      <MapContainer
        center={mapPosition}
        zoom={8}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{FlagEmoji(city.emoji)}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
};

export default Map;
