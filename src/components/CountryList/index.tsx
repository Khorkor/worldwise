import Spinner from "../Spinner";
import styles from "./CountryList.module.css";
import Message from "../Message";
import CountryItem from "../CountryItem";
import { useCities } from "../../hooks/useCities";

interface Country {
  id: string; // Ensure id is always a string
  country: string;
  emoji: string;
}

const CountryList = () => {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;

  if (!cities.length) {
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );
  }

  const countries: Country[] = cities.reduce<Country[]>((arr, city) => {
    if (!arr.find((el) => el.country === city.country)) {
      return [
        ...arr,
        { id: city.id || "", country: city.country, emoji: city.emoji }, // Use a fallback for id if undefined
      ];
    }
    return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.id} country={country} />
      ))}
    </ul>
  );
};

export default CountryList;
