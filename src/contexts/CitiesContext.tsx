import { createContext, FC, ReactNode, useEffect, useReducer } from "react";
import { Action, City } from "../types/cities";

const BASE_URL = "/.netlify/functions/citiesApi";

interface CitiesContextType {
  cities: City[];
  isLoading: boolean;
  currentCity: City | null;
  getCity: (id: string) => void;
  createCity: (newCity: City) => void;
  deleteCity: (id: string) => void;
  error: string;
}

interface CitiesProviderProps {
  children: ReactNode;
}

const initialState: CitiesContextType = {
  cities: [],
  isLoading: false,
  currentCity: null,
  getCity: () => {},
  createCity: () => {},
  deleteCity: () => {},
  error: "",
};

const CitiesContext = createContext<CitiesContextType>(initialState);

const reducer = (
  state: CitiesContextType,
  action: Action
): CitiesContextType => {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: null,
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error:
          typeof action.payload === "string"
            ? action.payload
            : "An unknown error occurred",
      };

    default:
      throw new Error("Unknown action type");
  }
};

const CitiesProvider: FC<CitiesProviderProps> = ({ children }) => {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    const fetchCities = async () => {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities.",
        });
      }
    };
    fetchCities();
  }, []);

  const getCity = async (id: string) => {
    if (id === currentCity?.id) return;

    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading the city.",
      });
    }
  };

  const createCity = async (newCity: City) => {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city.",
      });
    }
  };

  const deleteCity = async (id: string) => {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city.",
      });
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

export { CitiesProvider, CitiesContext };
