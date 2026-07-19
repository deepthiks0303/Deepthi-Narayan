#!/usr/bin/env python3
"""Example usage of the Weather and Time MCP Server with Claude."""

import anthropic
from typing import Any

# This example shows how to use the MCP server tools with Claude
# In practice, the MCP server would be registered with Claude Desktop or another client

def example_usage():
    """Demonstrate using the MCP server tools."""

    client = anthropic.Anthropic()

    # Define the tools that the MCP server exposes
    tools = [
        {
            "name": "get_weather",
            "description": "Get current weather information for a specified location. Returns temperature, conditions, and other weather data.",
            "input_schema": {
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
        },
        {
            "name": "get_time_info",
            "description": "Get current date, time, and timezone information for a specified timezone or location.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "Timezone name (e.g., 'UTC', 'America/New_York', 'Europe/London') or 'local' for local timezone",
                    },
                },
                "required": ["timezone"],
            },
        },
    ]

    # Example: Ask Claude to check the weather
    messages = [
        {
            "role": "user",
            "content": "What's the weather like in New York and what time is it there?",
        }
    ]

    print("User: What's the weather like in New York and what time is it there?")
    print()

    # Make the API call with tools
    response = client.messages.create(
        model="claude-opus-4-1",
        max_tokens=1024,
        tools=tools,
        messages=messages,
    )

    # Process the response
    for block in response.content:
        if hasattr(block, "text"):
            print(f"Claude: {block.text}")
        elif block.type == "tool_use":
            print(f"Claude wants to use tool: {block.name}")
            print(f"With inputs: {block.input}")

    print("\n" + "="*50 + "\n")

    # Example: Ask Claude to plan a trip
    messages = [
        {
            "role": "user",
            "content": "I'm planning a trip to Tokyo. Can you tell me the weather there and what time it is?",
        }
    ]

    print("User: I'm planning a trip to Tokyo. Can you tell me the weather there and what time it is?")
    print()

    response = client.messages.create(
        model="claude-opus-4-1",
        max_tokens=1024,
        tools=tools,
        messages=messages,
    )

    for block in response.content:
        if hasattr(block, "text"):
            print(f"Claude: {block.text}")
        elif block.type == "tool_use":
            print(f"Claude wants to use tool: {block.name}")
            print(f"With inputs: {block.input}")


if __name__ == "__main__":
    example_usage()
