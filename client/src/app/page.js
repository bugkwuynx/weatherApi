'use client';

import WeatherCard from '@/components/weatherCard';
import WeatherCardInCity from '@/components/weatherCardInCity';

function HomePage() {

  return (
    <div>
      <WeatherCard />
      <WeatherCardInCity />
    </div>
  );
}

export default HomePage;
