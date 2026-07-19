#!/usr/bin/env python3
"""
MCP Server with basic tools using the Python MCP SDK.
This server provides text processing, math operations, and API utilities.
"""

import json
import asyncio
import logging
from typing import Optional
from mcp.server import Server, RequestContext
from mcp.types import Tool, TextContent, ToolResult
import mcp.server.stdio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# API Configuration - Set via environment variable
import os
API_KEY = os.getenv("MCP_API_KEY", "")

# Initialize MCP Server
server = Server("mcp-server-python-sdk")


class TextProcessor:
    """Text processing utilities."""

    @staticmethod
    def uppercase(text: str) -> str:
        """Convert text to uppercase."""
        return text.upper()

    @staticmethod
    def lowercase(text: str) -> str:
        """Convert text to lowercase."""
        return text.lower()

    @staticmethod
    def reverse(text: str) -> str:
        """Reverse text."""
        return text[::-1]

    @staticmethod
    def word_count(text: str) -> int:
        """Count words in text."""
        return len(text.split())

    @staticmethod
    def character_count(text: str) -> int:
        """Count characters in text."""
        return len(text)


class MathOperations:
    """Basic math operations."""

    @staticmethod
    def add(a: float, b: float) -> float:
        """Add two numbers."""
        return a + b

    @staticmethod
    def subtract(a: float, b: float) -> float:
        """Subtract two numbers."""
        return a - b

    @staticmethod
    def multiply(a: float, b: float) -> float:
        """Multiply two numbers."""
        return a * b

    @staticmethod
    def divide(a: float, b: float) -> float:
        """Divide two numbers."""
        if b == 0:
            raise ValueError("Division by zero is not allowed")
        return a / b

    @staticmethod
    def power(base: float, exponent: float) -> float:
        """Calculate base raised to exponent."""
        return base ** exponent


class APIUtilities:
    """API and system utilities."""

    @staticmethod
    def get_api_status() -> dict:
        """Get API status and authentication info."""
        return {
            "status": "active",
            "api_key_configured": bool(API_KEY),
            "version": "1.0.0",
            "timestamp": asyncio.get_event_loop().time()
        }

    @staticmethod
    def validate_api_key(key: str) -> dict:
        """Validate API key."""
        is_valid = key == API_KEY
        return {
            "valid": is_valid,
            "matches_configured_key": is_valid
        }

    @staticmethod
    def get_server_info() -> dict:
        """Get server information."""
        return {
            "name": "MCP Python SDK Server",
            "version": "1.0.0",
            "description": "A basic MCP server with text processing, math operations, and API utilities",
            "tools_available": 11
        }


# Define tools
def get_tools() -> list[Tool]:
    """Define all available tools."""
    return [
        Tool(
            name="uppercase_text",
            description="Convert text to uppercase",
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "The text to convert"
                    }
                },
                "required": ["text"]
            }
        ),
        Tool(
            name="lowercase_text",
            description="Convert text to lowercase",
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "The text to convert"
                    }
                },
                "required": ["text"]
            }
        ),
        Tool(
            name="reverse_text",
            description="Reverse a text string",
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "The text to reverse"
                    }
                },
                "required": ["text"]
            }
        ),
        Tool(
            name="word_count",
            description="Count the number of words in text",
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "The text to analyze"
                    }
                },
                "required": ["text"]
            }
        ),
        Tool(
            name="character_count",
            description="Count the number of characters in text",
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "The text to analyze"
                    }
                },
                "required": ["text"]
            }
        ),
        Tool(
            name="math_add",
            description="Add two numbers",
            inputSchema={
                "type": "object",
                "properties": {
                    "a": {
                        "type": "number",
                        "description": "First number"
                    },
                    "b": {
                        "type": "number",
                        "description": "Second number"
                    }
                },
                "required": ["a", "b"]
            }
        ),
        Tool(
            name="math_multiply",
            description="Multiply two numbers",
            inputSchema={
                "type": "object",
                "properties": {
                    "a": {
                        "type": "number",
                        "description": "First number"
                    },
                    "b": {
                        "type": "number",
                        "description": "Second number"
                    }
                },
                "required": ["a", "b"]
            }
        ),
        Tool(
            name="math_divide",
            description="Divide two numbers",
            inputSchema={
                "type": "object",
                "properties": {
                    "a": {
                        "type": "number",
                        "description": "Numerator"
                    },
                    "b": {
                        "type": "number",
                        "description": "Denominator"
                    }
                },
                "required": ["a", "b"]
            }
        ),
        Tool(
            name="get_api_status",
            description="Get API status and configuration",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        ),
        Tool(
            name="validate_api_key",
            description="Validate an API key",
            inputSchema={
                "type": "object",
                "properties": {
                    "key": {
                        "type": "string",
                        "description": "The API key to validate"
                    }
                },
                "required": ["key"]
            }
        ),
        Tool(
            name="get_server_info",
            description="Get server information",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        )
    ]


