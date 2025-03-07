import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const {latitude, longitude} = await request.json();
        if (!latitude || !longitude) {
            return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
        }
        const apiURL = `${process.env.NEXT_PUBLIC_WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`;
        const response = await fetch(apiURL);
        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
    }
}