import React, { useContext, useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "../Buttons/Button";
import BackButton from "../Buttons/BackButton";
import { useUrlPosition } from "../../hooks/useUrlPosition";
import FlagEmoji from "../FlagEmoji";
import Message from "../Message";
import Spinner from "../Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../../hooks/useCities";
import { City } from "../../types/cities";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

const Form: React.FC = () => {
  const [lat, lng] = useUrlPosition();
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState<boolean>(false);
  const [cityName, setCityName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("");
  const [geoCodingError, setGeoCodingError] = useState<string>("");

  useEffect(() => {
    if (!lat && !lng) return;
    const fetchCityData = async () => {
      try {
        setIsLoadingGeocoding(true);
        setGeoCodingError("");
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        if (!data.countryCode) {
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else 😉"
          );
        }

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName || "");
        setEmoji(data.countryCode || "");
      } catch (error: unknown) {
        if (error instanceof Error) {
          setGeoCodingError(error.message);
        }
      } finally {
        setIsLoadingGeocoding(false);
      }
    };

    fetchCityData();
  }, [lat, lng]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity: City = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };
    await createCity(newCity);
    navigate("/app/cities");
  };

  if (isLoadingGeocoding) return <Spinner />;
  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map" />;
  if (geoCodingError) return <Message message={geoCodingError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji ? FlagEmoji(emoji) : ""}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          selected={date}
          onChange={(date: Date | null) => {
            if (date) {
              setDate(date);
            }
          }}
          dateFormat="dd.MM.yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
};

export default Form;
