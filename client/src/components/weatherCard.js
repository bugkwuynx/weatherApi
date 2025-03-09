import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  

function WeatherCard() {
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
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const result = await response.json();
      setWeatherData(result);
    } catch (error) {
      console.error('Error sending data:', error);
      setError(error.message || 'Failed to send data');
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
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Weather App</h1>
      <Card className="w-full max-w-4xl">
        <CardHeader>
            <CardTitle className="text-center">Weather at {weatherData?.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-center">   
            <p>Main Weather: {weatherData?.weather[0]?.main}</p>
            <p>Description: {weatherData?.weather[0]?.description}</p>
            <p>Temperature: {(weatherData?.main?.temp - 273.15).toFixed(2)}°C</p>
            <p>Humidity: {weatherData?.main?.humidity}%</p>
            <p>Wind Speed: {weatherData?.wind?.speed} m/s</p>
            <p>Sunrise: {sunrise}</p>
            <p>Sunset: {sunset}</p>
        </CardContent>
      </Card>
    </div>
  );
}
export default WeatherCard;