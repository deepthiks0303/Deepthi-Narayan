#!/usr/bin/env python3
"""Setup configuration for the MCP server."""

from setuptools import setup, find_packages

setup(
    name="weather-time-mcp-server",
    version="0.1.0",
    description="MCP Server with weather and time information tools",
    author="Deepthi Narayan",
    python_requires=">=3.8",
    packages=find_packages(),
    install_requires=[
        "mcp>=0.1.0",
        "httpx>=0.24.0",
        "python-dotenv>=1.0.0",
    ],
    entry_points={
        "console_scripts": [
            "weather-time-server=server:main",
        ],
    },
)
