import { FC } from "react";
import styles from "./CountryItem.module.css";
import FlagEmoji from "../FlagEmoji";

interface Country {
  emoji: string;
  country: string;
}

interface CountryItemProps {
  country: Country;
}

const CountryItem: FC<CountryItemProps> = ({ country }) => {
  return (
    <li className={styles.countryItem}>
      <span>{FlagEmoji(country.emoji)}</span>
      <span>{country.country}</span>
    </li>
  );
};

export default CountryItem;
