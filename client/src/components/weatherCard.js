'use client';
import { useState, useEffect } from 'react';

function HomePage() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityInput, setCityInput] = useState('');

  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);

  const getLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          console.log(latitude, ' ',longitude);
        }, (error) => {
          console.error('Error fetching location data:', error);
          setError('Failed to fetch location data');
        });
      }
      else {
        console.error('Geolocation is not supported by this browser.');
      }
    }
    catch (error) {
      console.error('Error fetching location data:', error);
      setError('Failed to fetch location data');
    }
  }

  const getSunriseSunset = async () => {
    try {
      console.log(weatherData);
      const sunsetTime = new Date(Number(weatherData.sys.sunset) * 1000);
      const sunriseTime = new Date(Number(weatherData.sys.sunrise) * 1000);
      setSunrise(sunriseTime.toLocaleTimeString());
      setSunset(sunsetTime.toLocaleTimeString());
    }
    catch (error) {
      console.error('Error fetching sunrise and sunset data:', error);
      setError('Failed to fetch sunrise and sunset data');
    } 
  }

  const sendData = async (data) => {
    setLoading(true);
    setError(null);
    try {
      console.log(data);
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setWeatherData(result);
      console.log(result);
    } catch (error) {

      console.error('Error sending data:', error);
      setError('Failed to send data');

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      sendData({ latitude, longitude });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (weatherData) {
      getSunriseSunset();
    }
  }, [weatherData]);

  return (
    <div>
      <h1>Weather App</h1>
      <div>
        <h2>Weather at {weatherData?.name}</h2>
        <p>Main Weather: {weatherData?.weather[0]?.main}</p>
        <p>Description: {weatherData?.weather[0]?.description}</p>
        <p>Temperature: {(weatherData?.main?.temp - 273.15).toFixed(2)}°C</p>
        <p>Humidity: {weatherData?.main?.humidity}%</p>
        <p>Wind Speed: {weatherData?.wind?.speed} m/s</p>
        <p>Sunrise: {sunrise}</p>
        <p>Sunset: {sunset}</p>
      </div>
    </div>
  );
}
export default HomePage;