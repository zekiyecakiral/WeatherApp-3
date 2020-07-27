import React, { useState } from "react";
import "./App.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

export default function Weather() {
  const [cities, setCities] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [city, setCity] = useState("");

  // const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
  const API_KEY = "2c15e16ab21e2ac37c7a627756f01940";
  const getWeather = (cityName) => {
    const END_POINT = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
    fetch(END_POINT)
      .then((resp) => {
        if (!resp.ok) {
          throw Error(resp.statusText);
        }
        return resp.json();
      })
      .then((response) => {
        const {
          name,
          sys: { country },
          main: { temp_max, temp_min },
          weather: [{ main, description }],
          coord: { lat, lon },
        } = response;
        setCities([
          ...cities,
          {
            description: {
              name,
              country,
              main,
              description,
              lat,
              lon,
              temp_max,
              temp_min,
            },
            id: Date.now(),
          },
        ]);
        setHasError(false);
      })
      .catch((error) => {
        setHasError(true);
      });
  };

  const searchCityWeather = () => {
    getWeather(city);
    setCity("");
  };

  return (
    <div>
      <form noValidate autoComplete="off">
        <TextField
          className="input"
          id="outlined-basic"
          label="City"
          variant="outlined"
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={searchCityWeather}
        >
          Search
        </Button>
      </form>

      {hasError && (
        <Card>
          {" "}
          <CardContent>
            {" "}
            <Typography variant="h5" component="h2" color="secondary">
              ERROR
            </Typography>
            <Typography variant="h5" color="secondary">
              Please be sure to enter a meaningful city name!
            </Typography>
          </CardContent>
        </Card>
      )}

      {cities.map((city) => (
        <Card className="container" key={city.id}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {city.description.name}, {city.description.country}{" "}
            </Typography>

            <Typography color="textSecondary">
              {city.description.main}
            </Typography>

            <Typography variant="body2" component="p">
              {city.description.description}
              <br />
              <br />
              <span>min temp: </span> {city.description.temp_min}
              <br />
              <span>max temp: </span> {city.description.temp_max}
            </Typography>
          </CardContent>
          <HighlightOffIcon
            color="secondary"
            style={{ fontSize: 40 }}
            onClick={() => {
              const selectedId = city.id;
              const remainingCities = cities.filter(
                (item) => item.id !== selectedId
              );
              setCities(remainingCities);
            }}
          />
        </Card>
      ))}
    </div>
  );
}
