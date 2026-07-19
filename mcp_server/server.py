#!/usr/bin/env python3
"""MCP Server with weather and time tools."""

import asyncio
import json
from datetime import datetime
import httpx
from mcp.server.models import InitializationOptions
from mcp.types import Tool, TextContent, ToolResult
import mcp.server.stdio

# Initialize the server
server = mcp.server.stdio.StdioServer("weather-time-server")


@server.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools."""
    return [
        Tool(
            name="get_weather",
            description="Get current weather information for a specified location. Returns temperature, conditions, and other weather data.",
            inputSchema={
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name or coordinates (e.g., 'New York' or '40.7128,-74.0060')",
                    },
                    "units": {
                        "type": "string",
                        "enum": ["metric", "imperial"],
                        "description": "Temperature units: 'metric' for Celsius, 'imperial' for Fahrenheit",
                    },
                },
                "required": ["location"],
            },
        ),
        Tool(
            name="get_time_info",
            description="Get current date, time, and timezone information for a specified timezone or location.",
            inputSchema={
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "Timezone name (e.g., 'UTC', 'America/New_York', 'Europe/London') or 'local' for local timezone",
                    },
                },
                "required": ["timezone"],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> ToolResult:
    """Handle tool calls."""
    if name == "get_weather":
        return await get_weather(arguments.get("location"), arguments.get("units", "metric"))
    elif name == "get_time_info":
        return await get_time_info(arguments.get("timezone", "local"))
    else:
        return ToolResult(content=[TextContent(type="text", text=f"Unknown tool: {name}")])


async def get_weather(location: str, units: str = "metric") -> ToolResult:
    """Fetch weather data from OpenWeatherMap API."""
    try:
        # Using a free weather API (Open-Meteo) that doesn't require authentication
        async with httpx.AsyncClient() as client:
            # For this example, we'll use a simplified approach
            # In production, use Open-Meteo or similar free API

            # Geocode the location first using Open-Meteo geocoding
            geo_url = "https://geocoding-api.open-meteo.com/v1/search"
            geo_params = {"name": location, "count": 1, "language": "en", "format": "json"}

            geo_response = await client.get(geo_url, params=geo_params)
            geo_data = geo_response.json()

            if not geo_data.get("results"):
                return ToolResult(
                    content=[TextContent(type="text", text=f"Location '{location}' not found")]
                )

            result = geo_data["results"][0]
            latitude = result["latitude"]
            longitude = result["longitude"]
            name = result.get("name", location)
            country = result.get("country", "")

            # Get weather data
            weather_url = "https://api.open-meteo.com/v1/forecast"
            weather_params = {
                "latitude": latitude,
                "longitude": longitude,
                "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
                "temperature_unit": "fahrenheit" if units == "imperial" else "celsius",
            }

            weather_response = await client.get(weather_url, params=weather_params)
            weather_data = weather_response.json()

            if "current" in weather_data:
                current = weather_data["current"]
                result_text = f"""Weather for {name}, {country}:
Temperature: {current.get('temperature_2m')}°{'F' if units == 'imperial' else 'C'}
Apparent Temperature: {current.get('apparent_temperature')}°{'F' if units == 'imperial' else 'C'}
Humidity: {current.get('relative_humidity_2m')}%
Wind Speed: {current.get('wind_speed_10m')} km/h
Precipitation: {current.get('precipitation')} mm
Conditions: {get_weather_description(current.get('weather_code', 0))}
"""
                return ToolResult(content=[TextContent(type="text", text=result_text)])
            else:
                return ToolResult(
                    content=[TextContent(type="text", text="Could not retrieve weather data")]
                )
    except Exception as e:
        return ToolResult(
            content=[TextContent(type="text", text=f"Error fetching weather: {str(e)}")]
        )


async def get_time_info(timezone: str) -> ToolResult:
    """Get current time and date information."""
    try:
        from zoneinfo import ZoneInfo

        if timezone.lower() == "local":
            tz = None
        else:
            try:
                tz = ZoneInfo(timezone)
            except Exception:
                return ToolResult(
                    content=[TextContent(type="text", text=f"Invalid timezone: {timezone}")]
                )

        now = datetime.now(tz)

        result_text = f"""Current Time Information:
Timezone: {timezone if timezone.lower() != 'local' else 'Local'}
Date: {now.strftime('%A, %B %d, %Y')}
Time: {now.strftime('%H:%M:%S %Z')}
UTC Offset: {now.strftime('%z')}
ISO Format: {now.isoformat()}
"""
        return ToolResult(content=[TextContent(type="text", text=result_text)])
    except Exception as e:
        return ToolResult(
            content=[TextContent(type="text", text=f"Error getting time info: {str(e)}")]
        )


def get_weather_description(code: int) -> str:
    """Convert WMO weather code to human-readable description."""
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


async def main():
    """Main server loop."""
    async with server:
        await server.wait_for_shutdown()


if __name__ == "__main__":
    asyncio.run(main())
