export interface City {
  cityName: string;
  country: string;
  emoji: string;
  date: Date;
  notes: string;
  position: {
    lat: number;
    lng: number;
  };
  id?: string;
}

export type Action =
  | { type: "loading" }
  | { type: "cities/loaded"; payload: City[] }
  | { type: "city/created"; payload: City }
  | { type: "city/deleted"; payload: string }
  | { type: "rejected"; payload: string }
  | { type: "city/loaded"; payload: City };
