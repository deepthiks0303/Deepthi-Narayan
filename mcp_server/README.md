# Weather and Time MCP Server

A Model Context Protocol (MCP) server that provides two useful tools for Claude agents:

1. **get_weather** - Get current weather information for any location
2. **get_time_info** - Get current date, time, and timezone information

## Features

### Weather Tool
- Get real-time weather data for any city or coordinates
- Support for both metric (Celsius) and imperial (Fahrenheit) units
- Returns temperature, humidity, wind speed, precipitation, and weather conditions
- Uses the free Open-Meteo API (no API key required)

### Time Tool
- Get current date and time in any timezone
- Support for IANA timezone names (e.g., 'America/New_York', 'Europe/London')
- Returns time in ISO format, human-readable format, and with UTC offset
- Can also get local timezone information

## Installation

### Prerequisites
- Python 3.8+
- pip

### Setup

1. Navigate to the mcp_server directory:
```bash
cd mcp_server
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

Or install the package:
```bash
pip install -e .
```

## Usage

### Running the Server

To run the MCP server:
```bash
python server.py
```

The server will start listening on stdin/stdout for MCP protocol messages.

### Configuring with Claude Desktop

Add the following to your Claude Desktop configuration file:

**On macOS/Linux:** `~/.config/Claude/claude.json`
**On Windows:** `%APPDATA%\Claude\claude.json`

```json
{
  "mcpServers": {
    "weather-time": {
      "command": "python",
      "args": [
        "/path/to/mcp_server/server.py"
      ]
    }
  }
}
```

### Using with Claude

Once configured, you can ask Claude to use these tools:

**Weather Examples:**
- "What's the weather like in New York?"
- "Tell me the weather in London in Celsius"
- "What's the temperature in Tokyo?"

**Time Examples:**
- "What time is it in Tokyo?"
- "Tell me the current date in UTC"
- "What's the time in America/Los_Angeles?"

## Tool Specifications

### get_weather

**Parameters:**
- `location` (string, required): City name or coordinates (e.g., "New York" or "40.7128,-74.0060")
- `units` (string, optional): Temperature units - "metric" for Celsius or "imperial" for Fahrenheit (default: "metric")

**Returns:**
Current weather information including:
- Temperature
- Apparent temperature
- Humidity
- Wind speed
- Precipitation
- Weather conditions

### get_time_info

**Parameters:**
- `timezone` (string, required): IANA timezone name (e.g., "UTC", "America/New_York") or "local" for local timezone

**Returns:**
- Current date in human-readable format
- Current time with timezone
- UTC offset
- ISO format timestamp

## API Dependencies

This server uses the following free, no-authentication-required APIs:

1. **Open-Meteo Geocoding API** - For converting location names to coordinates
2. **Open-Meteo Weather API** - For fetching current weather data

Both APIs are free and don't require API keys.

## Development

To modify or extend this server:

1. Edit `server.py` to add new tools or modify existing ones
2. Update tool definitions in the `list_tools()` function
3. Add handler functions and register them in the `call_tool()` function
4. Install in development mode: `pip install -e .`

## Troubleshooting

**"Location not found"** - Try using a more specific location name or coordinates

**"Invalid timezone"** - Ensure you're using a valid IANA timezone name. Common examples:
- UTC, GMT
- America/New_York, America/Los_Angeles
- Europe/London, Europe/Paris
- Asia/Tokyo, Asia/Shanghai

**Connection errors** - Ensure you have internet access and the APIs are reachable

## License

MIT License
