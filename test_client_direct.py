import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient

async def main():
    print("=" * 60)
    print("🧪 MCP Direct Client Test (No LLM Required)")
    print("=" * 60)

    # Initialize MCP Client with Math and Weather servers
    print("\n📡 Connecting to MCP Servers...")
    client = MultiServerMCPClient(
        {
            "math": {
                "command": "python3",
                "args": ["mathserver.py"],
                "transport": "stdio",
            },
            "weather": {
                "url": "http://localhost:8000/mcp",
                "transport": "streamable_http",
            }
        }
    )

    try:
        # Get all available tools from both servers
        tools = await client.get_tools()
        print(f"\n✅ Loaded {len(tools)} tools from servers:")
        
        # Build a dict of tools for easy lookup
        tool_dict = {}
        for tool in tools:
            print(f"   • {tool.name}: {tool.description.splitlines()[0]}")
            tool_dict[tool.name] = tool

        print("\n" + "=" * 60)
        print("🧮 Calling Math Server directly...")
        print("=" * 60)
        
        if "add" in tool_dict:
            add_tool = tool_dict["add"]
            # Call add(15, 30)
            # langchain tools are typically called via invoke or ainvoke
            result = await add_tool.ainvoke({"a": 15, "b": 30})
            print(f"Result of add(15, 30): {result}")
        else:
            print("❌ 'add' tool not found!")

        if "multiply" in tool_dict:
            mult_tool = tool_dict["multiply"]
            # Call multiply(6, 7)
            result = await mult_tool.ainvoke({"a": 6, "b": 7})
            print(f"Result of multiply(6, 7): {result}")
        else:
            print("❌ 'multiply' tool not found!")

        print("\n" + "=" * 60)
        print("🌤️ Calling Weather Server directly...")
        print("=" * 60)

        if "get_weather" in tool_dict:
            weather_tool = tool_dict["get_weather"]
            # Call get_weather("London")
            result = await weather_tool.ainvoke({"location": "London"})
            print(f"Result of get_weather('London'): {result}")
            
            # Call get_weather("Tokyo")
            result = await weather_tool.ainvoke({"location": "Tokyo"})
            print(f"Result of get_weather('Tokyo'): {result}")
        else:
            print("❌ 'get_weather' tool not found!")

    except Exception as e:
        print(f"\n❌ Error encountered during execution: {str(e)}")
        print("💡 Make sure weather.py is running on http://localhost:8000!")

    print("\n" + "=" * 60)
    print("🏁 Direct Client Test Complete!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
