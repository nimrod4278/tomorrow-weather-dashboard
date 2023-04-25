import React, { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_API_KEY
const API_CALL_INTERVAL_IN_MILI = 5 * 1000
const LOCATION = "JFK"

function App() {
  const [weather, setWeather] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const options = { method: 'GET', headers: { accept: 'application/json' } };
      let response = await fetch(`https://api.tomorrow.io/v4/weather/realtime?location=${LOCATION}&apikey=${API_KEY}`, options)
      response = await response.json()
      setWeather(response.data);
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchWeatherData()
    const interval = setInterval(() => {
      fetchWeatherData();
    }, API_CALL_INTERVAL_IN_MILI);

    return () => clearInterval(interval)
  }, []);

  const getBackgroundColor = () => {
    if (!weather) return;

    if (weather.values.temperature > 15) {
      return { color: 'green', message: 'All clear' };
    } else if (weather.values.temperature <= 15 && weather.values.temperature > 5) {
      return { color: 'orange', message: '[Extreme Cold] Keep You Warm (Hot Drinks/Soups)' };
    } else {
      return { color: 'red', message: '[Danger Cold] Stop the work and get inside' };
    }
  }


  return (
    <div style={{ height: "100%", width: "100%" }}>
      {weather ? (
        <div style={{ backgroundColor: getBackgroundColor().color, height: "100%", width: "100%" }}>
          <h1 style={{marginTop: "0"}}>Location: {LOCATION}</h1>
          <h1>Current Temperature: {weather.values.temperature}°C</h1>
          <h2>{getBackgroundColor().message}</h2>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
