import { FC } from "react";
import FlagEmoji from "../FlagEmoji";
import { Link } from "react-router-dom";
import { useCities } from "../../hooks/useCities";
import { City } from "../../types/cities";

import styles from "./CityItem.module.css";

interface CityItemProps {
  city: City;
}
const formatDate = (date: Date | null): string =>
  new Intl.DateTimeFormat("tr", {
    dateStyle: "short",
  }).format(date ? new Date(date) : new Date());

const CityItem: FC<CityItemProps> = ({ city }) => {
  const { currentCity, deleteCity } = useCities();
  const { cityName, emoji, date, id, position } = city;

  const handleDelete = (e: any) => {
    e.preventDefault();
    if (id) {
      deleteCity(id);
    }
  };

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity?.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{FlagEmoji(emoji)}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          &times;
        </button>
      </Link>
    </li>
  );
};

export default CityItem;
