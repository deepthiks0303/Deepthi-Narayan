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
        model="gemini-flash-latest",
        google_api_key=GEMINI_API_KEY,
        temperature=0.7,
        top_p=0.9
    )

    # Create ReAct agent with Gemini
    agent = create_react_agent(model, tools)

    print("\n" + "=" * 60)
    print("💬 Interactive MCP Client Chat Ready! (Type 'quit' or 'exit' to exit)")
    print("=" * 60)

    chat_history = []

    while True:
        try:
            user_input = input("\nYou: ").strip()
            if not user_input:
                continue
            if user_input.lower() in ["quit", "exit"]:
                print("Goodbye!")
                break

            chat_history.append({"role": "user", "content": user_input})
            print("Thinking...")

            # Retry mechanism for transient API errors (e.g. 503 Server Busy)
            max_retries = 3
            response = None
            for attempt in range(max_retries):
                try:
                    response = await agent.ainvoke({"messages": chat_history})
                    break
                except Exception as e:
                    if "503" in str(e) and attempt < max_retries - 1:
                        print(f"⚠️ Model busy (503). Retrying in 2 seconds... (Attempt {attempt + 1}/{max_retries})")
                        await asyncio.sleep(2)
                    else:
                        raise e

            if response:
                agent_response = response['messages'][-1].content
                print(f"\nAgent: {agent_response}")
                chat_history.append({"role": "assistant", "content": agent_response})
            else:
                print("\n❌ Error: Failed to get response after retries.")

        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
