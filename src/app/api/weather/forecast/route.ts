import { NextResponse } from 'next/server';

const OPENMETEO_API = 'https://api.open-meteo.com/v1';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing location ID' },
        { status: 400 }
      );
    }

    // First, get coordinates for the city
    const geocodingResponse = await fetch(
      `${OPENMETEO_API}/geocoding?name=${encodeURIComponent(id)}&count=1&language=en&format=json`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!geocodingResponse.ok) {
      throw new Error(`OpenMeteo Geocoding API error: ${geocodingResponse.statusText}`);
    }

    const geocodingData = await geocodingResponse.json();
    
    if (!geocodingData.results || geocodingData.results.length === 0) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    const { latitude, longitude } = geocodingData.results[0];

    // Then, get weather data for the coordinates
    const weatherResponse = await fetch(
      `${OPENMETEO_API}/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,pressure_msl&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!weatherResponse.ok) {
      throw new Error(`OpenMeteo Weather API error: ${weatherResponse.statusText}`);
    }

    const weatherData = await weatherResponse.json();

    // Transform the data to match our frontend expectations
    const transformedData = {
      current: {
        temperature: weatherData.hourly.temperature_2m[0],
        humidity: weatherData.hourly.relative_humidity_2m[0],
        windSpeed: weatherData.hourly.wind_speed_10m[0],
        pressure: weatherData.hourly.pressure_msl[0],
      },
      hourly: weatherData.hourly.time.map((time: string, index: number) => ({
        time,
        temperature: weatherData.hourly.temperature_2m[index],
        humidity: weatherData.hourly.relative_humidity_2m[index],
        windSpeed: weatherData.hourly.wind_speed_10m[index],
        pressure: weatherData.hourly.pressure_msl[index],
      })),
      daily: weatherData.daily.time.map((time: string, index: number) => ({
        time,
        maxTemp: weatherData.daily.temperature_2m_max[index],
        minTemp: weatherData.daily.temperature_2m_min[index],
        precipitationProb: weatherData.daily.precipitation_probability_max[index],
      })),
      location: {
        name: geocodingData.results[0].name,
        country: geocodingData.results[0].country,
        latitude,
        longitude,
      },
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch weather data. Please try again later.' },
      { status: 500 }
    );
  }
} 