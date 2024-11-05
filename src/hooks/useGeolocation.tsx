import { useState } from "react";

interface Position {
  lat: number;
  lng: number;
}

interface GeolocationState {
  isLoading: boolean;
  position: Position | null;
  error: string | null;
  getPosition: () => void;
}

export const useGeolocation = (
  defaulPosition: Position | null = null
): GeolocationState => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [position, setPosition] = useState<Position | null>(defaulPosition);
  const [error, setError] = useState<string | null>(null);

  const getPosition = () => {
    if (!navigator.geolocation) {
      return setError("Your browser does not support geolocation");
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError(error.message);
        setIsLoading(false);
      }
    );
  };

  return { isLoading, position, error, getPosition };
};
