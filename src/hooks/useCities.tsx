import { useContext } from "react";
import { CitiesContext } from "../contexts/CitiesContext";

export const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
};
