import { useSearchParams } from "react-router-dom";

export const useUrlPosition = () => {
  const [searchParams] = useSearchParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");

  return [lat, lng];
};
