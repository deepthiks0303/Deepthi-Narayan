from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI
import os
import asyncio
from dotenv import load_dotenv

load_dotenv()

# Get API key from environment
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GEMINI_API_KEY:
    print("❌ Error: GOOGLE_API_KEY environment variable not set!")
    print("\n📝 To fix this, run:")
    print("   export GOOGLE_API_KEY='your_api_key_here'")
    print("\nThen run this script again.")
    exit(1)

async def main():
    print("=" * 60)
    print("🚀 MCP Client with Google Gemini API")
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

    # Get all available tools from both servers
    tools = await client.get_tools()
    print(f"✅ Loaded {len(tools)} tools from servers:")
    for tool in tools:
        print(f"   • {tool.name}: {tool.description}")

    # Initialize Google Gemini LLM
    print("\n🤖 Initializing Google Gemini API...")
    model = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=GEMINI_API_KEY,
        temperature=0.7,
        top_p=0.9
    )

    # Create ReAct agent with Gemini
    agent = create_react_agent(model, tools)

    print("\n" + "=" * 60)
    print("📊 Example 1: Math Query")
    print("=" * 60)

    try:
        math_response = await agent.ainvoke(
            {"messages": [{"role": "user", "content": "What is (3 + 5) x 12?"}]}
        )
        print(f"\n🧮 Math Response: {math_response['messages'][-1].content}")
    except Exception as e:
        print(f"❌ Error in math query: {str(e)}")
        print("💡 Make sure mathserver.py is running!")

    print("\n" + "=" * 60)
    print("📊 Example 2: Weather Query")
    print("=" * 60)

    try:
        weather_response = await agent.ainvoke(
            {"messages": [{"role": "user", "content": "What is the weather in California?"}]}
        )
        print(f"\n🌤️ Weather Response: {weather_response['messages'][-1].content}")
    except Exception as e:
        print(f"❌ Error in weather query: {str(e)}")
        print("💡 Make sure weather.py is running on http://localhost:8000!")

    print("\n" + "=" * 60)
    print("📊 Example 3: Combined Query")
    print("=" * 60)

    try:
        combined_response = await agent.ainvoke(
            {"messages": [{"role": "user", "content": "Calculate 25 + 75 and tell me the sum"}]}
        )
        print(f"\n✨ Combined Response: {combined_response['messages'][-1].content}")
    except Exception as e:
        print(f"❌ Error in combined query: {str(e)}")

    print("\n" + "=" * 60)
    print("✅ MCP Client Demo Complete!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
