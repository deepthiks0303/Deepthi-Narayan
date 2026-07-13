from mcp.server.fastmcp import FastMCP
import aiohttp
import json

mcp = FastMCP("Weather")

# Mock weather data - can be replaced with real API calls
WEATHER_DATA = {
    "California": "Sunny, 75°F (24°C), Light breeze",
    "New York": "Cloudy, 68°F (20°C), Moderate wind",
    "London": "Rainy, 59°F (15°C), Strong wind",
    "Tokyo": "Partly cloudy, 72°F (22°C), Calm",
    "Sydney": "Sunny, 77°F (25°C), Light breeze",
    "India": "Hot and humid, 89°F (32°C), Light wind",
    "Paris": "Clear, 64°F (18°C), Light breeze",
}

@mcp.tool()
async def get_weather(location: str) -> str:
    """Get the weather for a specific location.

    Args:
        location: The location name (city/region)

    Returns:
        Weather information as a string
    """

    # Check if we have data for this location
    if location in WEATHER_DATA:
        return f"Weather in {location}: {WEATHER_DATA[location]}"

    # Try to get real weather data from Open-Meteo API (free, no API key needed)
    try:
        # Geocode the location
        async with aiohttp.ClientSession() as session:
            geocode_url = f"https://geocoding-api.open-meteo.com/v1/search?name={location}&count=1&language=en&format=json"
            async with session.get(geocode_url) as resp:
                geo_data = await resp.json()

        if geo_data.get("results"):
            result = geo_data["results"][0]
            lat = result.get("latitude")
            lon = result.get("longitude")
            city = result.get("name")
            country = result.get("country")

            # Get weather data
            async with aiohttp.ClientSession() as session:
                weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit"
                async with session.get(weather_url) as resp:
                    weather_data = await resp.json()

            current = weather_data.get("current", {})
            temp = current.get("temperature_2m", "N/A")
            wind = current.get("wind_speed_10m", "N/A")

            weather_desc = get_weather_description(current.get("weather_code", 0))

            return f"Weather in {city}, {country}: {weather_desc}, Temperature: {temp}°F, Wind: {wind} km/h"
        else:
            return f"Could not find weather data for '{location}'. Try a major city name."

    except Exception as e:
        return f"Weather for {location}: Unable to fetch real-time data. Error: {str(e)}"


def get_weather_description(code: int) -> str:
    """Convert WMO weather code to description"""
    codes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail",
    }
    return codes.get(code, "Unknown")


if __name__ == "__main__":
    print("🌤️ Starting Weather Server on HTTP transport...")
    print("📍 Available at: http://localhost:8000/mcp")
    mcp.run(transport="streamable-http")
