import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function WeatherCardInCity() {
    const [city, setCity] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sunrise, setSunrise] = useState(null);
    const [sunset, setSunset] = useState(null);

    const getGeolocation = async () => {
        try {
            console.log(city);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/geolocation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    city: city,
                }),
            });
            const data = await response.json();
            console.log(data);
            setLatitude(data[0].lat);
            setLongitude(data[0].lon);
            return data;
        } catch (error) {
            console.error('Error fetching geolocation:', error);
        }
    }
    
    const getSunriseSunset = async (weatherData) => {
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
    
    const getWeather = async () => {
        try {
            const data = await getGeolocation();
            console.log(data);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/weather`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({latitude: data[0].lat, longitude: data[0].lon}),
            });
            const weatherData = await response.json();
            console.log(weatherData);
            setWeather(weatherData);
            getSunriseSunset(weatherData);
        }
        catch (error) {
            console.error('Error fetching weather:', error);
        }
    }
    return (
        <div>
            <div>
                <input type="text" placeholder="Enter city name" value={city} onChange={(e) => setCity(e.target.value)}/>
                <button onClick={getWeather}>Get Weather</button>
            </div>
            <div>
                <Card className="w-full max-w-4xl">
                    <CardHeader>
                        <CardTitle className="text-center">Weather at {weather?.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-center">   
                        <p>Main Weather: {weather?.weather[0]?.main}</p>
                        <p>Description: {weather?.weather[0]?.description}</p>
                        <p>Temperature: {(weather?.main?.temp - 273.15).toFixed(2)}°C</p>
                        <p>Humidity: {weather?.main?.humidity}%</p>
                        <p>Wind Speed: {weather?.wind?.speed} m/s</p>
                        <p>Sunrise: {sunrise}</p>
                        <p>Sunset: {sunset}</p>
                        </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default WeatherCardInCity;