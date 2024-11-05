import { v4 as uuidv4 } from "uuid"; // Ensure uuid is imported for generating unique IDs

// Mock in-memory data for testing
let cities = [
  {
    cityName: "Lisbon",
    country: "Portugal",
    emoji: "🇵🇹",
    date: "2027-10-31T15:59:59.138Z",
    notes: "My favorite city so far!",
    position: { lat: 38.727881642324164, lng: -9.140900099907554 },
    id: "73930385",
  },
  {
    cityName: "Madrid",
    country: "Spain",
    emoji: "🇪🇸",
    date: "2027-07-15T08:22:53.976Z",
    notes: "",
    position: { lat: 40.46635901755316, lng: -3.7133789062500004 },
    id: "17806751",
  },
  {
    cityName: "Berlin",
    country: "Germany",
    emoji: "🇩🇪",
    date: "2027-02-12T09:24:11.863Z",
    notes: "Amazing 😃",
    position: { lat: 52.53586782505711, lng: 13.376933665713324 },
    id: "98443197",
  },
];

export async function handler(event, context) {
  const { httpMethod, path, body } = event;

  switch (httpMethod) {
    case "GET":
      // Handle GET requests
      if (path.includes("/cities/")) {
        const id = path.split("/").pop();
        const city = cities.find((city) => city.id === id);
        return {
          statusCode: 200,
          body: JSON.stringify(city || { error: "City not found" }),
        };
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify(cities),
        };
      }

    case "POST":
      // Handle POST requests to add a new city
      try {
        const newCity = JSON.parse(body);
        newCity.id = uuidv4(); // Assign a unique ID to the new city
        cities.push(newCity); // Add the new city to the array
        return {
          statusCode: 201,
          body: JSON.stringify(newCity),
        };
      } catch (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid city data" }),
        };
      }

    case "DELETE":
      // Handle DELETE requests to remove a city by ID
      const deleteId = path.split("/").pop();
      const index = cities.findIndex((city) => city.id === deleteId);
      if (index !== -1) {
        cities.splice(index, 1);
        return {
          statusCode: 204,
          body: "",
        };
      }
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "City not found" }),
      };

    default:
      // Handle unsupported HTTP methods
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
  }
}
