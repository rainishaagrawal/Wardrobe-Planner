const { OPENWEATHER_API_KEY } = require('../../config/env');

const getCurrentWeather = async (user) => {
  // 1. Get city from user, fallback to "Delhi" if not provided
  const city = user?.location || "Delhi";

  if (!OPENWEATHER_API_KEY) {
    console.warn("No OPENWEATHER_API_KEY found, falling back to mock weather.");
    return getMockWeather();
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenWeather API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    const temp = data.main.temp;
    const feelsLike = data.main.feels_like;
    const weatherMain = data.weather && data.weather.length > 0 ? data.weather[0].main.toLowerCase() : 'clear';
    
    // Map OpenWeather main to our internal conditions
    let condition = "clear";
    let rain = false;
    
    if (weatherMain.includes("cloud")) {
      condition = "cloudy";
    } else if (weatherMain.includes("rain") || weatherMain.includes("drizzle") || weatherMain.includes("thunderstorm")) {
      condition = "rainy";
      rain = true;
    } else if (weatherMain.includes("snow")) {
      condition = "snow";
    } else if (weatherMain.includes("clear")) {
      condition = "sunny";
    } else {
      // fallback for mist, haze, etc.
      condition = "cloudy";
    }

    return {
      temperature: Math.round(temp),
      feelsLike: Math.round(feelsLike),
      condition: condition,
      rain: rain,
      city: data.name
    };

  } catch (error) {
    console.error("Error fetching real weather, falling back to mock weather:", error.message);
    return getMockWeather();
  }
};

const getMockWeather = () => {
  return {
    temperature: 28,
    feelsLike: 30,
    condition: "partly-cloudy",
    rain: false,
    city: "Delhi"
  };
};

module.exports = { getCurrentWeather };
