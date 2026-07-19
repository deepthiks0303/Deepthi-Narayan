# MCP Server - Python SDK

A basic Model Context Protocol (MCP) server built with Python MCP SDK, providing text processing, mathematical operations, and API utilities.

## Features

### Text Processing Tools
- **uppercase_text**: Convert text to uppercase
- **lowercase_text**: Convert text to lowercase
- **reverse_text**: Reverse a text string
- **word_count**: Count words in text
- **character_count**: Count characters in text

### Math Operation Tools
- **math_add**: Add two numbers
- **math_multiply**: Multiply two numbers
- **math_divide**: Divide two numbers (with zero-division protection)

### API Utility Tools
- **get_api_status**: Get API status and configuration
- **validate_api_key**: Validate an API key against the configured key
- **get_server_info**: Get server information and available tools

## Installation

### Prerequisites
- Python 3.8+
- pip package manager

### Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Verify installation:**
```bash
python -m pip list | grep mcp
```

## Usage

### Running the Server

Run the MCP server using stdio transport:
```bash
python mcp_server.py
```

The server will start and listen for incoming requests via stdio.

### Configuration for Claude

To use this MCP server with Claude, update your Claude configuration file:

**For Claude Desktop:**
- macOS: `~/.claude/config.json`
- Linux: `~/.config/claude/config.json`
- Windows: `%APPDATA%\Claude\config.json`

Add the server configuration:
```json
{
  "mcpServers": {
    "mcp-python-sdk": {
      "command": "python",
      "args": [
        "/absolute/path/to/mcp_server.py"
      ]
    }
  }
}
```

### Testing Tools

You can test the server by calling tools with the following examples:

#### Text Processing
```
Tool: uppercase_text
Input: {"text": "hello world"}
Output: "HELLO WORLD"
```

#### Math Operations
```
Tool: math_add
Input: {"a": 10, "b": 5}
Output: "Result: 15"
```

#### API Utilities
```
Tool: get_api_status
Input: {}
Output: {"status": "active", "api_key_configured": true, ...}
```

## API Key Configuration

The server requires an API key to be set via the `MCP_API_KEY` environment variable:

```bash
export MCP_API_KEY="your-api-key-here"
python mcp_server.py
```

Or in the Claude configuration:
```json
{
  "env": {
    "MCP_API_KEY": "your-api-key-here"
  }
}
```

You can validate your API key using the `validate_api_key` tool.

## Available Tools Summary

| Tool Name | Type | Description |
|-----------|------|-------------|
| uppercase_text | Text | Convert text to uppercase |
| lowercase_text | Text | Convert text to lowercase |
| reverse_text | Text | Reverse text string |
| word_count | Text | Count words in text |
| character_count | Text | Count characters in text |
| math_add | Math | Add two numbers |
| math_multiply | Math | Multiply two numbers |
| math_divide | Math | Divide two numbers |
| get_api_status | API | Get API status |
| validate_api_key | API | Validate API key |
| get_server_info | API | Get server information |

## Architecture

### Components

1. **TextProcessor**: Handles all text manipulation operations
2. **MathOperations**: Provides mathematical calculations
3. **APIUtilities**: Manages API status and validation
4. **Server**: Main MCP server instance using Python MCP SDK

### Tool Handler Flow

1. Request arrives via stdio
2. `list_tools()` handles tool discovery
3. `call_tool()` routes to appropriate handler
4. Result is formatted and returned

## Error Handling

The server includes error handling for:
- Division by zero (math_divide)
- Invalid tool names
- Missing required arguments
- General exceptions

All errors are logged and returned to the client with `is_error=True`.

## Development

### Adding New Tools

1. Create a new class or method in the appropriate processor class
2. Add the tool definition to `get_tools()`
3. Add handler logic in `call_tool()`
4. Test the tool

Example:
```python
@server.call_tool()
async def call_tool(ctx: RequestContext, name: str, arguments: dict) -> ToolResult:
    if name == "new_tool":
        result = SomeClass.new_method(arguments.get("param"))
        return ToolResult(content=[TextContent(type="text", text=result)])
```

## Logging

The server uses Python's standard logging module. Logs include:
- Tool calls with arguments
- Errors and exceptions
- Server startup information

## Performance Considerations

- All operations are synchronous for simplicity
- No caching is implemented
- Suitable for low to medium load scenarios

## License

This MCP server is provided as-is for educational and integration purposes.

## Support

For issues or questions:
1. Check the logs for error messages
2. Verify the API key configuration
3. Ensure the MCP SDK is properly installed
