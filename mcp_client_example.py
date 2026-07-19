#!/usr/bin/env python3
"""
Example client for testing the MCP server.
Demonstrates how to interact with the MCP server tools.
"""

import json
import subprocess
import sys
from typing import Any


class MCPClientExample:
    """Example client for MCP server interaction."""

    def __init__(self, server_command: str = "python mcp_server.py"):
        """Initialize the example client."""
        self.server_command = server_command
        self.process = None

    def start_server(self):
        """Start the MCP server process."""
        print("Starting MCP server...")
        # Note: In a real implementation, you would use proper IPC/stdio communication
        # This is a simplified example
        print(f"Command to start server: {self.server_command}")

    def stop_server(self):
        """Stop the MCP server process."""
        if self.process:
            self.process.terminate()
            print("Server stopped")

    def test_text_processing(self):
        """Test text processing tools."""
        print("\n" + "=" * 50)
        print("Testing Text Processing Tools")
        print("=" * 50)

        tests = [
            {"tool": "uppercase_text", "args": {"text": "hello world"}},
            {"tool": "lowercase_text", "args": {"text": "HELLO WORLD"}},
            {"tool": "reverse_text", "args": {"text": "hello"}},
            {"tool": "word_count", "args": {"text": "the quick brown fox"}},
            {"tool": "character_count", "args": {"text": "hello"}},
        ]

        for test in tests:
            print(f"\nTool: {test['tool']}")
            print(f"Input: {json.dumps(test['args'])}")
            print(f"Expected output sample shown in MCP_SERVER_README.md")

    def test_math_operations(self):
        """Test math operation tools."""
        print("\n" + "=" * 50)
        print("Testing Math Operation Tools")
        print("=" * 50)

        tests = [
            {"tool": "math_add", "args": {"a": 10, "b": 5}},
            {"tool": "math_multiply", "args": {"a": 4, "b": 3}},
            {"tool": "math_divide", "args": {"a": 20, "b": 4}},
        ]

        for test in tests:
            print(f"\nTool: {test['tool']}")
            print(f"Input: {json.dumps(test['args'])}")
            print(f"Expected result shown in MCP_SERVER_README.md")

    def test_api_utilities(self):
        """Test API utility tools."""
        print("\n" + "=" * 50)
        print("Testing API Utility Tools")
        print("=" * 50)

        tests = [
            {
                "tool": "validate_api_key",
                "args": {
                    "key": "your-api-key-here"
                },
            },
            {"tool": "get_api_status", "args": {}},
            {"tool": "get_server_info", "args": {}},
        ]

        for test in tests:
            print(f"\nTool: {test['tool']}")
            print(f"Input: {json.dumps(test['args'])}")
            print(f"Expected output shown in MCP_SERVER_README.md")

    def run_all_tests(self):
        """Run all test groups."""
        print("MCP Server Example Client")
        print("=" * 50)
        print("This client demonstrates the available tools.")
        print("To actually run these tools, start the MCP server and")
        print("connect via Claude or another MCP client.")
        print("=" * 50)

        self.test_text_processing()
        self.test_math_operations()
        self.test_api_utilities()

        print("\n" + "=" * 50)
        print("Testing Complete")
        print("=" * 50)
        print("\nTo use the server with Claude:")
        print("1. Add the server to your Claude configuration")
        print("2. Start the server with: python mcp_server.py")
        print("3. Use the tools in Claude")


def main():
    """Run the example client."""
    client = MCPClientExample()
    client.run_all_tests()


if __name__ == "__main__":
    main()