@server.list_tools()
async def list_tools(ctx: RequestContext) -> list[Tool]:
    """List all available tools."""
    return get_tools()


@server.call_tool()
async def call_tool(ctx: RequestContext, name: str, arguments: dict) -> ToolResult:
    """Handle tool calls."""
    logger.info(f"Calling tool: {name} with arguments: {arguments}")

    try:
        # Text processing tools
        if name == "uppercase_text":
            result = TextProcessor.uppercase(arguments.get("text", ""))
            return ToolResult(content=[TextContent(type="text", text=result)])

        elif name == "lowercase_text":
            result = TextProcessor.lowercase(arguments.get("text", ""))
            return ToolResult(content=[TextContent(type="text", text=result)])

        elif name == "reverse_text":
            result = TextProcessor.reverse(arguments.get("text", ""))
            return ToolResult(content=[TextContent(type="text", text=result)])

        elif name == "word_count":
            result = TextProcessor.word_count(arguments.get("text", ""))
            return ToolResult(content=[TextContent(type="text", text=f"Word count: {result}")])

        elif name == "character_count":
            result = TextProcessor.character_count(arguments.get("text", ""))
            return ToolResult(content=[TextContent(type="text", text=f"Character count: {result}")])

        # Math operation tools
        elif name == "math_add":
            result = MathOperations.add(arguments.get("a", 0), arguments.get("b", 0))
            return ToolResult(content=[TextContent(type="text", text=f"Result: {result}")])

        elif name == "math_multiply":
            result = MathOperations.multiply(arguments.get("a", 0), arguments.get("b", 0))
            return ToolResult(content=[TextContent(type="text", text=f"Result: {result}")])

        elif name == "math_divide":
            result = MathOperations.divide(arguments.get("a", 0), arguments.get("b", 1))
            return ToolResult(content=[TextContent(type="text", text=f"Result: {result}")])

        # API utility tools
        elif name == "get_api_status":
            result = APIUtilities.get_api_status()
            return ToolResult(content=[TextContent(type="text", text=json.dumps(result, indent=2))])

        elif name == "validate_api_key":
            result = APIUtilities.validate_api_key(arguments.get("key", ""))
            return ToolResult(content=[TextContent(type="text", text=json.dumps(result, indent=2))])

        elif name == "get_server_info":
            result = APIUtilities.get_server_info()
            return ToolResult(content=[TextContent(type="text", text=json.dumps(result, indent=2))])

        else:
            return ToolResult(content=[TextContent(type="text", text=f"Unknown tool: {name}")])

    except Exception as e:
        logger.error(f"Error calling tool {name}: {str(e)}")
        return ToolResult(
            content=[TextContent(type="text", text=f"Error: {str(e)}")],
            is_error=True
        )


async def main():
    """Run the MCP server."""
    logger.info("Starting MCP Server with Python SDK")
    logger.info(f"API Key configured: {bool(API_KEY)}")

    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            asyncio.Event()
        )


if __name__ == "__main__":
    asyncio.run(main())
